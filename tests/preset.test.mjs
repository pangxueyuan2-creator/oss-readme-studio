import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_PRESET_BYTES,
  PRESET_SCHEMA,
  PresetError,
  parsePreset,
  serializePreset,
} from "../lib/preset.ts";
import { getTemplate } from "../lib/readme.ts";

test("round-trips a versioned browser-only preset", () => {
  const form = { ...getTemplate("cli"), name: "Portable CLI" };
  const encoded = serializePreset("cli", false, form);

  assert.deepEqual(parsePreset(encoded), {
    schema: PRESET_SCHEMA,
    templateId: "cli",
    bilingual: false,
    form,
  });
  assert.ok(new TextEncoder().encode(encoded).byteLength < MAX_PRESET_BYTES);
});

test("rejects incomplete presets instead of filling missing project details", () => {
  const incomplete = JSON.stringify({
    schema: PRESET_SCHEMA,
    templateId: "standard",
    bilingual: true,
    form: { name: "Missing fields" },
  });

  assert.throws(() => parsePreset(incomplete), {
    name: "PresetError",
    message: "Preset project details are incomplete or contain unsupported fields.",
  });
});

test("rejects malformed JSON with a clear bounded error", () => {
  assert.throws(() => parsePreset('{"schema":'), {
    name: "PresetError",
    message: "Preset is not valid JSON.",
  });
});

test("rejects unknown schemas, templates, and extra fields", () => {
  const form = getTemplate("standard");

  assert.throws(
    () =>
      parsePreset(
        JSON.stringify({ schema: "future/v9", templateId: "standard", bilingual: true, form }),
      ),
    PresetError,
  );
  assert.throws(
    () =>
      parsePreset(
        JSON.stringify({ schema: PRESET_SCHEMA, templateId: "unknown", bilingual: true, form }),
      ),
    PresetError,
  );
  assert.throws(
    () =>
      parsePreset(
        JSON.stringify({
          schema: PRESET_SCHEMA,
          templateId: "standard",
          bilingual: true,
          form,
          ignored: "must not be silently accepted",
        }),
      ),
    PresetError,
  );
});

test("rejects oversized preset files before parsing", () => {
  const oversized = " ".repeat(MAX_PRESET_BYTES + 1);
  assert.throws(() => parsePreset(oversized), {
    name: "PresetError",
    message: "Preset is too large. Keep preset files under 64 KiB.",
  });
});
