/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
/** Filtering options for contacts */
export type ContactFilter = {
  /** Match the bsp provider status */
  bspStatus?: ContactProviderStatusEnum | null | undefined;
  /** a static date range input field which will apply on updated at column. */
  dateRange?: DateRangeInput | null | undefined;
  /** Exclude contacts with in these groups */
  excludeGroups?: Array<string | number | null | undefined> | null | undefined;
  /** Exclude contacts with in these wa_groups */
  excludeWaGroups?: Array<string | number | null | undefined> | null | undefined;
  /** Include contacts with in these groups */
  includeGroups?: Array<string | number | null | undefined> | null | undefined;
  /** Include contacts with these tags */
  includeTags?: Array<string | number | null | undefined> | null | undefined;
  /** Include contacts with in these wa_groups */
  includeWaGroups?: Array<string | number | null | undefined> | null | undefined;
  /** Match the name */
  name?: string | null | undefined;
  /** Match the phone */
  phone?: string | null | undefined;
  /** Match the status */
  status?: ContactStatusEnum | null | undefined;
  /** Match the name or phone, or the start of a web username (never for a staff user) */
  term?: string | null | undefined;
};

/** The Contact Provider Status enum */
export type ContactProviderStatusEnum =
  | 'HSM'
  | 'NONE'
  | 'SESSION'
  | 'SESSION_AND_HSM';

/** The Contact Status enum */
export type ContactStatusEnum =
  | 'BLOCKED'
  | 'FAILED'
  | 'INVALID'
  | 'PROCESSING'
  | 'VALID';

/** A generic date range filter where from and to both are inclusive */
export type DateRangeInput = {
  /** column name where we apply the date range. Default is inserted_at. */
  column?: string | null | undefined;
  /** Start date for the filter */
  from?: string | null | undefined;
  /** End date for the filter */
  to?: string | null | undefined;
};

/** Lets collapse sort order, limit and offset into its own little groups */
export type Opts = {
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  order?: SortOrder | null | undefined;
  orderWith?: string | null | undefined;
};

/** Enum for ordering results */
export type SortOrder =
  | 'ASC'
  | 'DESC';

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { currentUser: { user: { id: string | null, name: string | null, roles: Array<unknown> | null } | null } | null };

export type ContactsQueryVariables = Exact<{
  filter?: ContactFilter | null | undefined;
  opts?: Opts | null | undefined;
}>;


export type ContactsQuery = { countContacts: number | null, contacts: Array<{ id: string | null, name: string | null, maskedPhone: string | null, status: ContactStatusEnum | null, lastMessageAt: string | null } | null> | null };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const CurrentUserDocument = new TypedDocumentString(`
    query CurrentUser {
  currentUser {
    user {
      id
      name
      roles
    }
  }
}
    `) as unknown as TypedDocumentString<CurrentUserQuery, CurrentUserQueryVariables>;
export const ContactsDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<ContactsQuery, ContactsQueryVariables>;