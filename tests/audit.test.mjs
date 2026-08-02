import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { analyzeReadme } from "../lib/audit.mjs";

const complete = `# Example Project

A useful project that solves a clear problem for open-source maintainers.

## Features

- Fast
- Private

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## Contributing

Issues and pull requests are welcome.

## License

MIT
`;

test("gives a complete README the maximum score", () => {
  const result = analyzeReadme(complete);
  assert.equal(result.score, 100);
  assert.equal(result.checks.every((check) => check.passed), true);
});

test("reports specific missing content for an incomplete README", () => {
  const result = analyzeReadme("# Tiny\n");
  assert.equal(result.score, 10);
  assert.deepEqual(
    result.checks.filter((check) => !check.passed).map((check) => check.id),
    ["description", "features", "installation", "usage", "contributing", "license"],
  );
});

test("the project README meets its own recommended quality threshold", async () => {
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
  assert.ok(analyzeReadme(readme).score >= 90);
});
