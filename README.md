# NoteLAN

NoteLAN is a desktop-only Obsidian plugin for sharing selected notes and folders as read-only web pages on your local network.

## Features

- Share individual Markdown notes or complete folders.
- Keep access local to private network addresses.
- Optional secret token in shared URLs.
- Anonymous local analytics with views and approximate unique visitors per page.
- English by default, with automatic French support when Obsidian uses a French locale.
- Custom themes, accent color, content width, font and CSS.
- Optional automatic server shutdown, disabled by default.

## Privacy

NoteLAN runs an HTTP server on your computer and stores its configuration locally. Analytics never store IP addresses or URL tokens. Visitors are counted with a random `HttpOnly` cookie, and only its salted hash is retained.

Only share notes that may safely be read by other devices connected to your local network.

## Installation

1. Download `main.js`, `manifest.json` and `styles.css` from a release.
2. Create `<vault>/.obsidian/plugins/local-note-share/`.
3. Copy the three files into that folder.
4. Reload Obsidian and enable **NoteLAN** in Community plugins.

The technical plugin ID remains `local-note-share` to preserve compatibility with existing installations.

## Development

```bash
npm install
npm run validate
```

The production build is written to `main.js`.

## Author

[OlivierLB](https://github.com/OlivierLB)
