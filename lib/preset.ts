import type { ProjectForm, TemplateId } from "./readme";

export const PRESET_SCHEMA = "oss-readme-studio/preset/v1" as const;
export const MAX_PRESET_BYTES = 64 * 1024;

const templateIds = new Set<TemplateId>(["standard", "cli", "web-app", "library", "data"]);
const formFields = [
  "name",
  "tagline",
  "problem",
  "features",
  "install",
  "usage",
  "author",
  "repo",
] as const satisfies readonly (keyof ProjectForm)[];
const topLevelFields = ["schema", "templateId", "bilingual", "form"] as const;

export type ReadmePreset = {
  schema: typeof PRESET_SCHEMA;
  templateId: TemplateId;
  bilingual: boolean;
  form: ProjectForm;
};

export class PresetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PresetError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(record: Record<string, unknown>, expected: readonly string[]) {
  const actual = Object.keys(record);
  return actual.length === expected.length && expected.every((key) => Object.hasOwn(record, key));
}

function parseForm(value: unknown): ProjectForm {
  if (!isRecord(value) || !hasExactKeys(value, formFields)) {
    throw new PresetError("Preset project details are incomplete or contain unsupported fields.");
  }

  const form = {} as ProjectForm;
  for (const field of formFields) {
    const fieldValue = value[field];
    if (typeof fieldValue !== "string") {
      throw new PresetError("Every preset project detail must be text.");
    }
    form[field] = fieldValue;
  }
  return form;
}

function validatePreset(value: unknown): ReadmePreset {
  if (!isRecord(value) || !hasExactKeys(value, topLevelFields)) {
    throw new PresetError("Preset is incomplete or contains unsupported fields.");
  }
  if (value.schema !== PRESET_SCHEMA) {
    throw new PresetError("Preset schema is not supported by this version of README Studio.");
  }
  if (typeof value.templateId !== "string" || !templateIds.has(value.templateId as TemplateId)) {
    throw new PresetError("Preset project template is not supported.");
  }
  if (typeof value.bilingual !== "boolean") {
    throw new PresetError("Preset bilingual setting must be true or false.");
  }

  return {
    schema: PRESET_SCHEMA,
    templateId: value.templateId as TemplateId,
    bilingual: value.bilingual,
    form: parseForm(value.form),
  };
}

function assertSize(text: string) {
  if (new TextEncoder().encode(text).byteLength > MAX_PRESET_BYTES) {
    throw new PresetError("Preset is too large. Keep preset files under 64 KiB.");
  }
}

export function parsePreset(text: string): ReadmePreset {
  assertSize(text);

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new PresetError("Preset is not valid JSON.");
  }
  return validatePreset(parsed);
}

export function serializePreset(
  templateId: TemplateId,
  bilingual: boolean,
  form: ProjectForm,
): string {
  const preset = validatePreset({ schema: PRESET_SCHEMA, templateId, bilingual, form });
  const serialized = `${JSON.stringify(preset, null, 2)}\n`;
  assertSize(serialized);
  return serialized;
}
