import { readFileSync } from "node:fs";

// Budgets come from Vite's build manifest (the real import graph), not file names, so chunking changes can't hide growth.
const manifest = JSON.parse(readFileSync("dist/.vite/manifest.json", "utf8"));
const entries = Object.entries(manifest);

function closure(key, seen = new Set()) {
  const chunk = manifest[key];
  if (!chunk || seen.has(chunk.file)) return seen;
  seen.add(chunk.file);
  for (const imported of chunk.imports ?? []) closure(imported, seen);
  return seen;
}

const union = (sets) => new Set(sets.flatMap((set) => [...set]));
const minus = (set, ...others) => [...set].filter((file) => !others.some((other) => other.has(file)));
const dynamicEntries = (test) =>
  entries.filter(([key, chunk]) => chunk.isDynamicEntry && test(key)).map(([key]) => key);
const toPaths = (files) => files.filter((file) => file.endsWith(".js")).map((file) => `dist/${file}`);

const initial = closure("index.html");
const monitoringKeys = dynamicEntries((key) => /@sentry|posthog-js/.test(key));
// The internal /design-system page is left unbudgeted: it is served on one host only.
const designSystemKeys = dynamicEntries((key) => key.includes("features/design-system"));
const otherKeys = entries.map(([key]) => key).filter((key) => ![...monitoringKeys, ...designSystemKeys].includes(key));

const monitoring = minus(union(monitoringKeys.map((key) => closure(key))), initial);
const app = minus(union(otherKeys.map((key) => closure(key))), new Set(monitoring));

export default [
  { name: "Initial JS (shell + home)", path: toPaths([...initial]), limit: "200 kB", gzip: true },
  {
    name: "All app JS (lazy pages included; not monitoring or /design-system)",
    path: toPaths(app),
    limit: "260 kB",
    gzip: true,
  },
  {
    name: "Monitoring SDKs (Sentry + PostHog, after first paint, only where configured)",
    path: toPaths(monitoring),
    limit: "300 kB",
    gzip: true,
  },
  { name: "App CSS", path: "dist/assets/index-*.css", limit: "24 kB", gzip: true },
];
