# README Studio

English | [简体中文](README.zh-CN.md)

[![CI](https://github.com/pangxueyuan2-creator/oss-readme-studio/actions/workflows/ci.yml/badge.svg)](https://github.com/pangxueyuan2-creator/oss-readme-studio/actions/workflows/ci.yml)
[![Public demo](https://github.com/pangxueyuan2-creator/oss-readme-studio/actions/workflows/pages.yml/badge.svg)](https://github.com/pangxueyuan2-creator/oss-readme-studio/actions/workflows/pages.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-214d38.svg)](LICENSE)

A privacy-friendly README generator and quality checker for new open-source maintainers. Fill in a few project details, preview the Markdown live, then copy or download a bilingual `README.md`.

![README Studio preview](public/og.png)

**[Try the public demo](https://pangxueyuan2-creator.github.io/oss-readme-studio/)** — no account or sign-in required.

## Why this exists

Many useful projects are difficult to try because their first page does not explain the problem, setup, or contribution path. README Studio provides a clear starting structure without accounts, analytics, or server-side processing.

## Features

- Live Markdown generation
- Focused presets for general projects, CLI tools, web apps, libraries, and data projects
- Deterministic README readiness score with clear missing-section checks
- Optional English + Chinese output
- Copy and download actions
- Responsive, keyboard-friendly interface
- Browser-only processing; entered content never leaves the device
- No database, account, API key, or third-party service required

## Audit an existing README

Run the same deterministic quality check used by the web app:

```bash
npm run audit
```

Other repositories can use README Studio as a GitHub Action:

```yaml
- uses: pangxueyuan2-creator/oss-readme-studio@v0.4.0
  with:
    minimum-score: 70
```

The audit checks for a title, plain-language description, features, installation, usage, contribution path, and license. It does not upload README content or call an AI service.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
git clone https://github.com/pangxueyuan2-creator/oss-readme-studio.git
cd oss-readme-studio
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm run build:pages
```

## Test

```bash
npm run lint
npm test
```

The test suite covers README generation, bilingual output, fallback content, server rendering, metadata, and the social preview asset. GitHub Actions runs the same checks for every pull request and push to `main`.

## Project status

This is an early, working release. The project has a public, independently deployable demo and a shared generator covered by automated tests. Planned improvements include accessible Markdown rendering and import/export presets. See [ROADMAP.md](ROADMAP.md), [project purpose and impact](docs/PROJECT_IMPACT.md), and the issue tracker for current work.

## Contributing

Bug reports, documentation improvements, translations, and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

Project ownership and decision-making are documented in [MAINTAINERS.md](MAINTAINERS.md).

## Security and privacy

README Studio does not send form content to a backend. If you discover a security issue, follow [SECURITY.md](SECURITY.md) and use GitHub private vulnerability reporting.

## License

[MIT](LICENSE)
