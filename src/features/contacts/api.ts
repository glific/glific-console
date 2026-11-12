import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { request } from "@/graphql/client";
import { graphql } from "@/graphql/generated";

const ContactsQuery = graphql(`
  query Contacts($filter: ContactFilter, $opts: Opts) {
    contacts(filter: $filter, opts: $opts) {
      id
      name
      maskedPhone
      status
      lastMessageAt
    }
    countContacts(filter: $filter)
  }
`);

export interface ContactsParams {
  term: string;
  pageIndex: number;
  pageSize: number;
}

export const contactKeys = {
  all: ["contacts"] as const,
  list: (params: ContactsParams) => [...contactKeys.all, "list", params] as const,
};

export function useContacts(params: ContactsParams) {
  return useQuery({
    queryKey: contactKeys.list(params),
    queryFn: () =>
      request(ContactsQuery, {
        filter: params.term ? { term: params.term } : {},
        opts: { limit: params.pageSize, offset: params.pageIndex * params.pageSize, order: "ASC", orderWith: "name" },
      }),
    placeholderData: keepPreviousData,
  });
}
