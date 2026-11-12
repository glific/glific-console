import { readFileSync } from "node:fs";

// The initial load is what index.html references (entry + modulepreloads); lazy route chunks load on navigation.
const html = readFileSync("dist/index.html", "utf8");
const initial = [...html.matchAll(/(?:src|href)="\/(assets\/[^"]+\.js)"/g)].map(([, path]) => `dist/${path}`);

export default [
  { name: "Initial JS (shell + home)", path: initial, limit: "200 kB", gzip: true },
  {
    name: "All app JS (except the internal /design-system page)",
    path: ["dist/assets/*.js", "!dist/assets/design-system-*.js"],
    limit: "260 kB",
    gzip: true,
  },
  { name: "App CSS", path: "dist/assets/index-*.css", limit: "24 kB", gzip: true },
];
