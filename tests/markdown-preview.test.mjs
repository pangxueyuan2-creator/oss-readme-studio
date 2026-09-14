import assert from "node:assert/strict";
import test from "node:test";
import {
  parseMarkdownPreview,
  previewModeForKey,
  safeMarkdownLinkTarget,
} from "../lib/markdown-preview.ts";
import { makeReadme, starter } from "../lib/readme.ts";

test("parses representative README blocks without executing Markdown content", () => {
  const blocks = parseMarkdownPreview(`# Demo\n\nA [safe link](https://example.com).\n\n- Fast\n- Private\n\n\`\`\`bash\necho hello\n\`\`\``);

  assert.equal(blocks[0].kind, "heading");
  assert.equal(blocks[1].kind, "paragraph");
  assert.equal(blocks[2].kind, "list");
  assert.equal(blocks[3].kind, "code");
  assert.deepEqual(blocks[3], { kind: "code", language: "bash", text: "echo hello" });
});

test("blocks unsafe link schemes and keeps raw HTML as inert text", () => {
  const blocks = parseMarkdownPreview(
    `<script>alert("nope")</script> [click me](javascript:alert(1))`,
  );

  assert.equal(safeMarkdownLinkTarget("javascript:alert(1)"), null);
  assert.equal(safeMarkdownLinkTarget("data:text/html,test"), null);
  assert.equal(safeMarkdownLinkTarget("https://example.com/docs"), "https://example.com/docs");
  assert.equal(safeMarkdownLinkTarget("CONTRIBUTING.md"), "CONTRIBUTING.md");
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].kind, "paragraph");
  if (blocks[0].kind !== "paragraph") return;
  assert.match(blocks[0].content[0].text, /<script>/);
  const link = blocks[0].content.find((item) => item.kind === "link");
  assert.deepEqual(link, { kind: "link", text: "click me", href: null });
});

test("supports keyboard navigation between source and rendered modes", () => {
  assert.equal(previewModeForKey("source", "ArrowRight"), "rendered");
  assert.equal(previewModeForKey("rendered", "ArrowLeft"), "source");
  assert.equal(previewModeForKey("rendered", "Home"), "source");
  assert.equal(previewModeForKey("source", "End"), "rendered");
  assert.equal(previewModeForKey("source", "Enter"), null);
});

test("parses the generated README into headings, links, lists, and code blocks", () => {
  const blocks = parseMarkdownPreview(makeReadme(starter, true, 2030));
  assert.ok(blocks.some((block) => block.kind === "heading" && block.level === 1));
  assert.ok(blocks.some((block) => block.kind === "list"));
  assert.ok(blocks.some((block) => block.kind === "code" && block.language === "bash"));
  assert.ok(
    blocks.some(
      (block) =>
        block.kind === "paragraph" &&
        block.content.some((item) => item.kind === "link" && item.href === starter.repo),
    ),
  );
});
