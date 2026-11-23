import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useOrganization } from "@/features/organization/organization";
import { request } from "@/graphql/client";
import { graphql } from "@/graphql/generated";
import { subscribe } from "@/graphql/subscriptions";

const WalletBalanceQuery = graphql(`
  query WalletBalance {
    bspbalance
  }
`);

const WalletBalanceSubscription = graphql(`
  subscription WalletBalanceUpdated($organizationId: ID!) {
    bspBalance(organizationId: $organizationId)
  }
`);

// Gupshup Enterprise bills outside Glific, so there is no wallet to show.
const NO_WALLET_PROVIDERS = new Set(["gupshup_enterprise"]);
const walletBalanceKey = ["walletBalance"] as const;

/** At or below this (USD) the wallet counts as low, as in the current app. */
export const LOW_BALANCE = 1;

function parseBalance(raw: unknown): number | null {
  try {
    const value = typeof raw === "string" ? JSON.parse(raw) : raw;
    const balance = (value as { balance?: unknown } | null)?.balance;
    return typeof balance === "number" ? balance : null;
  } catch {
    return null;
  }
}

/** The WhatsApp wallet balance, kept live by the backend's periodic push. Hidden for trials and no-wallet providers. */
export function useWalletBalance() {
  const queryClient = useQueryClient();
  const organization = useOrganization().data;
  const shown =
    Boolean(organization) && !organization?.isTrialOrg && !NO_WALLET_PROVIDERS.has(organization?.bsp?.shortcode ?? "");
  const balance = useQuery({
    queryKey: walletBalanceKey,
    queryFn: async () => parseBalance((await request(WalletBalanceQuery)).bspbalance),
    enabled: shown,
    staleTime: Number.POSITIVE_INFINITY,
  });
  const organizationId = organization?.id;

  useEffect(() => {
    if (!shown || !organizationId) return;
    return subscribe(
      WalletBalanceSubscription,
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
