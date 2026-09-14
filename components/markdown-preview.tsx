"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  parseMarkdownPreview,
  previewModeForKey,
  type MarkdownBlock,
  type MarkdownInline,
  type PreviewMode,
} from "../lib/markdown-preview";

function renderInlines(content: MarkdownInline[]) {
  return content.map((item, index) => {
    const key = `${item.kind}-${index}`;
    if (item.kind === "link" && item.href) {
      return (
        <a href={item.href} key={key}>
          {item.text}
        </a>
      );
    }
    return <span key={key}>{item.text}</span>;
  });
}

function renderHeading(block: Extract<MarkdownBlock, { kind: "heading" }>, key: string) {
  const content = renderInlines(block.content);
  switch (block.level) {
    case 1:
      return <h1 key={key}>{content}</h1>;
    case 2:
      return <h2 key={key}>{content}</h2>;
    case 3:
      return <h3 key={key}>{content}</h3>;
    case 4:
      return <h4 key={key}>{content}</h4>;
    case 5:
      return <h5 key={key}>{content}</h5>;
    case 6:
      return <h6 key={key}>{content}</h6>;
  }
}

function renderBlock(block: MarkdownBlock, index: number) {
  const key = `${block.kind}-${index}`;
  if (block.kind === "heading") return renderHeading(block, key);
  if (block.kind === "paragraph") return <p key={key}>{renderInlines(block.content)}</p>;
  if (block.kind === "rule") return <hr key={key} />;
  if (block.kind === "list") {
    return (
      <ul key={key}>
        {block.items.map((item, itemIndex) => (
          <li key={`${key}-${itemIndex}`}>{renderInlines(item)}</li>
        ))}
      </ul>
    );
  }
  return (
    <pre key={key}>
      <code data-language={block.language ?? undefined}>{block.text}</code>
    </pre>
  );
}

export function MarkdownPreview({ markdown }: { markdown: string }) {
  const [mode, setMode] = useState<PreviewMode>("source");
  const sourceButton = useRef<HTMLButtonElement>(null);
  const renderedButton = useRef<HTMLButtonElement>(null);
  const blocks = useMemo(() => parseMarkdownPreview(markdown), [markdown]);

  function switchMode(nextMode: PreviewMode) {
    setMode(nextMode);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const nextMode = previewModeForKey(mode, event.key);
    if (!nextMode) return;
    event.preventDefault();
    switchMode(nextMode);
    if (nextMode === "source") sourceButton.current?.focus();
    else renderedButton.current?.focus();
  }

  return (
    <section className="markdown-preview" aria-label="README preview">
      <div className="preview-switcher" role="group" aria-label="Preview mode">
        <button
          ref={sourceButton}
          type="button"
          className="text-button"
          aria-pressed={mode === "source"}
          aria-controls="readme-preview-content"
          onClick={() => switchMode("source")}
          onKeyDown={handleKeyDown}
        >
          Markdown source
        </button>
        <button
          ref={renderedButton}
          type="button"
          className="text-button"
          aria-pressed={mode === "rendered"}
          aria-controls="readme-preview-content"
          onClick={() => switchMode("rendered")}
          onKeyDown={handleKeyDown}
        >
          Rendered preview
        </button>
      </div>
      <div id="readme-preview-content" aria-live="polite">
        {mode === "source" ? (
          <pre><code>{markdown}</code></pre>
        ) : (
          <article className="rendered-markdown">{blocks.map(renderBlock)}</article>
        )}
      </div>
    </section>
  );
}
