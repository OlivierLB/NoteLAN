# Changelog

All notable changes to NoteLAN are documented here. This project follows [Semantic Versioning](https://semver.org/).

## [0.4.0] - 2026-11-02

### Added

- Added a navigable outline for shared notes, displayed in a sticky right-hand panel on desktop and above the content on narrow screens.

## [0.3.8] - 2026-08-19

### Fixed

- Restored the complete settings interface after the declarative settings regression in 0.3.7.

### Changed

- Restored compatibility with Obsidian 1.5.0 and newer.

## [0.3.7] - 2026-08-19

### Changed

- Adopted the declarative settings API introduced in Obsidian 1.13.0 so settings participate in search.
- Replaced deprecated destructive-button, slider-tooltip, and clipboard fallback APIs.
- Raised the minimum supported Obsidian version to 1.13.0.

## [0.3.6] - 2026-08-19

### Changed

- Updated the manifest description to comply with the community plugin guidelines.
- Limited folder indexing to explicitly shared folders instead of enumerating the entire vault.

## [0.3.5] - 2026-08-18

### Added

- Public project documentation in English and French.
- MIT license, contribution guide, security policy, and community templates.
- Continuous integration and automated release workflows.
- Obsidian-specific ESLint checks.

### Changed

- Renamed the public plugin identity to NoteLAN.
- Added OlivierLB as the author with a GitHub profile link.

## [0.3.4] - 2026-08-18

### Added

- Initial public source release.
- Read-only local sharing for selected notes and folders.
- Theme customization and custom CSS.
- Anonymous local analytics, including views and approximate unique visitors per page.
- Automatic English and French localization.
- Local-network access controls, URL tokens, and security headers.

[0.4.0]: https://github.com/OlivierLB/NoteLAN/compare/0.3.8...0.4.0
[0.3.8]: https://github.com/OlivierLB/NoteLAN/compare/0.3.7...0.3.8
[0.3.7]: https://github.com/OlivierLB/NoteLAN/compare/0.3.6...0.3.7
[0.3.6]: https://github.com/OlivierLB/NoteLAN/compare/0.3.5...0.3.6
[0.3.5]: https://github.com/OlivierLB/NoteLAN/compare/0.3.4...0.3.5
[0.3.4]: https://github.com/OlivierLB/NoteLAN/tree/0.3.4
