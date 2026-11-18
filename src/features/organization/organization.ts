import { useQuery } from "@tanstack/react-query";
import { request } from "@/graphql/client";
import { graphql } from "@/graphql/generated";
import { useSession } from "@/lib/use-session";

const OrganizationQuery = graphql(`
  query Organization {
    organization {
      organization {
        id
        name
        isTrialOrg
        isSuspended
        trialExpirationDate
        bsp {
          shortcode
        }
      }
    }
  }
`);

const OrganizationServicesQuery = graphql(`
  query OrganizationServices {
    organizationServices {
      askGlificEnabled
      glificAiEnabled
      certificateEnabled
      rolesAndPermission
      ticketingEnabled
      whatsappFormsEnabled
      whatsappGroupEnabled
    }
  }
`);

export type OrganizationService =
  | "askGlificEnabled"
  | "glificAiEnabled"
  | "certificateEnabled"
  | "rolesAndPermission"
  | "ticketingEnabled"
  | "whatsappFormsEnabled"
  | "whatsappGroupEnabled";

export function useOrganization() {
  const session = useSession();
  return useQuery({
    queryKey: ["organization"],
    queryFn: async () => (await request(OrganizationQuery)).organization?.organization ?? null,
    enabled: Boolean(session),
    staleTime: 5 * 60_000,
  });
}

export function useOrganizationServices() {
  const session = useSession();
  const services = useQuery({
    queryKey: ["organizationServices"],
    queryFn: async () => (await request(OrganizationServicesQuery)).organizationServices ?? null,
    enabled: Boolean(session),
    staleTime: 5 * 60_000,
  });
  return {
    enabled: (service: OrganizationService) => Boolean(services.data?.[service]),
    isLoading: services.isPending,
  };
}
