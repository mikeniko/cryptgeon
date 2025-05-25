<p align="center">
  <img src="./design/Github.png" alt="logo">
</p>

<a href="https://discord.gg/nuby6RnxZt">
  <img alt="discord" src="https://img.shields.io/discord/252403122348097536?style=for-the-badge" />
  <img alt="docker pulls" src="https://img.shields.io/docker/pulls/cupcakearmy/cryptgeon?style=for-the-badge" />
  <img alt="Docker image size badge" src="https://img.shields.io/docker/image-size/cupcakearmy/cryptgeon?style=for-the-badge" />
  <img alt="Latest version" src="https://img.shields.io/github/v/release/cupcakearmy/cryptgeon?style=for-the-badge" />
</a>

<br/><br/>
<a href="https://www.producthunt.com/posts/cryptgeon?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-cryptgeon" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=295189&theme=light" alt="Cryptgeon - Securely share self-destructing notes | Product Hunt" height="50" /></a>
<a href=""><img src="./.github/lokalise.png" height="50">
<a title="Install cryptgeon Raycast Extension" href="https://www.raycast.com/cupcakearmy/cryptgeon"><img src="https://www.raycast.com/cupcakearmy/cryptgeon/install_button@2x.png?v=1.1" height="64" alt="" style="height: 64px;"></a>
<br/><br/>

EN | [简体中文](README_zh-CN.md) | [ES](README_ES.md)

## About?

