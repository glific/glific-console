import { ChevronsUpDownIcon, LogOutIcon, SettingsIcon, UserCogIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { NavTargetLink } from "@/components/NavTargetLink";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useCurrentUser } from "@/features/auth/current-user";
import { LanguageMenu } from "@/features/language";
import { useOrganization } from "@/features/organization/organization";
import { myAccountUrl, type ResolvedSection } from "./navigation";

interface AccountMenuProps {
  settings: ResolvedSection | null;
  glificAdmin: ResolvedSection | null;
}

export function AccountMenu({ settings, glificAdmin }: AccountMenuProps) {
  const { t } = useTranslation();
  const { isMobile } = useSidebar();
  const user = useCurrentUser().data;
  const organization = useOrganization().data;
  const workspace = organization?.name ?? "";
  const myAccount = myAccountUrl();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-hover">
              <Avatar size="sm" aria-hidden="true">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {workspace.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="flex-1 truncate text-sidebar-foreground">
                {workspace}
                <span className="sr-only">{t("shell.account.suffix")}</span>
              </span>
              <ChevronsUpDownIcon aria-hidden="true" className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? "top" : "right"} align="end" className="min-w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span className="truncate text-body font-medium">{user?.name}</span>
              <span className="truncate text-body-sm font-normal text-muted-foreground">{workspace}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {myAccount ? (
                <DropdownMenuItem asChild>
                  <a href={myAccount}>
                    <UserCogIcon aria-hidden="true" />
                    {t("shell.account.myAccount")}
                  </a>
                </DropdownMenuItem>
              ) : null}
              {settings ? (
                <DropdownMenuItem asChild>
                  <NavTargetLink destination={settings.target}>
                    <SettingsIcon aria-hidden="true" />
                    {t(settings.label)}
                  </NavTargetLink>
                </DropdownMenuItem>
              ) : null}
              <LanguageMenu />
            </DropdownMenuGroup>
            {glificAdmin ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-body-sm text-muted-foreground">
                    {t(glificAdmin.label)}
                  </DropdownMenuLabel>
                  {glificAdmin.pages.map((page) => (
                    <DropdownMenuItem key={page.id} asChild>
                      <NavTargetLink destination={page.target}>{t(page.label)}</NavTargetLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/logout">
                <LogOutIcon aria-hidden="true" />
                {t("auth.signOut")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
