import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useOrganization } from "@/features/organization/organization";
import { request } from "@/graphql/client";
import { graphql } from "@/graphql/document";
import type {
  WalletBalanceQuery,
  WalletBalanceQueryVariables,
  WalletBalanceUpdatedSubscription,
  WalletBalanceUpdatedSubscriptionVariables,
} from "@/graphql/generated/graphql";
import { subscribe } from "@/graphql/subscriptions";

const walletBalanceQuery = graphql<WalletBalanceQuery, WalletBalanceQueryVariables>(`
  query WalletBalance {
    bspbalance
  }
`);

const walletBalanceSubscription = graphql<WalletBalanceUpdatedSubscription, WalletBalanceUpdatedSubscriptionVariables>(`
  subscription WalletBalanceUpdated($organizationId: ID!) {
    bspBalance(organizationId: $organizationId)
  }
`);

// Gupshup Enterprise bills outside Glific, so there is no wallet to show.
const NO_WALLET_PROVIDERS = new Set(["gupshup_enterprise"]);
const walletBalanceKey = ["walletBalance"] as const;

function parseBalance(raw: unknown): number | null {
  try {
    const value = typeof raw === "string" ? JSON.parse(raw) : raw;
    const balance = (value as { balance?: unknown } | null)?.balance;
    return typeof balance === "number" ? balance : null;
  } catch {
    return null;
  }
}

export function useWalletBalance() {
  const queryClient = useQueryClient();
  const organization = useOrganization().data;
  const shown =
    Boolean(organization) && !organization?.isTrialOrg && !NO_WALLET_PROVIDERS.has(organization?.bsp?.shortcode ?? "");
  const balance = useQuery({
    queryKey: walletBalanceKey,
    queryFn: async () => parseBalance((await request(walletBalanceQuery)).bspbalance),
    enabled: shown,
    staleTime: Number.POSITIVE_INFINITY,
  });
  const organizationId = organization?.id;

  useEffect(() => {
    if (!shown || !organizationId) return;
    return subscribe(
      walletBalanceSubscription,
      { organizationId },
      {
        next: (data) => {
          const value = parseBalance(data.bspBalance);
          if (value !== null) queryClient.setQueryData(walletBalanceKey, value);
        },
      },
    );
  }, [shown, organizationId, queryClient]);

  return { shown, balance: balance.data ?? null, isLoading: balance.isPending, isError: balance.isError };
}
