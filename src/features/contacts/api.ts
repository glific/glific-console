import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Contact } from "./types";

export const contactKeys = {
  all: ["contacts"] as const,
};

export function useContacts() {
  return useQuery({
    queryKey: contactKeys.all,
    queryFn: () => apiClient.get<Contact[]>("/contacts"),
  });
}
