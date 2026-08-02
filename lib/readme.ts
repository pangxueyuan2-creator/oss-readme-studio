export type ProjectForm = {
  name: string;
  tagline: string;
  problem: string;
  features: string;
  install: string;
  usage: string;
  author: string;
  repo: string;
};

export type TemplateId = "standard" | "cli" | "web-app" | "library" | "data";

export type ReadmeTemplate = {
  label: string;
  description: string;
  form: ProjectForm;
};

export const starter: ProjectForm = {
  name: "My Open Source Project",
  tagline: "A short sentence that explains what your project does.",
  problem: "Describe the problem this project solves and who it helps.",
  features: "Fast setup\nNo account required\nPrivacy-friendly by design",
  install:
    "git clone https://github.com/your-name/your-project.git\ncd your-project\nnpm install",
  usage: "npm run dev",
  author: "Your Name",
  repo: "https://github.com/your-name/your-project",
};

export const templates: Record<TemplateId, ReadmeTemplate> = {
  standard: {
    label: "General project",
    description: "A balanced starting point for most open-source projects.",
    form: starter,
  },
  cli: {
    label: "CLI tool",
    description: "Highlights installation, commands, and terminal-first usage.",
    form: {
      name: "My CLI Tool",
      tagline: "A focused command-line tool that makes a repetitive task easier.",
      problem: "Explain the workflow this command simplifies and who benefits from it.",
      features: "Quick installation\nHelpful command output\nWorks in scripts and CI",
      install: "npm install --global my-cli-tool",
      usage: "my-cli-tool --help\nmy-cli-tool run ./input",
      author: "Your Name",
      repo: "https://github.com/your-name/my-cli-tool",
    },
  },
  "web-app": {
    label: "Web app",
    description: "Explains local setup, browser usage, privacy, and deployment.",
    form: {
      name: "My Web App",
      tagline: "A small web app that solves one problem clearly.",
      problem: "Describe the user need, the intended audience, and why a web interface helps.",
      features: "Responsive interface\nAccessible keyboard navigation\nPrivacy-friendly defaults",
      install: "git clone https://github.com/your-name/my-web-app.git\ncd my-web-app\nnpm install",
      usage: "npm run dev",
      author: "Your Name",
      repo: "https://github.com/your-name/my-web-app",
    },
  },
  library: {
    label: "Library",
    description: "Starts with installation, a small API example, and contribution guidance.",
    form: {
      name: "My Library",
      tagline: "A small library with a clear, stable API.",
      problem: "Explain which development task this library handles and when to use it.",
      features: "Typed public API\nSmall dependency footprint\nDocumented examples",
      install: "npm install my-library",
      usage: "import { createThing } from \"my-library\";\n\nconst thing = createThing();",
      author: "Your Name",
      repo: "https://github.com/your-name/my-library",
    },
  },
  data: {
    label: "Data project",
    description: "Makes the data source, reproducibility, and output workflow visible.",
    form: {
      name: "My Data Project",
      tagline: "A reproducible workflow for exploring and transforming an open dataset.",
      problem: "Describe the dataset, the question being explored, and who can reuse the results.",
      features: "Documented data sources\nReproducible processing\nExportable results",
      install: "git clone https://github.com/your-name/my-data-project.git\ncd my-data-project\npython -m pip install -r requirements.txt",
      usage: "python scripts/build_dataset.py\npython scripts/analyze.py",
      author: "Your Name",
      repo: "https://github.com/your-name/my-data-project",
    },
  },
};

export function getTemplate(id: TemplateId): ProjectForm {
  return { ...templates[id].form };
}

export function cleanLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function makeReadme(
  form: ProjectForm,
  bilingual: boolean,
  year = new Date().getFullYear(),
) {
  const features = cleanLines(form.features)
    .map((item) => `- ${item}`)
    .join("\n");
  const repository = form.repo.trim();
  const projectName = form.name.trim() || "Untitled Project";

  const english = `# ${projectName}

${form.tagline.trim()}

${repository ? `[View repository](${repository})` : ""}

## Why this exists

${form.problem.trim()}

## Features

${features || "- Add your first feature"}

## Installation

\`\`\`bash
${form.install.trim()}
\`\`\`

## Usage

\`\`\`bash
${form.usage.trim()}
\`\`\`

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before making a contribution.

## License

MIT © ${year} ${form.author.trim() || "Project contributors"}`;

  if (!bilingual) return english;

  return `${english}

---

## 中文说明

### 项目简介

${form.tagline.trim()}

### 为什么做这个项目

${form.problem.trim()}

### 主要功能

${features || "- 添加你的第一个功能"}

### 安装

\`\`\`bash
${form.install.trim()}
\`\`\`

### 使用

\`\`\`bash
${form.usage.trim()}
\`\`\`

欢迎提交 Issue 和 Pull Request。参与贡献前，请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。`;
}
