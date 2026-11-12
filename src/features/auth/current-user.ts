import { useQuery } from "@tanstack/react-query";
import { request } from "@/graphql/client";
import { graphql } from "@/graphql/generated";
import { useSession } from "@/lib/use-session";

const CurrentUserQuery = graphql(`
  query CurrentUser {
    currentUser {
      user {
        id
        name
        roles
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

// The backend serialises roles as labels ("Glific_admin", "Admin", "No access"); compare on a normalised form.
const normalise = (role: unknown) => String(role).trim().toLowerCase().replace(/\s+/g, "_");

export function hasRole(
  roles: readonly unknown[] | null | undefined,
  role: "glific_admin" | "admin" | "manager" | "staff",
) {
  return (roles ?? []).some((value) => normalise(value) === role);
}

export function useIsGlificAdmin(): { isGlificAdmin: boolean; isLoading: boolean } {
  const user = useCurrentUser();
  return { isGlificAdmin: hasRole(user.data?.roles, "glific_admin"), isLoading: user.isPending };
}
