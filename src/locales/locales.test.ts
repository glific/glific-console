import { describe, expect, it } from "vitest";
import en from "./en.json";
import hi from "./hi.json";

type Tree = { [key: string]: string | Tree };

function leaves(tree: Tree, prefix = ""): Map<string, string> {
  return new Map(
    Object.entries(tree).flatMap(([key, value]) =>
      typeof value === "string" ? [[`${prefix}${key}`, value]] : [...leaves(value, `${prefix}${key}.`)],
    ),
  );
}

const placeholders = (text: string) => [...text.matchAll(/{{\s*(\w+)\s*}}/g)].map((match) => match[1]).sort();

describe("translations", () => {
  const english = leaves(en);
  const hindi = leaves(hi);

  it("has every English string in Hindi, and nothing extra", () => {
    expect([...hindi.keys()].sort()).toEqual([...english.keys()].sort());
  });

  it("keeps the same {{placeholders}} in each translation", () => {
    for (const [key, text] of english) expect(placeholders(hindi.get(key) ?? ""), key).toEqual(placeholders(text));
  });
});
