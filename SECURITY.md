# Security policy

## Supported versions

Security fixes are applied to the latest release on the `main` branch.

## Reporting a vulnerability

Please use [GitHub private vulnerability reporting](https://github.com/pangxueyuan2-creator/oss-readme-studio/security/advisories/new) for sensitive findings. Do not open a public issue that contains exploit details, credentials, or personal data.

Include the affected browser, reproduction steps, possible impact, and any
suggested mitigation. The maintainer will acknowledge a complete report within
seven days and will coordinate disclosure after a fix is available.

README Studio runs entirely in the browser and does not intentionally transmit
entered project information to a backend. Reports involving unexpected network
requests or unsafe generated Markdown are especially useful.

For non-sensitive dependency or hardening work, open a regular GitHub issue.

## Automated checks

Every pull request runs the test suite, production dependency audit, linting,
and both application builds. Dependabot proposes grouped maintenance updates so
that upgrades can be reviewed and verified before merging.
