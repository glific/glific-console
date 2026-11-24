/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type AskGlificFeedbackInput = {
  content?: string | null | undefined;
  messageId: string;
  rating?: string | null | undefined;
};

export type AskGlificInput = {
  conversationId?: string | null | undefined;
  pageUrl?: string | null | undefined;
  query: string;
  requestId?: string | null | undefined;
};

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

export type CurrentUserInput = {
  email?: string | null | undefined;
  languageId?: string | number | null | undefined;
  name?: string | null | undefined;
  otp?: string | null | undefined;
  password?: string | null | undefined;
};

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


export type CurrentUserQuery = { currentUser: { user: { id: string | null, name: string | null, accessRoles: Array<{ label: string | null } | null> | null, language: { locale: string | null } | null, organization: { id: string | null, activeLanguages: Array<{ id: string | null, label: string | null, labelLocale: string | null, locale: string | null, localized: boolean | null } | null> | null } | null } | null } | null };

export type ContactsQueryVariables = Exact<{
  filter?: ContactFilter | null | undefined;
  opts?: Opts | null | undefined;
}>;


export type ContactsQuery = { countContacts: number | null, contacts: Array<{ id: string | null, name: string | null, maskedPhone: string | null, status: ContactStatusEnum | null, lastMessageAt: string | null } | null> | null };

export type AskGlificMutationVariables = Exact<{
  input: AskGlificInput;
}>;


export type AskGlificMutation = { askGlific: { errors: Array<{ message: string } | null> | null } | null };

export type AskGlificResponseSubscriptionVariables = Exact<{
  organizationId: string | number;
}>;


export type AskGlificResponseSubscription = { askGlificResponse: { answer: string | null, conversationId: string | null, messageId: string | null, requestId: string | null, errors: Array<{ message: string } | null> | null } | null };

export type AskGlificFeedbackMutationVariables = Exact<{
  input: AskGlificFeedbackInput;
}>;


export type AskGlificFeedbackMutation = { askGlificFeedback: { success: boolean | null } | null };

export type UpdateLanguageMutationVariables = Exact<{
  input: CurrentUserInput;
}>;


export type UpdateLanguageMutation = { updateCurrentUser: { user: { id: string | null } | null, errors: Array<{ key: string, message: string } | null> | null } | null };

export type UnreadNotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type UnreadNotificationsQuery = { countNotifications: number | null };

export type RecentNotificationsQueryVariables = Exact<{
  opts?: Opts | null | undefined;
}>;


export type RecentNotificationsQuery = { notifications: Array<{ id: string | null, category: string | null, message: string | null, severity: unknown, isRead: boolean | null, insertedAt: string | null } | null> | null };

export type MarkNotificationsReadMutationVariables = Exact<{ [key: string]: never; }>;


export type MarkNotificationsReadMutation = { markNotificationAsRead: boolean | null };

export type OrganizationQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationQuery = { organization: { organization: { id: string | null, name: string | null, isTrialOrg: boolean | null, isSuspended: boolean | null, trialExpirationDate: string | null, bsp: { shortcode: string | null } | null } | null } | null };

export type OrganizationServicesQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationServicesQuery = { organizationServices: { askGlificEnabled: boolean | null, glificAiEnabled: boolean | null, certificateEnabled: boolean | null, rolesAndPermission: boolean | null, ticketingEnabled: boolean | null, whatsappFormsEnabled: boolean | null, whatsappGroupEnabled: boolean | null } | null };

export type WalletBalanceQueryVariables = Exact<{ [key: string]: never; }>;


export type WalletBalanceQuery = { bspbalance: unknown };

export type WalletBalanceUpdatedSubscriptionVariables = Exact<{
  organizationId: string | number;
}>;


export type WalletBalanceUpdatedSubscription = { bspBalance: unknown };
