import { describe, expect, it } from "vitest";
import { tokens } from "./tokens";
import css from "./tokens.css?raw";

function declaredIn(block: string): Set<string> {
  return new Set([...block.matchAll(/--([a-z0-9-]+):/g)].map((m) => m[1] as string));
}

function blocks(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [...css.matchAll(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "g"))].map((m) => m[1]).join("\n");
}

const light = declaredIn(blocks(":root"));
const theme = declaredIn(blocks("@theme inline"));

describe("token manifest", () => {
  it("lists only tokens that exist in tokens.css", () => {
    for (const token of tokens) {
      const inCss = token.group === "typography" || token.group === "spacing" ? theme : light;
      expect(inCss, `--${token.name} missing from tokens.css`).toContain(token.name);
    }
  });

  it("lists every semantic token declared in tokens.css", () => {
    const listed = new Set(tokens.map((t) => t.name));
    const semantic = [...light].filter((name) => !name.startsWith("palette-"));
    for (const name of semantic) expect(listed, `--${name} missing from tokens.ts`).toContain(name);
  });

  it("exposes every colour to Tailwind", () => {
    for (const token of tokens.filter((t) => ["color", "chart", "sidebar"].includes(t.group))) {
      expect(theme, `--color-${token.name} missing from @theme`).toContain(`color-${token.name}`);
    }
  });

  it("keeps semantic tokens free of raw colour values", () => {
    const semanticBlocks = css.split("/* 2. Semantic tokens */")[1]?.split("/* 3.")[0] ?? "";
    expect(semanticBlocks).not.toMatch(/#[0-9a-f]{3,8}\b|oklch\(|rgb\(|hsl\(/i);
  });
});

describe("semantic utilities", () => {
  it("resolve to real colours in the browser", () => {
    const plain = document.createElement("div");
    const probe = document.createElement("div");
    probe.className = "bg-success text-warning-foreground";
    document.body.append(plain, probe);
    expect(getComputedStyle(probe).backgroundColor).not.toBe(getComputedStyle(plain).backgroundColor);
    expect(getComputedStyle(probe).color).not.toBe(getComputedStyle(plain).color);
    plain.remove();
    probe.remove();
  });
});
