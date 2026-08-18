# Security policy

## Supported versions

Security fixes are applied to the latest released version of NoteLAN.

## Reporting a vulnerability

Please do not open a public issue for a vulnerability that could expose shared notes, bypass access controls, or reveal local data.

Use GitHub's **Security → Report a vulnerability** feature for this repository. Include:

- the affected NoteLAN and Obsidian versions;
- the operating system;
- clear reproduction steps using non-sensitive example notes;
- the expected and observed behavior;
- any suggested mitigation.

Do not include real vault content, URL tokens, IP addresses, or personal analytics data. You can expect an acknowledgement within seven days. A fix and disclosure timeline will depend on severity and reproducibility.

## Deployment assumptions

NoteLAN is intended for private, trusted local networks. Its HTTP traffic is not encrypted. Exposing its port through a router, reverse proxy, tunnel, public Wi-Fi network, or the internet is outside the supported threat model.
