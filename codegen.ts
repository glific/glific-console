import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "schema/glific.graphql",
  documents: ["src/**/*.{ts,tsx}", "!src/graphql/generated/**"],
  ignoreNoDocuments: true,
  generates: {
    "src/graphql/generated/": {
      preset: "client",
      presetConfig: { fragmentMasking: false },
      config: {
        // Plain strings, so requests need no graphql runtime in the bundle.
        documentMode: "string",
        enumsAsTypes: true,
        useTypeImports: true,
        scalars: { DateTime: "string", Date: "string", Time: "string", Json: "unknown", Gid: "string" },
      },
    },
  },
};

export default config;
