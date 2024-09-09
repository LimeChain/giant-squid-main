# TypeScript `@ts-ignore` Directive

In this folder, you will find many files that contain the `@ts-ignore`

When deploying a chain to the cloud with `deploy.sh` we are dynamically generating the schema.graphql file using `generateSchema.ts`, we are running several commands, one of which is `sqd codegen` that command generates files in the model folder from which most imports are used.

In our case most chains dont support all implemented pallets so when a schema is generated there are pallets which are not used. Therefore the imports throw an error, so we need to ignore them.
