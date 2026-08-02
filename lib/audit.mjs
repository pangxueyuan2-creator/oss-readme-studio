const checks = [
  {
    id: "title",
    label: "Project title",
    points: 10,
    suggestion: "Add one clear level-one project title.",
    test: (markdown) => /^#\s+\S.+$/m.test(markdown),
  },
  {
    id: "description",
    label: "Plain-language description",
    points: 15,
    suggestion: "Explain what the project does in one plain-language sentence.",
    test: hasDescription,
  },
  {
    id: "features",
    label: "Feature overview",
    points: 15,
    suggestion: "Add a Features, Highlights, or Capabilities section.",
    test: (markdown) => hasSection(markdown, ["features", "highlights", "capabilities"]),
  },
  {
    id: "installation",
    label: "Installation or setup",
    points: 20,
    suggestion: "Add installation or setup instructions with a real command.",
    test: (markdown) => hasSection(markdown, ["installation", "install", "setup", "getting started", "run locally"], true),
  },
  {
    id: "usage",
    label: "Usage example",
    points: 15,
    suggestion: "Show a usage, quick-start, run-local, or examples section.",
    test: (markdown) => hasSection(markdown, ["usage", "quick start", "examples", "run locally", "build"], true),
  },
  {
    id: "contributing",
    label: "Contribution path",
    points: 15,
    suggestion: "Explain how people can report issues or contribute.",
    test: (markdown) => hasSection(markdown, ["contributing", "contribution", "development"]),
  },
  {
    id: "license",
    label: "License",
    points: 10,
    suggestion: "Name the project license and link to the license file.",
    test: (markdown) => hasSection(markdown, ["license", "licence"], true),
  },
];

function normalizeHeading(value) {
  return value
    .toLowerCase()
    .replace(/[`*_~:[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sectionBody(markdown, aliases) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let collecting = false;
  const body = [];

  for (const line of lines) {
    const heading = line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/);
    if (heading) {
      if (collecting) break;
      collecting = aliases.includes(normalizeHeading(heading[1]));
      continue;
    }

    if (collecting) body.push(line);
  }

  return body.join("\n").trim();
}

function hasSection(markdown, aliases, requireBody = false) {
  const body = sectionBody(markdown, aliases);
  return requireBody ? body.length >= 3 : body.length > 0;
}

function hasDescription(markdown) {
  return markdown
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .some((line) =>
      line.length >= 20 &&
      !line.startsWith("#") &&
      !line.startsWith("[") &&
      !line.startsWith("!") &&
      !line.startsWith("<") &&
      !line.startsWith("-") &&
      !line.startsWith("```")
    );
}

export const recommendedMinimumScore = 70;

export function analyzeReadme(markdown) {
  const source = typeof markdown === "string" ? markdown : "";
  const results = checks.map((check) => ({
    id: check.id,
    label: check.label,
    points: check.points,
    suggestion: check.suggestion,
    passed: check.test(source),
  }));

  return {
    score: results.reduce((total, check) => total + (check.passed ? check.points : 0), 0),
    maximumScore: checks.reduce((total, check) => total + check.points, 0),
    checks: results,
  };
}
