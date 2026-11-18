import { matchPath, useLocation } from "react-router";
import type { ResolvedSection } from "./navigation";

/** The rail section that owns the current route; pages still in the current app never match. */
export function useActiveSection(sections: readonly ResolvedSection[]): string | null {
  const { pathname } = useLocation();
  for (const section of sections) {
    for (const page of section.pages) {
      if (!("to" in page.target)) continue;
      if (matchPath({ path: page.target.to, end: page.target.end ?? false }, pathname)) return section.id;
    }
  }
  return null;
}
