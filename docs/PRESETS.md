# Local preset format

README Studio presets are small JSON files that let a user save and restore the project-details form without an account or server storage. Import and export happen entirely in the browser.

The current schema identifier is `oss-readme-studio/preset/v1`.

```json
{
  "schema": "oss-readme-studio/preset/v1",
  "templateId": "cli",
  "bilingual": true,
  "form": {
    "name": "Example CLI",
    "tagline": "A focused command-line tool.",
    "problem": "Describe the problem.",
    "features": "Fast setup\nScript friendly",
    "install": "npm install --global example-cli",
    "usage": "example-cli --help",
    "author": "Example Maintainer",
    "repo": "https://github.com/example/example-cli"
  }
}
```

## Validation rules

- `schema`, `templateId`, `bilingual`, and `form` are required; unknown top-level fields are rejected.
- `templateId` must be one of the built-in template IDs: `standard`, `cli`, `web-app`, `library`, or `data`.
- `form` must contain exactly the eight documented text fields shown above. Missing, extra, or non-text fields are rejected instead of silently defaulted.
- Preset files larger than 64 KiB are rejected before use.
- Unknown schema versions are rejected so a future format cannot be misinterpreted as v1.

Preset files contain whatever project details the user typed into the form. They should be treated like any other local document: do not put secrets or credentials in README fields, and review a preset before sharing it publicly.
