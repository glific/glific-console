import { BookOpenIcon, ExternalLinkIcon, MessagesSquareIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";

const resources = [
  { id: "docs", href: "https://docs.glific.org", icon: BookOpenIcon },
  { id: "community", href: "https://discord.gg/kyqsZAJEPK", icon: MessagesSquareIcon },
] as const;

export function ResourcesPanel() {
  const { t } = useTranslation();
  return (
    <ul className="flex flex-col gap-inline p-stack">
      {resources.map((resource) => {
        const Icon = resource.icon;
        return (
          <li key={resource.id}>
            <Item variant="outline" asChild>
              <a href={resource.href} target="_blank" rel="noreferrer">
                <ItemMedia variant="icon">
                  <Icon aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{t(`shell.resources.${resource.id}.title`)}</ItemTitle>
                  <ItemDescription>{t(`shell.resources.${resource.id}.description`)}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <ExternalLinkIcon aria-hidden="true" className="size-4 text-muted-foreground" />
                  <span className="sr-only">{t("common.opensInNewTab")}</span>
                </ItemActions>
              </a>
            </Item>
          </li>
        );
      })}
    </ul>
  );
}
