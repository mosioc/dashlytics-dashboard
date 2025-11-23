# Dashlytics-dashboard


## GraphQL Setup & Code Generation

### What is GraphQL?

GraphQL is a query language that allows you to request exactly the data you need from an API. Unlike REST APIs that return fixed data structures, GraphQL enables you to specify which fields you want, reducing over-fetching and under-fetching of data.

### GraphQL Flow in This Project

1. **Define Queries & Mutations** - Write GraphQL operations in `src/graphql/queries.ts` and `src/graphql/mutations.ts`
2. **Configure GraphQL Codegen** - The `graphql.config.ts` file defines how to generate TypeScript types from your GraphQL operations
3. **Auto-generate Types** - Run `npm run codegen` to automatically generate TypeScript types from your GraphQL queries and mutations
4. **Use in Components** - Import generated types and operations in your React components for type-safe data fetching

### Installation

Make sure all dependencies are installed:

```bash
npm install
```

This installs the required GraphQL packages:

- `graphql-tag` - For writing GraphQL queries/mutations
- `@graphql-codegen/cli` - Code generation CLI
- `@graphql-codegen/typescript` - TypeScript plugin for code generation
- `@graphql-codegen/typescript-operations` - Generates types for your operations
- `@graphql-codegen/import-types-preset` - Preset for organizing generated types

### Running Code Generation

Generate TypeScript types from your GraphQL operations:

```bash
npm run codegen
```

This command:

- Reads your GraphQL queries and mutations from `src/**/*.{ts,tsx}`
- Connects to the GraphQL schema at `https://api.crm.refine.dev/graphql`
- Generates two files:
  - `src/graphql/schema.types.ts` - Complete schema types
  - `src/graphql/types.ts` - Types specific to your operations
- Automatically formats generated files with ESLint and Prettier

### GraphQL Operations

#### Queries

Fetch data from the API:

- `USERS_SELECT_QUERY` - Retrieve users with filtering, sorting, and pagination
- `TASK_STAGES_SELECT_QUERY` - Retrieve task stages with filtering, sorting, and pagination

#### Mutations

Modify data on the API:

- `UPDATE_USER_MUTATION` - Update user information (name, avatar, email, etc.)
- `CREATE_COMPANY_MUTATION` - Create a new company
- `UPDATE_COMPANY_MUTATION` - Update company details (revenue, industry, location, etc.)
- `UPDATE_TASK_STAGE_MUTATION` - Change task stage
- `CREATE_TASK_MUTATION` - Create a new task
- `UPDATE_TASK_MUTATION` - Update task details (title, status, assignments, etc.)

### Development Workflow

1. **Add new operations** - Define queries or mutations in the appropriate file
2. **Run codegen** - Execute `npm run codegen` to generate types
3. **Import in components** - Use the generated types for type safety:

   ```typescript
   import type { UpdateUserMutation } from "@/graphql/types";
   ```

4. **Execute operations** - Use with your data provider to fetch or mutate data

### Configuration

The `graphql.config.ts` file controls code generation:

- **schema** - GraphQL endpoint URL
- **plugins** - TypeScript code generation with custom scalars
- **documents** - Locations to scan for GraphQL operations
- **afterOneFileWrite hooks** - Auto-formats generated files with ESLint and Prettier
