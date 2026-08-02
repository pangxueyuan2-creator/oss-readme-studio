"use client";

import { useMemo, useState } from "react";
import {
  getTemplate,
  makeReadme,
  templates,
  type ProjectForm,
  type TemplateId,
} from "../lib/readme";

export function ReadmeStudio() {
  const [templateId, setTemplateId] = useState<TemplateId>("standard");
  const [form, setForm] = useState<ProjectForm>(() => getTemplate("standard"));
  const [bilingual, setBilingual] = useState(true);
  const [copied, setCopied] = useState(false);
  const readme = useMemo(() => makeReadme(form, bilingual), [form, bilingual]);

  function update<K extends keyof ProjectForm>(key: K, value: ProjectForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function chooseTemplate(value: TemplateId) {
    setTemplateId(value);
    setForm(getTemplate(value));
    setCopied(false);
  }

  async function copyReadme() {
    await navigator.clipboard.writeText(readme);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function downloadReadme() {
    const blob = new Blob([readme], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "README.md";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="README Studio home">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span>README Studio</span>
        </a>
        <a className="ghost-link" href="#about">Why it matters</a>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span /> Open source, clearly explained</div>
        <h1>Turn a rough idea into a<br /><em>README people understand.</em></h1>
        <p className="hero-copy">
          A private, browser-only workspace for creating a clean README in minutes.
          No sign-in. No tracking. Nothing leaves your device.
        </p>
        <div className="hero-meta">
          <span>01 — Choose</span><i />
          <span>02 — Describe</span><i />
          <span>03 — Publish</span>
        </div>
      </section>

      <section className="workspace" aria-label="README generator">
        <div className="panel form-panel">
          <div className="panel-heading">
            <div>
              <span className="step">01</span>
              <h2>Project details</h2>
            </div>
            <button className="text-button" onClick={() => setForm(getTemplate(templateId))}>Reset</button>
          </div>

          <div className="template-picker">
            <label htmlFor="project-template">Project template</label>
            <select
              id="project-template"
              value={templateId}
              onChange={(event) => chooseTemplate(event.target.value as TemplateId)}
            >
              {Object.entries(templates).map(([id, template]) => (
                <option key={id} value={id}>{template.label}</option>
              ))}
            </select>
            <p>{templates[templateId].description}</p>
          </div>

          <div className="field-grid">
            <label className="wide">
              <span>Project name</span>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} />
            </label>
            <label className="wide">
              <span>One-line description</span>
              <input value={form.tagline} onChange={(e) => update("tagline", e.target.value)} />
            </label>
            <label className="wide">
              <span>Problem it solves</span>
              <textarea rows={3} value={form.problem} onChange={(e) => update("problem", e.target.value)} />
            </label>
            <label className="wide">
              <span>Features <small>one per line</small></span>
              <textarea rows={4} value={form.features} onChange={(e) => update("features", e.target.value)} />
            </label>
            <label>
              <span>Install command</span>
              <textarea className="code-input" rows={4} value={form.install} onChange={(e) => update("install", e.target.value)} />
            </label>
            <label>
              <span>Run command</span>
              <textarea className="code-input" rows={4} value={form.usage} onChange={(e) => update("usage", e.target.value)} />
            </label>
            <label>
              <span>Author</span>
              <input value={form.author} onChange={(e) => update("author", e.target.value)} />
            </label>
            <label>
              <span>Repository URL</span>
              <input value={form.repo} onChange={(e) => update("repo", e.target.value)} />
            </label>
          </div>

          <label className="toggle-row">
            <span>
              <strong>Bilingual README</strong>
              <small>Add a compact Chinese section</small>
            </span>
            <input type="checkbox" checked={bilingual} onChange={(e) => setBilingual(e.target.checked)} />
            <i aria-hidden="true" />
          </label>
        </div>

        <div className="panel preview-panel">
          <div className="panel-heading">
            <div>
              <span className="step">02</span>
              <h2>Live preview</h2>
            </div>
            <span className="file-pill">README.md</span>
          </div>
          <pre aria-live="polite"><code>{readme}</code></pre>
          <div className="actions">
            <button className="primary" onClick={copyReadme}>{copied ? "Copied!" : "Copy Markdown"}</button>
            <button className="secondary" onClick={downloadReadme}>Download .md</button>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div>
          <span className="step">03</span>
          <h2>A README is your project’s front door.</h2>
        </div>
        <p>
          Good open source documentation makes it easy to understand the problem,
          try the project, and contribute. This tool gives you a useful starting
          structure—your real story and continued maintenance make it credible.
        </p>
      </section>

      <footer>
        <span>README Studio</span>
        <span>MIT licensed · Built for maintainers</span>
      </footer>
    </main>
  );
}
