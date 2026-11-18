/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query CurrentUser {\n    currentUser {\n      user {\n        id\n        name\n        accessRoles {\n          label\n        }\n        language {\n          locale\n        }\n        organization {\n          id\n          activeLanguages {\n            id\n            label\n            labelLocale\n            locale\n            localized\n          }\n        }\n      }\n    }\n  }\n": typeof types.CurrentUserDocument,
    "\n  query Contacts($filter: ContactFilter, $opts: Opts) {\n    contacts(filter: $filter, opts: $opts) {\n      id\n      name\n      maskedPhone\n      status\n      lastMessageAt\n    }\n    countContacts(filter: $filter)\n  }\n": typeof types.ContactsDocument,
    "\n  mutation AskGlific($input: AskGlificInput!) {\n    askGlific(input: $input) {\n      errors {\n        message\n      }\n    }\n  }\n": typeof types.AskGlificDocument,
    "\n  subscription AskGlificResponse($organizationId: ID!) {\n    askGlificResponse(organizationId: $organizationId) {\n      answer\n      conversationId\n      messageId\n      requestId\n      errors {\n        message\n      }\n    }\n  }\n": typeof types.AskGlificResponseDocument,
    "\n  mutation AskGlificFeedback($input: AskGlificFeedbackInput!) {\n    askGlificFeedback(input: $input) {\n      success\n    }\n  }\n": typeof types.AskGlificFeedbackDocument,
    "\n  query HomeActivity($current: DateRangeInput, $previous: DateRangeInput) {\n    newContacts: countContacts(filter: { dateRange: $current })\n    previousNewContacts: countContacts(filter: { dateRange: $previous })\n    messages: countMessages(filter: { dateRange: $current })\n    previousMessages: countMessages(filter: { dateRange: $previous })\n  }\n": typeof types.HomeActivityDocument,
    "\n  query HomeUsage($fromDate: Date!, $toDate: Date!) {\n    dailyAppUsage(fromDate: $fromDate, toDate: $toDate) {\n      date\n      incomingMsg\n      outgoingMsg\n      totalFees\n    }\n  }\n": typeof types.HomeUsageDocument,
    "\n  query HomeFlowsAndTriggers {\n    flows(filter: { isTemplate: false }, opts: { limit: 50, order: DESC, orderWith: \"updated_at\" }) {\n      id\n      uuid\n      name\n      lastPublishedAt\n      lastChangedAt\n      updatedAt\n    }\n    triggers(opts: { limit: 50, order: DESC, orderWith: \"updated_at\" }) {\n      id\n      name\n      isActive\n      nextTriggerAt\n      groups\n      flow {\n        name\n      }\n    }\n  }\n": typeof types.HomeFlowsAndTriggersDocument,
    "\n  mutation UpdateLanguage($input: CurrentUserInput!) {\n    updateCurrentUser(input: $input) {\n      user {\n        id\n      }\n      errors {\n        key\n        message\n      }\n    }\n  }\n": typeof types.UpdateLanguageDocument,
    "\n  query UnreadNotifications {\n    countNotifications(filter: { isRead: false })\n  }\n": typeof types.UnreadNotificationsDocument,
    "\n  query RecentNotifications($opts: Opts) {\n    notifications(opts: $opts) {\n      id\n      category\n      message\n      severity\n      isRead\n      insertedAt\n    }\n  }\n": typeof types.RecentNotificationsDocument,
    "\n  mutation MarkNotificationsRead {\n    markNotificationAsRead\n  }\n": typeof types.MarkNotificationsReadDocument,
    "\n  query Organization {\n    organization {\n      organization {\n        id\n        name\n        isTrialOrg\n        isSuspended\n        trialExpirationDate\n        bsp {\n          shortcode\n        }\n      }\n    }\n  }\n": typeof types.OrganizationDocument,
    "\n  query OrganizationServices {\n    organizationServices {\n      askGlificEnabled\n      glificAiEnabled\n      certificateEnabled\n      rolesAndPermission\n      ticketingEnabled\n      whatsappFormsEnabled\n      whatsappGroupEnabled\n    }\n  }\n": typeof types.OrganizationServicesDocument,
    "\n  query WalletBalance {\n    bspbalance\n  }\n": typeof types.WalletBalanceDocument,
    "\n  subscription WalletBalanceUpdated($organizationId: ID!) {\n    bspBalance(organizationId: $organizationId)\n  }\n": typeof types.WalletBalanceUpdatedDocument,
};
const documents: Documents = {
    "\n  query CurrentUser {\n    currentUser {\n      user {\n        id\n        name\n        accessRoles {\n          label\n        }\n        language {\n          locale\n        }\n        organization {\n          id\n          activeLanguages {\n            id\n            label\n            labelLocale\n            locale\n            localized\n          }\n        }\n      }\n    }\n  }\n": types.CurrentUserDocument,
    "\n  query Contacts($filter: ContactFilter, $opts: Opts) {\n    contacts(filter: $filter, opts: $opts) {\n      id\n      name\n      maskedPhone\n      status\n      lastMessageAt\n    }\n    countContacts(filter: $filter)\n  }\n": types.ContactsDocument,
    "\n  mutation AskGlific($input: AskGlificInput!) {\n    askGlific(input: $input) {\n      errors {\n        message\n      }\n    }\n  }\n": types.AskGlificDocument,
    "\n  subscription AskGlificResponse($organizationId: ID!) {\n    askGlificResponse(organizationId: $organizationId) {\n      answer\n      conversationId\n      messageId\n      requestId\n      errors {\n        message\n      }\n    }\n  }\n": types.AskGlificResponseDocument,
    "\n  mutation AskGlificFeedback($input: AskGlificFeedbackInput!) {\n    askGlificFeedback(input: $input) {\n      success\n    }\n  }\n": types.AskGlificFeedbackDocument,
    "\n  query HomeActivity($current: DateRangeInput, $previous: DateRangeInput) {\n    newContacts: countContacts(filter: { dateRange: $current })\n    previousNewContacts: countContacts(filter: { dateRange: $previous })\n    messages: countMessages(filter: { dateRange: $current })\n    previousMessages: countMessages(filter: { dateRange: $previous })\n  }\n": types.HomeActivityDocument,
    "\n  query HomeUsage($fromDate: Date!, $toDate: Date!) {\n    dailyAppUsage(fromDate: $fromDate, toDate: $toDate) {\n      date\n      incomingMsg\n      outgoingMsg\n      totalFees\n    }\n  }\n": types.HomeUsageDocument,
    "\n  query HomeFlowsAndTriggers {\n    flows(filter: { isTemplate: false }, opts: { limit: 50, order: DESC, orderWith: \"updated_at\" }) {\n      id\n      uuid\n      name\n      lastPublishedAt\n      lastChangedAt\n      updatedAt\n    }\n    triggers(opts: { limit: 50, order: DESC, orderWith: \"updated_at\" }) {\n      id\n      name\n      isActive\n      nextTriggerAt\n      groups\n      flow {\n        name\n      }\n    }\n  }\n": types.HomeFlowsAndTriggersDocument,
    "\n  mutation UpdateLanguage($input: CurrentUserInput!) {\n    updateCurrentUser(input: $input) {\n      user {\n        id\n      }\n      errors {\n        key\n        message\n      }\n    }\n  }\n": types.UpdateLanguageDocument,
    "\n  query UnreadNotifications {\n    countNotifications(filter: { isRead: false })\n  }\n": types.UnreadNotificationsDocument,
    "\n  query RecentNotifications($opts: Opts) {\n    notifications(opts: $opts) {\n      id\n      category\n      message\n      severity\n      isRead\n      insertedAt\n    }\n  }\n": types.RecentNotificationsDocument,
    "\n  mutation MarkNotificationsRead {\n    markNotificationAsRead\n  }\n": types.MarkNotificationsReadDocument,
    "\n  query Organization {\n    organization {\n      organization {\n        id\n        name\n        isTrialOrg\n        isSuspended\n        trialExpirationDate\n        bsp {\n          shortcode\n        }\n      }\n    }\n  }\n": types.OrganizationDocument,
    "\n  query OrganizationServices {\n    organizationServices {\n      askGlificEnabled\n      glificAiEnabled\n      certificateEnabled\n      rolesAndPermission\n      ticketingEnabled\n      whatsappFormsEnabled\n      whatsappGroupEnabled\n    }\n  }\n": types.OrganizationServicesDocument,
    "\n  query WalletBalance {\n    bspbalance\n  }\n": types.WalletBalanceDocument,
    "\n  subscription WalletBalanceUpdated($organizationId: ID!) {\n    bspBalance(organizationId: $organizationId)\n  }\n": types.WalletBalanceUpdatedDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CurrentUser {\n    currentUser {\n      user {\n        id\n        name\n        accessRoles {\n          label\n        }\n        language {\n          locale\n        }\n        organization {\n          id\n          activeLanguages {\n            id\n            label\n            labelLocale\n            locale\n            localized\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').CurrentUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Contacts($filter: ContactFilter, $opts: Opts) {\n    contacts(filter: $filter, opts: $opts) {\n      id\n      name\n      maskedPhone\n      status\n      lastMessageAt\n    }\n    countContacts(filter: $filter)\n  }\n"): typeof import('./graphql').ContactsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AskGlific($input: AskGlificInput!) {\n    askGlific(input: $input) {\n      errors {\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').AskGlificDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription AskGlificResponse($organizationId: ID!) {\n    askGlificResponse(organizationId: $organizationId) {\n      answer\n      conversationId\n      messageId\n      requestId\n      errors {\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').AskGlificResponseDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AskGlificFeedback($input: AskGlificFeedbackInput!) {\n    askGlificFeedback(input: $input) {\n      success\n    }\n  }\n"): typeof import('./graphql').AskGlificFeedbackDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HomeActivity($current: DateRangeInput, $previous: DateRangeInput) {\n    newContacts: countContacts(filter: { dateRange: $current })\n    previousNewContacts: countContacts(filter: { dateRange: $previous })\n    messages: countMessages(filter: { dateRange: $current })\n    previousMessages: countMessages(filter: { dateRange: $previous })\n  }\n"): typeof import('./graphql').HomeActivityDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HomeUsage($fromDate: Date!, $toDate: Date!) {\n    dailyAppUsage(fromDate: $fromDate, toDate: $toDate) {\n      date\n      incomingMsg\n      outgoingMsg\n      totalFees\n    }\n  }\n"): typeof import('./graphql').HomeUsageDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HomeFlowsAndTriggers {\n    flows(filter: { isTemplate: false }, opts: { limit: 50, order: DESC, orderWith: \"updated_at\" }) {\n      id\n      uuid\n      name\n      lastPublishedAt\n      lastChangedAt\n      updatedAt\n    }\n    triggers(opts: { limit: 50, order: DESC, orderWith: \"updated_at\" }) {\n      id\n      name\n      isActive\n      nextTriggerAt\n      groups\n      flow {\n        name\n      }\n    }\n  }\n"): typeof import('./graphql').HomeFlowsAndTriggersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateLanguage($input: CurrentUserInput!) {\n    updateCurrentUser(input: $input) {\n      user {\n        id\n      }\n      errors {\n        key\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').UpdateLanguageDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UnreadNotifications {\n    countNotifications(filter: { isRead: false })\n  }\n"): typeof import('./graphql').UnreadNotificationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RecentNotifications($opts: Opts) {\n    notifications(opts: $opts) {\n      id\n      category\n      message\n      severity\n      isRead\n      insertedAt\n    }\n  }\n"): typeof import('./graphql').RecentNotificationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation MarkNotificationsRead {\n    markNotificationAsRead\n  }\n"): typeof import('./graphql').MarkNotificationsReadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Organization {\n    organization {\n      organization {\n        id\n        name\n        isTrialOrg\n        isSuspended\n        trialExpirationDate\n        bsp {\n          shortcode\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').OrganizationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query OrganizationServices {\n    organizationServices {\n      askGlificEnabled\n      glificAiEnabled\n      certificateEnabled\n      rolesAndPermission\n      ticketingEnabled\n      whatsappFormsEnabled\n      whatsappGroupEnabled\n    }\n  }\n"): typeof import('./graphql').OrganizationServicesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query WalletBalance {\n    bspbalance\n  }\n"): typeof import('./graphql').WalletBalanceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription WalletBalanceUpdated($organizationId: ID!) {\n    bspBalance(organizationId: $organizationId)\n  }\n"): typeof import('./graphql').WalletBalanceUpdatedDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
