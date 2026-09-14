export type PreviewMode = "source" | "rendered";

export type MarkdownInline =
  | { kind: "text"; text: string }
  | { kind: "link"; text: string; href: string | null };

export type MarkdownBlock =
  | { kind: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; content: MarkdownInline[] }
  | { kind: "paragraph"; content: MarkdownInline[] }
  | { kind: "list"; items: MarkdownInline[][] }
  | { kind: "code"; language: string | null; text: string }
  | { kind: "rule" };

const MARKDOWN_LINK = /\[([^\]\n]+)\]\(([^)\n]+)\)/g;
const EXPLICIT_SCHEME = /^([a-z][a-z0-9+.-]*):/i;
const SAFE_SCHEMES = new Set(["http", "https", "mailto"]);
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

export function safeMarkdownLinkTarget(rawTarget: string): string | null {
  const target = rawTarget.trim();
  if (!target || CONTROL_CHARACTERS.test(target)) return null;

  const scheme = target.match(EXPLICIT_SCHEME)?.[1]?.toLowerCase();
  if (scheme && !SAFE_SCHEMES.has(scheme)) return null;
  return target;
}

export function parseMarkdownInlines(value: string): MarkdownInline[] {
  const parts: MarkdownInline[] = [];
  let cursor = 0;

  for (const match of value.matchAll(MARKDOWN_LINK)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      parts.push({ kind: "text", text: value.slice(cursor, index) });
    }

    parts.push({
      kind: "link",
      text: match[1],
      href: safeMarkdownLinkTarget(match[2]),
    });
    cursor = index + match[0].length;
  }

  if (cursor < value.length) {
    parts.push({ kind: "text", text: value.slice(cursor) });
  }

  return parts.length ? parts : [{ kind: "text", text: value }];
}

function isFence(line: string) {
  return /^\s*```/.test(line);
}

function isHeading(line: string) {
  return /^(#{1,6})\s+/.test(line);
}

function isListItem(line: string) {
  return /^\s*[-*+]\s+/.test(line);
}

function isRule(line: string) {
  return /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line);
}

function startsBlock(line: string) {
  return !line.trim() || isFence(line) || isHeading(line) || isListItem(line) || isRule(line);
}

function safeFenceLanguage(line: string): string | null {
  const language = line.replace(/^\s*```/, "").trim();
  if (!language) return null;
  return /^[a-z0-9_+.-]{1,32}$/i.test(language) ? language : null;
}

export function parseMarkdownPreview(markdown: string): MarkdownBlock[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (isFence(line)) {
      const language = safeFenceLanguage(line);
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !isFence(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push({ kind: "code", language, text: code.join("\n") });
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      blocks.push({
        kind: "heading",
        level: heading[1].length as 1 | 2 | 3 | 4 | 5 | 6,
        content: parseMarkdownInlines(heading[2]),
      });
      index += 1;
      continue;
    }

    if (isRule(line)) {
      blocks.push({ kind: "rule" });
      index += 1;
      continue;
    }

    if (isListItem(line)) {
      const items: MarkdownInline[][] = [];
      while (index < lines.length) {
        const item = lines[index].match(/^\s*[-*+]\s+(.*)$/);
        if (!item) break;
        items.push(parseMarkdownInlines(item[1]));
        index += 1;
      }
      blocks.push({ kind: "list", items });
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && !startsBlock(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ kind: "paragraph", content: parseMarkdownInlines(paragraph.join(" ")) });
  }

  return blocks;
}

export function previewModeForKey(current: PreviewMode, key: string): PreviewMode | null {
  if (key === "Home") return "source";
  if (key === "End") return "rendered";
  if (key === "ArrowLeft" || key === "ArrowUp") {
    return current === "source" ? "rendered" : "source";
  }
  if (key === "ArrowRight" || key === "ArrowDown") {
    return current === "source" ? "rendered" : "source";
  }
  return null;
}
