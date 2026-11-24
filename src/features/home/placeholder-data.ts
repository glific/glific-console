// Sample figures for Home until its backend data is wired up; replace with real queries.

export type Period = 7 | 30;

export interface PlaceholderStat {
  id: "contacts" | "received" | "sent" | "spent";
  value: number;
  /** Change versus the previous period, in percent. */
  trend: number;
}

export const placeholderStats: Record<Period, PlaceholderStat[]> = {
  7: [
    { id: "contacts", value: 212, trend: 12 },
    { id: "received", value: 1600, trend: 7 },
    { id: "sent", value: 3480, trend: 12 },
    { id: "spent", value: 2.1, trend: 17 },
  ],
  30: [
    { id: "contacts", value: 860, trend: 4 },
    { id: "received", value: 6420, trend: 9 },
    { id: "sent", value: 14920, trend: 6 },
    { id: "spent", value: 9.4, trend: 3 },
  ],
};

const HOUR = 60 * 60 * 1000;

export const placeholderDrafts = [{ id: "draft-1", name: "Worker onboarding", editedAgo: 4 * HOUR }];

export const placeholderScheduled = [
  { id: "trigger-1", name: "Weekly lesson", inMs: 2 * 24 * HOUR, groups: ["Class 5 parents"] },
];
