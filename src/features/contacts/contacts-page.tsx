import { SearchIcon, UsersIcon } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useContacts } from "./api";
import type { Contact } from "./types";

function matches(contact: Contact, query: string): boolean {
  const q = query.trim().toLowerCase();
  return q === "" || contact.name.toLowerCase().includes(q) || contact.phone.includes(q);
}

export function ContactsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const query = useDeferredValue(search);
  const contacts = useContacts();

  return (
    <div className="flex flex-col gap-section">
      <PageHeader title={t("contacts.title")} description={t("contacts.description")} />
      <ContactsBody contacts={contacts} query={query} search={search} onSearchChange={setSearch} />
    </div>
  );
}

interface ContactsBodyProps {
  contacts: ReturnType<typeof useContacts>;
  query: string;
  search: string;
  onSearchChange: (value: string) => void;
}

function ContactsBody({ contacts, query, search, onSearchChange }: ContactsBodyProps) {
  const { t } = useTranslation();

  if (contacts.isPending) return <ContactsSkeleton />;

  if (contacts.isError) {
    return <ErrorState title={t("contacts.error.title")} onRetry={() => void contacts.refetch()} />;
  }

  if (contacts.data.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon />}
        title={t("contacts.empty.title")}
        description={t("contacts.empty.description")}
      />
    );
  }

  const visible = contacts.data.filter((contact) => matches(contact, query));

  return (
    <div className="flex flex-col gap-stack">
      <div className="flex max-w-sm flex-col gap-1">
        <Label htmlFor="contacts-search" className="sr-only">
          {t("contacts.search")}
        </Label>
        <div className="relative">
          <SearchIcon
            aria-hidden="true"
            className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="contacts-search"
            type="search"
            placeholder={t("contacts.search")}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      {visible.length === 0 ? (
        <EmptyState title={t("contacts.noResults.title")} description={t("contacts.noResults.description")} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("contacts.columns.name")}</TableHead>
              <TableHead>{t("contacts.columns.phone")}</TableHead>
              <TableHead>{t("contacts.columns.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell className="font-mono text-body-sm">{contact.phone}</TableCell>
                <TableCell>
                  <Badge variant={contact.status === "valid" ? "secondary" : "outline"}>
                    {t(`contacts.status.${contact.status}`)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function ContactsSkeleton() {
  const { t } = useTranslation();
  return (
    <div role="status" aria-label={t("common.loading")} className="flex flex-col gap-stack">
      <Skeleton className="h-8 max-w-sm" />
      {[0, 1, 2, 3].map((row) => (
        <Skeleton key={row} className="h-10" />
      ))}
    </div>
  );
}
