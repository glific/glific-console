import { ColourChip } from "./ColourChip";
import { familyOf, paletteColours } from "./Palette";

export function BrandColours() {
  const brand = paletteColours().filter((colour) => familyOf(colour) === "Brand");
  return (
    <div className="grid grid-cols-2 gap-stack sm:grid-cols-4">
      {brand.map((colour) => (
        <ColourChip key={colour.name} colour={colour} large />
      ))}
    </div>
  );
}
