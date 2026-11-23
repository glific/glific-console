import { HttpResponse } from "msw";
import { glificApi, glificSocket } from "./api";

export const organizationHandlers = [
  glificSocket("WalletBalanceUpdated", () => {}),
  glificApi.query("Organization", () =>
    HttpResponse.json({
      data: {
        organization: {
          organization: {
            id: "1",
            name: "Glific",
            isTrialOrg: false,
            isSuspended: false,
            bsp: { shortcode: "gupshup" },
          },
        },
      },
    }),
  ),
  glificApi.query("OrganizationServices", () =>
    HttpResponse.json({
      data: {
        organizationServices: {
          askGlificEnabled: true,
          glificAiEnabled: false,
          certificateEnabled: false,
          rolesAndPermission: false,
          ticketingEnabled: false,
          whatsappFormsEnabled: true,
          whatsappGroupEnabled: false,
        },
      },
    }),
  ),
  glificApi.query("WalletBalance", () => HttpResponse.json({ data: { bspbalance: '{"balance":12.5}' } })),
];
