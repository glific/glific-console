import { HttpResponse } from "msw";
import { glificApi } from "./api";

export const homeHandlers = [
  glificApi.query("HomeActivity", () =>
    HttpResponse.json({ data: { newContacts: 212, previousNewContacts: 189, messages: 4380, previousMessages: 4100 } }),
  ),
  glificApi.query("HomeUsage", ({ variables }) => {
    const recent =
      String(variables.toDate) >= new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const day = recent
      ? { date: String(variables.toDate), incomingMsg: 1600, outgoingMsg: 3480, totalFees: 2.1 }
      : { date: String(variables.toDate), incomingMsg: 1500, outgoingMsg: 3100, totalFees: 1.8 };
    return HttpResponse.json({ data: { dailyAppUsage: [day] } });
  }),
  glificApi.query("HomeFlowsAndTriggers", () =>
    HttpResponse.json({
      data: {
        flows: [
          {
            id: "11",
            uuid: "0b1f2c3d-0000-4000-8000-000000000011",
            name: "Worker onboarding",
            lastPublishedAt: "2026-11-10T09:00:00Z",
            lastChangedAt: "2026-11-17T06:00:00Z",
            updatedAt: "2026-11-17T06:00:00Z",
          },
          {
            id: "12",
            uuid: "0b1f2c3d-0000-4000-8000-000000000012",
            name: "State registration",
            lastPublishedAt: "2026-11-12T09:00:00Z",
            lastChangedAt: "2026-11-12T09:00:00Z",
            updatedAt: "2026-11-12T09:00:00Z",
          },
        ],
        triggers: [
          {
            id: "5",
            name: "Weekly lesson",
            isActive: true,
            nextTriggerAt: "2099-11-20T03:30:00Z",
            groups: ["Class 5 parents"],
            flow: { name: "Weekly lesson" },
          },
        ],
      },
    }),
  ),
];
