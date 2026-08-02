#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { analyzeReadme, recommendedMinimumScore } from "../lib/audit.mjs";

const args = process.argv.slice(2);
const minimumIndex = args.indexOf("--minimum");
const file = args.find((arg, index) => !arg.startsWith("--") && index !== minimumIndex + 1) ?? "README.md";
const rawMinimum = minimumIndex >= 0 ? args[minimumIndex + 1] : process.env.INPUT_MINIMUM_SCORE;
const minimum = rawMinimum === undefined ? recommendedMinimumScore : Number(rawMinimum);

if (!Number.isInteger(minimum) || minimum < 0 || minimum > 100) {
  console.error("Minimum score must be an integer from 0 to 100.");
  process.exitCode = 2;
} else {
  try {
    const markdown = await readFile(file, "utf8");
    const result = analyzeReadme(markdown);

    console.log(`README Studio audit: ${result.score}/${result.maximumScore} (minimum ${minimum})`);
    for (const check of result.checks) {
      console.log(`${check.passed ? "✓" : "○"} ${check.label} (${check.points} points)`);
      if (!check.passed) console.log(`  ${check.suggestion}`);
    }

    if (result.score < minimum) {
      console.error(`README score ${result.score} is below the required ${minimum}.`);
      process.exitCode = 1;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Could not audit ${file}: ${message}`);
    process.exitCode = 2;
  }
}
