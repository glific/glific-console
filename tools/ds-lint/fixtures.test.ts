/**
 * Proves every design-system lint rule fires (and stays quiet where it should).
 *
 * Fixtures are copied into the real source tree so Biome applies the same path scoping as for app code:
 *   fixtures/feature/* -> src/features/__ds-lint-fixtures__/
 *   fixtures/ui/*      -> src/components/ui/__ds-lint-fixtures__/
 * Each `@expect ds/<rule>` comment means "the next line must report <rule>". Nothing else may be reported.
 */
import { execFileSync } from "node:child_process";
import { cpSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join, relative } from "node:path";
import { after, before, test } from "node:test";
import assert from "node:assert/strict";

const root = join(import.meta.dirname, "../..");
const targets = {
  feature: join(root, "src/features/__ds-lint-fixtures__"),
  ui: join(root, "src/components/ui/__ds-lint-fixtures__"),
} as const;

interface Diagnostic {
  message: string;
  category: string;
  location: { path: string; start: { line: number } };
}

const RULE_ID = /\[(ds\/[a-z-]+)\]/;
const EXPECT = /@expect (ds\/[a-z-]+)/;

function expectations(file: string): string[] {
  return readFileSync(file, "utf8")
    .split("\n")
    .flatMap((line, index) => {
      const match = EXPECT.exec(line);
      return match ? [`${index + 2}:${match[1]}`] : [];
    });
}

let diagnostics: Diagnostic[] = [];

before(() => {
  for (const [kind, target] of Object.entries(targets)) {
    rmSync(target, { recursive: true, force: true });
    cpSync(join(import.meta.dirname, "fixtures", kind), target, { recursive: true });
  }
  let output: string;
  try {
    output = execFileSync(
      join(root, "node_modules/.bin/biome"),
      ["lint", "--reporter=json", "--vcs-use-ignore-file=false", ...Object.values(targets)],
      {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    );
  } catch (error) {
    output = (error as { stdout: string }).stdout;
  }
  diagnostics = (JSON.parse(output) as { diagnostics: Diagnostic[] }).diagnostics;
});

after(() => {
  for (const target of Object.values(targets)) rmSync(target, { recursive: true, force: true });
});

for (const [kind, target] of Object.entries(targets)) {
  for (const name of readdirSync(join(import.meta.dirname, "fixtures", kind))) {
    test(`${kind}/${name}`, () => {
      const path = relative(root, join(target, name));
      const reported = diagnostics
        .filter((d) => d.location.path === path)
        .map((d) => `${d.location.start.line}:${RULE_ID.exec(d.message)?.[1] ?? d.category}`)
        .sort();
      const expected = expectations(join(import.meta.dirname, "fixtures", kind, name)).sort();
      if (name.includes(".fail.")) assert.ok(expected.length > 0, "a .fail fixture must declare @expect lines");
      assert.deepEqual(reported, expected);
    });
  }
}

test("every DS rule has a failing fixture", () => {
  const rules = readdirSync(join(import.meta.dirname, "rules")).map((f) => `ds/${f.replace(/(-css)?\.grit$/, "")}`);
  const covered = new Set(diagnostics.flatMap((d) => RULE_ID.exec(d.message)?.[1] ?? []));
  for (const rule of [...rules, "ds/no-radix-outside-ui"]) assert.ok(covered.has(rule), `${rule} never fired`);
});
