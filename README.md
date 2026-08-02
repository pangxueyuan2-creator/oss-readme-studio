# README Studio

A privacy-friendly README generator for new open-source maintainers. Fill in a few project details, preview the Markdown live, then copy or download a bilingual `README.md`.

## Why this exists

Many useful projects are difficult to try because their first page does not explain the problem, setup, or contribution path. README Studio provides a clear starting structure without accounts, analytics, or server-side processing.

## Features

- Live Markdown generation
- Optional English + Chinese output
- Copy and download actions
- Responsive, keyboard-friendly interface
- Browser-only processing; entered content never leaves the device
- No database, account, API key, or third-party service required

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
git clone https://github.com/YOUR_NAME/oss-readme-studio.git
cd oss-readme-studio
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Project status

This is an early, working release. Planned improvements include more README templates, accessible Markdown rendering, and import/export presets. See the issue tracker for current work.

## Contributing

Bug reports, documentation improvements, translations, and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before contributing.

## Security and privacy

README Studio does not send form content to a backend. If you discover a security issue, avoid opening a public issue with exploit details; contact the maintainer privately through the GitHub profile listed on the repository.

## License

[MIT](LICENSE)
