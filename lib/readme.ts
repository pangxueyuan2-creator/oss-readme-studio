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
