import assert from "node:assert/strict";
import test from "node:test";
import { cleanLines, makeReadme, starter } from "../lib/readme.ts";

test("cleanLines trims entries and removes blank lines", () => {
  assert.deepEqual(cleanLines("  Fast  \n\n Private \n "), ["Fast", "Private"]);
});

test("generates a deterministic English README", () => {
  const output = makeReadme(
    {
      ...starter,
      name: "Example Tool",
      author: "Example Maintainer",
      features: "Fast\nPrivate",
    },
    false,
    2030,
  );

  assert.match(output, /^# Example Tool/m);
  assert.match(output, /- Fast\n- Private/);
  assert.match(output, /MIT © 2030 Example Maintainer/);
  assert.doesNotMatch(output, /中文说明/);
});

test("adds the bilingual section when requested", () => {
  const output = makeReadme(starter, true, 2030);
  assert.match(output, /## 中文说明/);
  assert.match(output, /### 安装/);
  assert.match(output, /欢迎提交 Issue 和 Pull Request/);
});

test("uses safe fallbacks for empty optional content", () => {
  const output = makeReadme(
    { ...starter, name: " ", features: "\n", author: "", repo: "" },
    false,
    2030,
  );

  assert.match(output, /^# Untitled Project/m);
  assert.match(output, /- Add your first feature/);
  assert.match(output, /Project contributors/);
  assert.doesNotMatch(output, /View repository/);
});
