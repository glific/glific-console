import type { ContactStatusEnum } from "@/graphql/generated/graphql";

export interface MockContact {
  id: string;
  name: string;
  maskedPhone: string;
  status: ContactStatusEnum;
  lastMessageAt: string | null;
}

const names = [
  "Asha Kulkarni",
  "Rahul Verma",
  "Meera Iyer",
  "Imran Shaikh",
  "Priya Nair",
  "Sunil Patil",
  "Fatima Khan",
  "Arjun Rao",
  "Kavita Joshi",
  "Deepak Yadav",
];
const statuses: ContactStatusEnum[] = ["VALID", "VALID", "VALID", "INVALID", "VALID", "BLOCKED", "VALID", "PROCESSING"];

export const contacts: MockContact[] = Array.from({ length: 60 }, (_, index) => {
  const name = `${names[index % names.length]}${index >= names.length ? ` ${Math.floor(index / names.length) + 1}` : ""}`;
  const suffix = String(500001 + index).slice(-4);
  return {
    id: String(index + 1),
    name,
    maskedPhone: `91987******${suffix.slice(-2)}`,
    status: statuses[index % statuses.length] ?? "VALID",
    lastMessageAt: new Date(Date.UTC(2026, 10, 12 - (index % 20))).toISOString(),
  };
}).sort((a, b) => a.name.localeCompare(b.name));
