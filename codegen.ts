import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "schema/glific.graphql",
  documents: ["src/**/*.{ts,tsx}", "!src/graphql/generated/**"],
  ignoreNoDocuments: true,
  // The graphql() helper in src/graphql/document.ts marks the operations to type.
  pluckConfig: { modules: [{ name: "@/graphql/document", identifier: "graphql" }] },
  generates: {
    // Types only: operations stay inline where they are used, so nothing maps every query into one bundle.
    "src/graphql/generated/graphql.ts": {
      plugins: ["typescript-operations"],
      config: {
        onlyOperationTypes: true,
        enumsAsTypes: true,
        useTypeImports: true,
        scalars: { DateTime: "string", Date: "string", Time: "string", Json: "unknown", Gid: "string" },
      },
    },
  },
};

export default config;
