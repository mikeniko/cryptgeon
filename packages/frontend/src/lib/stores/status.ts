import { API, type Status } from 'cryptgeonmk/shared'
import { writable } from 'svelte/store'

export const status = writable<null | Status>(null)

export async function init() {
	status.set(await API.status())
}
