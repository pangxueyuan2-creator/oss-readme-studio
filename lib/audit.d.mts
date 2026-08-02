export type AuditResult = {
  score: number;
  maximumScore: number;
  checks: Array<{
    id: string;
    label: string;
    points: number;
    suggestion: string;
    passed: boolean;
  }>;
};

export const recommendedMinimumScore: number;
export function analyzeReadme(markdown: string): AuditResult;
