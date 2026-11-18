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
    "\n  mutation UpdateLanguage($input: CurrentUserInput!) {\n    updateCurrentUser(input: $input) {\n      user {\n        id\n      }\n      errors {\n        key\n        message\n      }\n    }\n  }\n": typeof types.UpdateLanguageDocument,
};
const documents: Documents = {
    "\n  query CurrentUser {\n    currentUser {\n      user {\n        id\n        name\n        accessRoles {\n          label\n        }\n        language {\n          locale\n        }\n        organization {\n          id\n          activeLanguages {\n            id\n            label\n            labelLocale\n            locale\n            localized\n          }\n        }\n      }\n    }\n  }\n": types.CurrentUserDocument,
    "\n  query Contacts($filter: ContactFilter, $opts: Opts) {\n    contacts(filter: $filter, opts: $opts) {\n      id\n      name\n      maskedPhone\n      status\n      lastMessageAt\n    }\n    countContacts(filter: $filter)\n  }\n": types.ContactsDocument,
    "\n  mutation UpdateLanguage($input: CurrentUserInput!) {\n    updateCurrentUser(input: $input) {\n      user {\n        id\n      }\n      errors {\n        key\n        message\n      }\n    }\n  }\n": types.UpdateLanguageDocument,
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
export function graphql(source: "\n  mutation UpdateLanguage($input: CurrentUserInput!) {\n    updateCurrentUser(input: $input) {\n      user {\n        id\n      }\n      errors {\n        key\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').UpdateLanguageDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
