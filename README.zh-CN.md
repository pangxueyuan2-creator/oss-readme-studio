# README Studio

[English](README.md) | 简体中文

README Studio 是面向开源维护者的免费双语 README 生成与质量检查工具。填写项目资料即可实时生成 Markdown；整个过程只在浏览器中完成，不需要登录、API Key、数据库或分析追踪。

**[立即使用公开演示](https://pangxueyuan2-creator.github.io/oss-readme-studio/)**

## 主要功能

- 实时生成英语或中英双语 README
- 提供通用、CLI、Web 应用、代码库和数据项目模板
- 自动检查标题、简介、功能、安装、使用、贡献和许可证信息
- 一键复制或下载 `README.md`
- 可作为命令行工具及 GitHub Action 使用
- 响应式且支持键盘操作

## 本地运行

需要 Node.js 22.13 或更高版本。

```bash
git clone https://github.com/pangxueyuan2-creator/oss-readme-studio.git
cd oss-readme-studio
npm install
npm run dev
```

打开 `http://localhost:3000`。

## README 质量检查

```bash
npm run audit
```

在其他公共仓库中加入 GitHub Action：

```yaml
- uses: pangxueyuan2-creator/oss-readme-studio@v0.4.0
  with:
    minimum-score: 70
```

检查规则是公开且确定性的，不会上传 README 内容，也不会调用 AI 服务。

## 参与贡献

欢迎报告问题、改进文档和翻译，或提交功能代码。请先阅读 [贡献说明](CONTRIBUTING.md)、[维护者说明](MAINTAINERS.md)和[行为准则](CODE_OF_CONDUCT.md)。

## 许可证

[MIT](LICENSE)
