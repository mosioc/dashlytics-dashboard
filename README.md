# Dashlytics-dashboard

## Ant Design Plots

`@ant-design/plots` is a collection of ready-made React chart components built on top of G2Plot. It offers declarative, production-ready chart components (Column, Line, Pie, Area, Gauge, etc.) that integrate nicely with Ant Design and React projects.

Installation:

```powershell
npm install @ant-design/plots
```

Basic usage example:

```tsx
import React from "react";
import { Column } from "@ant-design/plots";

const DemoColumn: React.FC = () => {
  const data = [
    { month: "Jan", value: 38 },
    { month: "Feb", value: 52 },
    { month: "Mar", value: 61 },
  ];
  const config = {
    data,
    xField: "month",
    yField: "value",
  };
  return <Column {...config} />;
};

export default DemoColumn;
```

Notes & best practices:

- Components are React-first and work well alongside Ant Design UI components. No extra runtime is required beyond installing the package.
- Ensure Ant Design styles are loaded globally if you use Ant components alongside plots (for example: `import "antd/dist/reset.css"`).
- Types are provided; you can import config types from `@ant-design/plots` when building complex charts.
- For advanced customization, animations, and examples, see the official docs: [charts.ant.design](https://charts.ant.design/)

## React Router

This project uses `react-router-dom` for client-side routing. `react-router-dom` (v6+) provides a small, declarative API for defining routes using `BrowserRouter`, `Routes`, and `Route` components.

Installation:

```powershell
npm install react-router-dom
```

Basic setup example:

```tsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./src/components/Home";
import Dashboard from "./src/components/Dashboard";

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
```

Notes & best practices:

- Use `Link` instead of anchor tags to avoid full page reloads.
- Use `useNavigate` for programmatic navigation and `useParams` to read route parameters.
- Prefer route-based code-splitting (lazy + Suspense) for large pages.
- When using TypeScript, type route params and component props for safer navigation.
- For advanced usage (nested routing, loaders, data APIs), refer to the official docs: [React Router Docs](https://reactrouter.com/)

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