_cryptgeon_ is a secure, open source sharing note or file service inspired by [_PrivNote_](https://privnote.com).
It includes a server, a web page and a CLI client.

> 🌍 If you want to translate the project feel free to reach out to me.
>
> Thanks to [Lokalise](https://lokalise.com/) for providing free access to their platform.

## Live Service / Demo

### Web

Check out the live service / demo and see for yourself [cryptgeon.org](https://cryptgeon.org)

### CLI

```
npx cryptgeon send text "This is a secret note"
```

For more documentation about the CLI see the [readme](./packages/cli/README.md).

### Raycast Extension

There is an [official Raycast extension](https://www.raycast.com/cupcakearmy/cryptgeon).

<a title="Install cryptgeon Raycast Extension" href="https://www.raycast.com/cupcakearmy/cryptgeon"><img src="https://www.raycast.com/cupcakearmy/cryptgeon/install_button@2x.png?v=1.1" height="64" alt="" style="height: 64px;"></a>

## Features

- send text or files
- server cannot decrypt contents due to client side encryption
- view or time constraints
- in memory, no persistence
- obligatory dark mode support

## How does it work?

each note has a generated <code>id (256bit)</code> and <code>key 256(bit)</code>. The
<code>id</code>
is used to save & retrieve the note. the note is then encrypted with aes in gcm mode on the
client side with the <code>key</code> and then sent to the server. data is stored in memory and
never persisted to disk. the server never sees the encryption key and cannot decrypt the contents
of the notes even if it tried to.

> View counts are guaranteed with one running instance of cryptgeon. Multiple instances connected to the same Redis instance can run into race conditions, where a note might be retrieved more than the view count allows.

## Screenshot

![screenshot](./design/Screens.png)

## Environment Variables

| Variable                | Default          | Description                                                                                                                                                                                                   |
| ----------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REDIS`                 | `redis://redis/` | Redis URL to connect to. [According to format](https://docs.rs/redis/latest/redis/#connection-parameters)                                                                                                     |
| `SIZE_LIMIT`            | `1 KiB`          | Max size for body. Accepted values according to [byte-unit](https://docs.rs/byte-unit/). <br> `512 MiB` is the maximum allowed. <br> The frontend will show that number including the ~35% encoding overhead. |
| `MAX_VIEWS`             | `100`            | Maximal number of views.                                                                                                                                                                                      |
| `MAX_EXPIRATION`        | `360`            | Maximal expiration in minutes.                                                                                                                                                                                |
| `DEFAULT_EXPIRE`        | `60`             | Default expiration in minutes. Default value is used in a simple mode or when advanced mode with mode switch enabled (per default, see `DISABLE_MODE_SWITCH`) and views are limited.                          |
| `DEFAULT_VIEWS`         | `0`              | Default views. Default value is used in the advanced mode with expiration defined or when advanced mode is disabled (`ALLOW_ADVANCED` set to false).                                                          | 
| `ALLOW_ADVANCED`        | `true`           | Allow custom configuration. If set to `false` all notes will have infinite views unless `DEFAULT_VIEWS` is set to non zerro vale and will expire after default expiration (set in `DEFAULT_EXPIRE`).          |
| `ALLOW_FILES`           | `true`           | Allow uploading files. If set to `false`, users will only be allowed to create text notes.                                                                                                                    |
| `ID_LENGTH`             | `32`             | Set the size of the note `id` in bytes. By default this is `32` bytes. This is useful for reducing link size. _This setting does not affect encryption strength_.                                             |
| `VERBOSITY`             | `warn`           | Verbosity level for the backend. [Possible values](https://docs.rs/env_logger/latest/env_logger/#enabling-logging) are: `error`, `warn`, `info`, `debug`, `trace`                                             |
| `THEME_IMAGE`           | `""`             | Custom image for replacing the logo. Must be publicly reachable                                                                                                                                               |
| `THEME_TEXT`            | `""`             | Custom text for replacing the description below the logo                                                                                                                                                      |
| `THEME_PAGE_TITLE`      | `""`             | Custom text the page title                                                                                                                                                                                    |
| `THEME_FAVICON`         | `""`             | Custom url for the favicon. Must be publicly reachable                                                                                                                                                        |
| `THEME_NEW_NOTE_NOTICE` | `true`           | Show the message about how notes are stored in the memory and may be evicted after creating a new note. Defaults to `true`.                                                                                   |
| `IMPRINT_URL`           | `""`             | Custom url for an Imprint hosted somewhere else. Must be publicly reachable. Takes precedence above `IMPRINT_HTML`.                                                                                           |
| `IMPRINT_HTML`          | `""`             | Alternative to `IMPRINT_URL`, this can be used to specify the HTML code to show on `/imprint`. Only `IMPRINT_HTML` or `IMPRINT_URL` should be specified, not both.                                            |
| `FOOTER_HTML`            | `""`             | Custom text for the fuuter in the new note page. Could be used to reference some external resources like confluence page.                                                                                                                                                     |
| `DISABLE_MODE_SWITCH`   | `false`          | Disables mode switch in the advanced mode. This makes both views and expiration fields editable and allows to define both limits at the same time.                                                            |

## Deployment

> ℹ️ `https` is required otherwise browsers will not support the cryptographic functions.

> ℹ️ There is a health endpoint available at `/api/health/`. It returns either 200 or 503.

### Docker

Docker is the easiest way. There is the [official image here](https://hub.docker.com/r/cupcakearmy/cryptgeon).

```yaml
# docker-compose.yml

version: '3.8'

services:
  redis:
    image: redis:7-alpine
    # This is required to stay in RAM only.
    command: redis-server --save "" --appendonly no
    # Set a size limit. See link below on how to customise.
    # https://redis.io/docs/latest/operate/rs/databases/memory-performance/eviction-policy/
    # --maxmemory 1gb --maxmemory-policy allkeys-lrulpine
    # This prevents the creation of an anonymous volume.
    tmpfs:
      - /data

  app:
    image: cupcakearmy/cryptgeon:latest
    depends_on:
      - redis
    environment:
      # Size limit for a single note.
      SIZE_LIMIT: 4 MiB
    ports:
      - 80:8000

    # Optional health checks
    # healthcheck:
    #   test: ["CMD", "curl", "--fail", "http://127.0.0.1:8000/api/live/"]
    #   interval: 1m
    #   timeout: 3s
    #   retries: 2
    #   start_period: 5s
```

### NGINX Proxy

See the [examples/nginx](https://github.com/cupcakearmy/cryptgeon/tree/main/examples/nginx) folder. There an example with a simple proxy, and one with https. You need to specify the server names and certificates.

### Traefik 2

See the [examples/traefik](https://github.com/cupcakearmy/cryptgeon/tree/main/examples/traefik) folder.

### Scratch

See the [examples/scratch](https://github.com/cupcakearmy/cryptgeon/tree/main/examples/scratch) folder. There you'll find a guide how to setup a server and install cryptgeon from scratch.

### Synology

There is a [guide](https://mariushosting.com/how-to-install-cryptgeon-on-your-synology-nas/) you can follow.

### YouTube Guides

- English by [Webnestify](https://www.youtube.com/watch?v=XAyD42I7wyI)
- English by [DB Tech](https://www.youtube.com/watch?v=S0jx7wpOfNM) [Previous Video](https://www.youtube.com/watch?v=JhpIatD06vE)
- German by [ApfelCast](https://www.youtube.com/watch?v=84ZMbE9AkHg)

### Written Guides

- French by [zarevskaya](https://belginux.com/installer-cryptgeon-avec-docker/)
- Italian by [@nicfab](https://notes.nicfab.eu/it/posts/cryptgeon/)
- English by [@nicfab](https://notes.nicfab.eu/en/posts/cryptgeon/)

## Development

**Requirements**

- `pnpm`: `>=9`
- `node`: `>=22`
- `rust`: edition `2021`

**Install**

```bash
pnpm install

# Also you need cargo watch if you don't already have it installed.
# https://lib.rs/crates/cargo-watch
cargo install cargo-watch
```

**Run**

Make sure you have docker running.

```bash
pnpm run dev
```

Running `pnpm run dev` in the root folder will start the following things:

- redis docker container
- rust backend
- client
- cli

You can see the app under [localhost:3000](http://localhost:3000).

> There is a Postman collection with some example requests [available in the repo](./Cryptgeon.postman_collection.json)

### Tests

Tests are end to end tests written with Playwright.

```sh
pnpm run test:prepare

# Use the test or test:local script. The local version only runs in one browser for quicker development.
pnpm run test:local
```

## Security

Please refer to the security section [here](./SECURITY.md).

---

_Attributions_

- Test data:
  - Text for tests [Nietzsche Ipsum](https://nietzsche-ipsum.com/)
  - [AES Paper](https://www.cs.miami.edu/home/burt/learning/Csc688.012/rijndael/rijndael_doc_V2.pdf)
  - [Unsplash Pictures](https://unsplash.com/)
- Loading animation by [Nikhil Krishnan](https://codepen.io/nikhil8krishnan/pen/rVoXJa)
- Icons made by <a href="https://www.freepik.com" title="Freepik">freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
