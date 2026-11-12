import type { PaginationState } from "@tanstack/react-table";
import { UsersIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { DataTableColumn } from "@/components/data-table";
import { ListPage } from "@/components/list-page";
import { Badge } from "@/components/ui/badge";
import type { ContactStatusEnum, ContactsQuery } from "@/graphql/generated/graphql";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { useContacts } from "./api";

type ContactRow = NonNullable<NonNullable<ContactsQuery["contacts"]>[number]>;

const statusVariant: Record<ContactStatusEnum, "success" | "neutral" | "danger" | "warning"> = {
  VALID: "success",
  PROCESSING: "neutral",
  INVALID: "warning",
  FAILED: "danger",
  BLOCKED: "danger",
};

const emptyRows: ContactRow[] = [];

export function ContactsPage() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 });
  const term = useDebouncedValue(search.trim());
  const contacts = useContacts({ term, ...pagination });

  const columns = useMemo<DataTableColumn<ContactRow>[]>(
    () => [
      { accessorKey: "name", header: t("contacts.columns.name"), enableSorting: false },
      {
        accessorKey: "maskedPhone",
        header: t("contacts.columns.phone"),
        enableSorting: false,
        cell: ({ row }) => <span className="font-mono text-body-sm">{row.original.maskedPhone}</span>,
      },
      {
        accessorKey: "status",
        header: t("contacts.columns.status"),
        enableSorting: false,
        cell: ({ row }) =>
          row.original.status ? (
            <Badge variant={statusVariant[row.original.status]}>{t(`contacts.status.${row.original.status}`)}</Badge>
          ) : null,
      },
      {
        accessorKey: "lastMessageAt",
        header: t("contacts.columns.lastMessage"),
        enableSorting: false,
        cell: ({ row }) =>
          row.original.lastMessageAt
            ? new Date(row.original.lastMessageAt).toLocaleDateString(i18n.language, { day: "numeric", month: "short" })
            : null,
      },
    ],
    [t, i18n.language],
  );

  const rows = useMemo(
    () => contacts.data?.contacts?.filter((contact): contact is ContactRow => Boolean(contact?.id)) ?? emptyRows,
    [contacts.data],
  );

  return (
    <ListPage
      title={t("contacts.title")}
      description={t("contacts.description")}
      search={{ value: search, onValueChange: setSearch, placeholder: t("contacts.search") }}
      label={t("contacts.title")}
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id as string}
      total={contacts.data?.countContacts ?? 0}
      pagination={pagination}
      onPaginationChange={setPagination}
      isLoading={contacts.isPending}
      error={contacts.isError ? { title: t("contacts.error.title"), onRetry: () => void contacts.refetch() } : null}
      empty={{ title: t("contacts.empty.title"), description: t("contacts.empty.description"), icon: <UsersIcon /> }}
      noResults={{ title: t("contacts.noResults.title"), description: t("contacts.noResults.description") }}
    />
  );
}
