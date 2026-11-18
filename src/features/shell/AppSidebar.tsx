import { Fragment, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/glific-logo.png";
import { NavTargetLink } from "@/components/NavTargetLink";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigation } from "./navigation";
import { RailBalance } from "./RailBalance";
import { useActiveSection } from "./use-active-section";

// After first paint: the menu brings in floating-ui, which the first screen doesn't need.
const AccountMenu = lazy(async () => ({ default: (await import("./AccountMenu")).AccountMenu }));

export function AppSidebar() {
  const { t } = useTranslation();
  const { isMobile, setOpenMobile } = useSidebar();
  const navigation = useNavigation();
  const active = useActiveSection(navigation.rail.flat());

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="h-16 flex-row items-center gap-2 px-3 group-data-[collapsible=icon]:justify-center">
        <img src={logo} alt={t("app.name")} width={38} height={23} className="group-data-[collapsible=icon]:hidden" />
        <SidebarTrigger className="ml-auto group-data-[collapsible=icon]:ml-0" />
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label={t("nav.label")}>
          <SidebarGroup>
            {navigation.isLoading ? (
              <SidebarMenu>
                {["a", "b", "c", "d"].map((key) => (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : (
              navigation.rail.map((group, index) => (
                <Fragment key={group[0]?.id}>
                  {index > 0 ? <SidebarSeparator className="my-2" /> : null}
                  <SidebarMenu className="gap-0.5">
                    {group.map((section) => {
                      const Icon = section.icon;
                      const label = t(section.label);
                      return (
                        <SidebarMenuItem key={section.id}>
                          <SidebarMenuButton asChild isActive={active === section.id} tooltip={label}>
                            <NavTargetLink
                              destination={section.target}
                              aria-current={active === section.id ? "page" : undefined}
                              onClick={() => isMobile && setOpenMobile(false)}
                            >
                              <Icon aria-hidden="true" />
                              <span>{label}</span>
                            </NavTargetLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </Fragment>
              ))
            )}
          </SidebarGroup>
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <RailBalance />
        <Suspense
          fallback={
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            </SidebarMenu>
          }
        >
          <AccountMenu settings={navigation.settings} glificAdmin={navigation.glificAdmin} />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}
