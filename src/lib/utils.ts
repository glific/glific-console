import { createCn } from "cn/config";
import { spacingScale, typographyScale } from "@/styles/tokens";

/**
 * Tailwind class merger that knows our custom typography and spacing tokens,
 * so `cn("text-body", "text-muted-foreground")` keeps both (size vs colour).
 */
export const cn = createCn({
  extend: {
    theme: { spacing: [...spacingScale] },
    classGroups: { "font-size": [{ text: [...typographyScale] }] },
  },
});
