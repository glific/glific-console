import { useQuery } from "@tanstack/react-query";
import { admins, managers, useAccess } from "@/features/auth/current-user";
import { request } from "@/graphql/client";
import { graphql } from "@/graphql/generated";

export type Period = 7 | 30;

const DAY = 24 * 60 * 60 * 1000;

export function periodRanges(days: Period, now = Date.now()) {
  const from = new Date(now - days * DAY);
  const previousFrom = new Date(now - 2 * days * DAY);
  return {
    current: { from: from.toISOString(), to: new Date(now).toISOString() },
    previous: { from: previousFrom.toISOString(), to: from.toISOString() },
  };
}

const isoDate = (iso: string) => iso.slice(0, 10);

/** Whole days for the provider's daily usage: the last `days` days, and the same number before, with no shared day. */
export function periodDays(days: Period, now = Date.now()) {
  const day = (offset: number) => isoDate(new Date(now - offset * DAY).toISOString());
  return {
    current: { fromDate: day(days - 1), toDate: day(0) },
    previous: { fromDate: day(2 * days - 1), toDate: day(days) },
  };
}

// Home's counts are costly on large organisations and change slowly; don't refetch on every visit or focus.
const homeQuery = { staleTime: 5 * 60_000, refetchOnWindowFocus: false } as const;

/** Percentage change from the previous period; null when there is nothing to compare with. */
export function change(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

const ActivityCounts = graphql(`
  query HomeActivity($current: DateRangeInput, $previous: DateRangeInput) {
    newContacts: countContacts(filter: { dateRange: $current })
    previousNewContacts: countContacts(filter: { dateRange: $previous })
    messages: countMessages(filter: { dateRange: $current })
    previousMessages: countMessages(filter: { dateRange: $previous })
  }
`);

const Usage = graphql(`
  query HomeUsage($fromDate: Date!, $toDate: Date!) {
    dailyAppUsage(fromDate: $fromDate, toDate: $toDate) {
      date
      incomingMsg
      outgoingMsg
      totalFees
    }
  }
`);

export interface UsageTotals {
  received: number;
  sent: number;
  spent: number;
}

function totals(
  days: readonly ({ incomingMsg?: number | null; outgoingMsg?: number | null; totalFees?: number | null } | null)[],
) {
  return days.reduce<UsageTotals>(
    (sum, day) => ({
      received: sum.received + (day?.incomingMsg ?? 0),
      sent: sum.sent + (day?.outgoingMsg ?? 0),
      spent: sum.spent + (day?.totalFees ?? 0),
    }),
    { received: 0, sent: 0, spent: 0 },
  );
}

export function useActivity(days: Period) {
  return useQuery({
    queryKey: ["home", "activity", days],
    ...homeQuery,
    queryFn: async () => {
      const { current, previous } = periodRanges(days);
      return request(ActivityCounts, { current, previous });
    },
  });
}

/** WhatsApp usage from the provider; the backend only gives it to admins, and only with Gupshup. */
export function useUsage(days: Period) {
  const { can } = useAccess();
  return useQuery({
    queryKey: ["home", "usage", days],
    ...homeQuery,
    enabled: can(admins),
    retry: false,
    queryFn: async () => {
      const { current, previous } = periodDays(days);
      const [now, before] = await Promise.all([request(Usage, current), request(Usage, previous)]);
      return { current: totals(now.dailyAppUsage ?? []), previous: totals(before.dailyAppUsage ?? []) };
    },
  });
}

const FlowsAndTriggers = graphql(`
  query HomeFlowsAndTriggers {
    flows(filter: { isTemplate: false }, opts: { limit: 50, order: DESC, orderWith: "updated_at" }) {
      id
      uuid
      name
      lastPublishedAt
      lastChangedAt
      updatedAt
    }
    triggers(opts: { limit: 50, order: DESC, orderWith: "updated_at" }) {
      id
      name
      isActive
      nextTriggerAt
      groups
      flow {
        name
      }
    }
  }
`);

/** Flows and triggers for Suggested actions; both are manager pages in the current app. */
export function useFlowsAndTriggers() {
  const { can } = useAccess();
  return useQuery({
    queryKey: ["home", "flows"],
    ...homeQuery,
    enabled: can(managers),
    queryFn: () => request(FlowsAndTriggers),
  });
}
