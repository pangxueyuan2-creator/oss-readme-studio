import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished README Studio experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>README Studio/);
  assert.match(html, /Turn a rough idea into a/);
  assert.match(html, /Project details/);
  assert.match(html, /Project template/);
  assert.match(html, /CLI tool/);
  assert.match(html, /Local preset/);
  assert.match(html, /Save preset/);
  assert.match(html, /Load preset/);
  assert.match(html, /Live preview/);
  assert.match(html, /Markdown source/);
  assert.match(html, /Rendered preview/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /README readiness/);
  assert.match(html, /Copy Markdown/);
  assert.doesNotMatch(html, /dangerouslySetInnerHTML/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/);
});

test("ships project metadata and the social preview asset", async () => {
  const [layout, page, component, preview, packageJson] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/readme-studio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/markdown-preview.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    access(new URL("../public/og.png", import.meta.url)),
  ]);

  assert.match(layout, /README Studio — Open source, clearly explained/);
  assert.match(layout, /summary_large_image/);
  assert.match(page, /ReadmeStudio/);
  assert.match(component, /analyzeReadme/);
  assert.match(component, /serializePreset/);
  assert.match(component, /parsePreset/);
  assert.match(component, /MarkdownPreview/);
  assert.match(preview, /parseMarkdownPreview/);
  assert.doesNotMatch(preview, /dangerouslySetInnerHTML/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
