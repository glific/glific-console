import { foundations } from "./foundations";
import { moreSections } from "./more-sections";
import { sections as baseSections, type CatalogSection } from "./sections";

const order: NonNullable<CatalogSection["group"]>[] = ["Foundations", "Glific patterns", "Components"];

export const allSections: CatalogSection[] = [...foundations, ...moreSections, ...baseSections].sort(
  (a, b) => order.indexOf(a.group ?? "Components") - order.indexOf(b.group ?? "Components"),
);

export const sectionGroups = order.map((group) => ({
  group,
  sections: allSections.filter((section) => (section.group ?? "Components") === group),
}));
