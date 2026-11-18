import { useQuery } from "@tanstack/react-query";
import { request } from "@/graphql/client";
import { graphql } from "@/graphql/generated";
import { useSession } from "@/lib/use-session";

// accessRoles, not roles: only accessRoles includes the custom roles an organisation creates, and the current app uses it.
const CurrentUserQuery = graphql(`
  query CurrentUser {
    currentUser {
      user {
        id
        name
        accessRoles {
          label
        }
        language {
          locale
        }
        organization {
          id
          activeLanguages {
            id
            label
            labelLocale
            locale
            localized
          }
        }
      }
    }
  }
`);

export const currentUserKey = ["currentUser"] as const;

export function useCurrentUser() {
  const session = useSession();
  return useQuery({
    queryKey: currentUserKey,
    queryFn: async () => (await request(CurrentUserQuery)).currentUser?.user ?? null,
    enabled: Boolean(session),
    staleTime: 5 * 60_000,
  });
}

type WithAccessRoles = { accessRoles?: readonly ({ label?: string | null } | null)[] | null } | null | undefined;

export function roleLabels(user: WithAccessRoles): string[] {
  return (user?.accessRoles ?? []).flatMap((role) => (role?.label ? [role.label] : []));
}

// Role labels arrive as "Glific_admin", "Admin", "No access"; compare on a normalised form.
const normalise = (role: unknown) => String(role).trim().toLowerCase().replace(/\s+/g, "_");

export function hasRole(
  roles: readonly unknown[] | null | undefined,
  role: "glific_admin" | "admin" | "manager" | "staff",
) {
  return (roles ?? []).some((value) => normalise(value) === role);
}

export function useIsGlificAdmin(): { isGlificAdmin: boolean; isLoading: boolean } {
  const user = useCurrentUser();
  return { isGlificAdmin: hasRole(roleLabels(user.data), "glific_admin"), isLoading: user.isPending };
}

export type RoleKind = "staff" | "manager" | "admin" | "glific_admin" | "custom";

// The same groups the current app's menu uses, so each page stays open to the same people.
export const everyone: readonly RoleKind[] = ["staff", "manager", "admin", "glific_admin", "custom"];
export const managers: readonly RoleKind[] = ["manager", "admin", "glific_admin", "custom"];
export const admins: readonly RoleKind[] = ["admin", "glific_admin"];
export const staffManagers: readonly RoleKind[] = ["manager", "admin", "glific_admin"];
export const glificAdmins: readonly RoleKind[] = ["glific_admin"];

const builtIn = new Set<string>(["staff", "manager", "admin", "glific_admin"]);
const noAccess = new Set(["none", "no_access"]);

export function roleKinds(roles: readonly unknown[] | null | undefined): RoleKind[] {
  return (roles ?? []).flatMap((value) => {
    const role = normalise(value);
    if (builtIn.has(role)) return [role as RoleKind];
    return noAccess.has(role) ? [] : ["custom" as const];
  });
}

export function canAccess(roles: readonly unknown[] | null | undefined, allow: readonly RoleKind[]) {
  return roleKinds(roles).some((kind) => allow.includes(kind));
}

export function useAccess(): { can: (allow: readonly RoleKind[]) => boolean; isLoading: boolean } {
  const user = useCurrentUser();
  const labels = roleLabels(user.data);
  return { can: (allow) => canAccess(labels, allow), isLoading: user.isPending };
}
