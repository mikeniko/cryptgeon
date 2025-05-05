import type { KeyData, TypedArray } from 'occulto'

export type NoteMeta = {
  type: 'text' | 'file'
  derivation?: KeyData
}

export type Note = {
  contents: string
  meta: NoteMeta
  views?: number
  expiration?: number
}
export type NoteInfo = Pick<Note, 'meta'>
export type NotePublic = Pick<Note, 'contents' | 'meta'>
export type NoteCreate = Omit<Note, 'meta'> & { meta: string }

export type FileDTO = Pick<File, 'name' | 'size' | 'type'> & {
  contents: TypedArray
}

export type EncryptedFileDTO = Omit<FileDTO, 'contents'> & {
  contents: string
}

type ClientOptions = {
  server: string
}

type CallOptions = {
  url: string
  method: string
  body?: any
}

export class PayloadToLargeError extends Error {}

export let client: ClientOptions = {
  server: '',
}

function setOptions(options: Partial<ClientOptions>) {
  client = { ...client, ...options }
}

function getOptions(): ClientOptions {
  return client
}

async function call(options: CallOptions) {
  const url = client.server + '/api/' + options.url
  const response = await fetch(url, {
    method: options.method,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 413) throw new PayloadToLargeError()
    else throw new Error('API call failed')
  }
  return response.json()
}

async function create(note: Note) {
  const { meta, ...rest } = note
  const body: NoteCreate = {
    ...rest,
    meta: JSON.stringify(meta),
  }
  const data = await call({
    url: 'notes/',
    method: 'post',
    body,
  })
  return data as { id: string }
}

async function get(id: string): Promise<NotePublic> {
  const data = await call({
    url: `notes/${id}`,
    method: 'delete',
  })
  const { contents, meta } = data
  const note = {
    contents,
    meta: JSON.parse(meta),
  } satisfies NotePublic
  if (note.meta.derivation) note.meta.derivation.salt = new Uint8Array(Object.values(note.meta.derivation.salt))
  return note
}

async function info(id: string): Promise<NoteInfo> {
  const data = await call({
    url: `notes/${id}`,
    method: 'get',
  })
  const { meta } = data
  const note = {
    meta: JSON.parse(meta),
  } satisfies NoteInfo
  if (note.meta.derivation) note.meta.derivation.salt = new Uint8Array(Object.values(note.meta.derivation.salt))
  return note
}

export type Status = {
  version: string
  max_size: number
  max_views: number
  max_expiration: number
  default_expiration: number
  allow_advanced: boolean
  allow_files: boolean
  imprint_url: string
  imprint_html: string
  disable_mode_sw: boolean
  theme_image: string
  theme_text: string
  theme_favicon: string
  theme_page_title: string
  theme_new_note_notice: boolean
}

async function status() {
  const data = await call({
    url: 'status/',
    method: 'get',
  })
  return data as Status
}

export const API = {
  setOptions,
  getOptions,
  create,
  get,
  info,
  status,
}
