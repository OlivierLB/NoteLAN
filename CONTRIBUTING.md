# Contributing to NoteLAN

Thanks for helping improve NoteLAN. Bug reports, focused feature proposals, documentation fixes, and pull requests are welcome.

## Before opening an issue

- Search existing issues first.
- Confirm the problem still happens with the latest release.
- Test with a minimal vault when possible.
- Never attach private notes, URL tokens, IP addresses, or a complete `data.json` file.

## Development setup

Requirements:

- Node.js 22 or newer
- npm
- Obsidian desktop 1.5.0 or newer

```bash
git clone https://github.com/OlivierLB/NoteLAN.git
cd NoteLAN
npm ci
npm run validate
```

For local testing, copy or link the repository to `<vault>/.obsidian/plugins/local-note-share/`, run `npm run dev`, reload Obsidian, and enable NoteLAN.

## Pull requests

1. Create a focused branch from `main`.
2. Keep behavior changes covered by tests.
3. Run `npm run validate` before pushing.
4. Update the README or changelog when behavior changes.
5. Explain the user impact and testing performed in the pull request.

Do not commit `data.json`, vault notes, `node_modules`, generated test directories, or personal tokens.

By contributing, you agree that your contribution is licensed under the project's MIT License.
