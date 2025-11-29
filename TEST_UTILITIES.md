# Test Utilities Reference

This document describes the test utilities and helpers available in the test suite.

## TestWrapper Component

**Location**: `src/test/test-wrapper.tsx`

A React component that provides all necessary providers for testing React components.

### Usage

```tsx
import { TestWrapper } from "../../../../test/test-wrapper";
import { render, screen } from "@testing-library/react";
import { YourComponent } from "../index";

it("should render component", () => {
  render(
    <TestWrapper>
      <YourComponent />
    </TestWrapper>
  );

  expect(screen.getByText("Content")).toBeInTheDocument();
});
```

### What It Provides

1. **QueryClientProvider** (React Query)
   - Provides `QueryClient` instance
   - Configured with `retry: false` and `gcTime: 0` for faster tests
   - Required for components using Refine hooks

2. **ConfigProvider** (Ant Design)
   - Provides Ant Design theme context
   - Required for Ant Design components to render properly

### When to Use

Use `TestWrapper` for any component test that:
- Uses Refine hooks (`useTable`, `useForm`, `useSelect`, etc.)
- Renders Ant Design components
- Needs React Query context
- Makes API calls through Refine

### Example: Component with Refine Hooks

```tsx
import { TestWrapper } from "../../../../test/test-wrapper";
import { CompanyListPage } from "../index";

it("should render company list", () => {
  render(
    <TestWrapper>
      <CompanyListPage />
    </TestWrapper>
  );
});
```

## Test Setup File

**Location**: `src/test/setup.ts`

Automatically loaded by Vitest before all tests. Configures global test environment.

### What It Sets Up

1. **@testing-library/jest-dom**
   - Adds custom matchers like `.toBeInTheDocument()`
   - Provides better error messages

2. **localStorage Mock**
   - Mocked `getItem`, `setItem`, `removeItem`, `clear`
   - Automatically cleared between tests

3. **window.matchMedia Mock**
   - Required for Ant Design components
   - Mocks media query functionality

4. **Automatic Cleanup**
   - Cleans up DOM after each test
   - Prevents test interference

### No Manual Setup Required

The setup file is automatically loaded via `vite.config.ts`:

```typescript
export default defineConfig({
  test: {
    setupFiles: "./src/test/setup.ts",
  },
});
```

## Mocking Patterns

### Mocking Refine Hooks

```typescript
import * as useTableModule from "@refinedev/antd";

vi.mock("@refinedev/antd", async () => {
  const actual = await vi.importActual("@refinedev/antd");
  return {
    ...actual,
    useTable: vi.fn(),
  };
});

// In your test
vi.mocked(useTableModule.useTable).mockReturnValue({
  tableProps: {
    dataSource: [...],
    loading: false,
  },
} as any);
```

### Mocking localStorage

```typescript
// localStorage is automatically mocked in setup.ts
// Just use it directly:

localStorage.setItem("key", "value");
expect(localStorage.getItem("key")).toBe("value");

// Clear between tests (automatic, but can do manually)
localStorage.clear();
```

### Mocking GraphQL/API Calls

```typescript
import * as dataProviderModule from "../data";

vi.mock("../data", () => ({
  dataProvider: {
    custom: vi.fn(),
  },
}));

// Mock successful response
vi.mocked(dataProviderModule.dataProvider.custom).mockResolvedValue({
  data: { result: "success" },
});

// Mock error response
vi.mocked(dataProviderModule.dataProvider.custom).mockRejectedValue(
  new Error("API Error")
);
```

### Mocking Components

```typescript
vi.mock("../../../components", () => ({
  CustomAvatar: ({ name }: { name: string }) => (
    <div data-testid="avatar">{name}</div>
  ),
  Text: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));
```

## Async Testing Helpers

### waitFor

Use for waiting on async updates:

```typescript
import { waitFor } from "@testing-library/react";

await waitFor(() => {
  expect(screen.getByText("Loaded")).toBeInTheDocument();
}, { timeout: 3000 });
```

### findBy Queries

Use for elements that appear asynchronously:

```typescript
// Automatically waits and retries
const element = await screen.findByText("Async Content");
expect(element).toBeInTheDocument();
```

### userEvent

Use for simulating user interactions:

```typescript
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();
await user.click(button);
await user.type(input, "text");
```

## Common Test Patterns

### Testing Form Submission

```typescript
it("should submit form with valid data", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(
    <TestWrapper>
      <Form onSubmit={onSubmit} />
    </TestWrapper>
  );

  await user.type(screen.getByLabelText("Name"), "Test");
  await user.click(screen.getByRole("button", { name: /submit/i }));

  expect(onSubmit).toHaveBeenCalledWith({ name: "Test" });
});
```

### Testing Error States

```typescript
it("should display error message", async () => {
  vi.mocked(apiCall).mockRejectedValue(new Error("Failed"));

  render(
    <TestWrapper>
      <Component />
    </TestWrapper>
  );

  await waitFor(() => {
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });
});
```

### Testing Loading States

```typescript
it("should show loading spinner", () => {
  vi.mocked(useQuery).mockReturnValue({
    data: undefined,
    isLoading: true,
  });

  render(
    <TestWrapper>
      <Component />
    </TestWrapper>
  );

  expect(screen.getByRole("progressbar")).toBeInTheDocument();
});
```

## Query Priority Guide

Use queries in this order of preference:

1. **getByRole** - Most accessible, reflects user interaction
   ```typescript
   screen.getByRole("button", { name: /submit/i });
   screen.getByRole("textbox", { name: /email/i });
   ```

2. **getByLabelText** - For form inputs
   ```typescript
   screen.getByLabelText("Email Address");
   ```

3. **getByText** - For visible text content
   ```typescript
   screen.getByText("Welcome");
   screen.getByText(/welcome/i); // Case insensitive
   ```

4. **getByTestId** - Last resort, use sparingly
   ```typescript
   screen.getByTestId("custom-element");
   ```

## Debugging Tests

### Print Component HTML

```typescript
import { screen } from "@testing-library/react";

render(<Component />);
screen.debug(); // Prints entire DOM
screen.debug(screen.getByRole("button")); // Prints specific element
```

### Query All Matching Elements

```typescript
// Use getAllBy* when multiple elements match
const buttons = screen.getAllByRole("button");
expect(buttons).toHaveLength(3);

// Use queryBy* when element might not exist
const element = screen.queryByText("Optional");
if (element) {
  expect(element).toBeInTheDocument();
}
```

### Check What Queries Are Available

```typescript
// See all available queries
import { queries } from "@testing-library/react";
console.log(Object.keys(queries));
```

## Best Practices

1. **Always use TestWrapper for components** - Prevents provider errors
2. **Clear mocks between tests** - Use `beforeEach` with `vi.clearAllMocks()`
3. **Use descriptive test names** - "should display error on failed login" not "test login"
4. **Test user-visible behavior** - Not implementation details
5. **Keep tests fast** - Mock expensive operations
6. **One assertion per test** - When possible, for clarity
7. **Use async/await properly** - Don't forget `await` on async operations

## Troubleshooting

### "No QueryClient set"

**Solution**: Wrap component with `TestWrapper`

### "Unable to find element"

**Solution**: 
- Check if element renders asynchronously (use `findBy`)
- Verify text matches exactly (including whitespace)
- Use `screen.debug()` to see actual DOM

### Test timeout

**Solution**:
- Increase timeout: `waitFor(..., { timeout: 5000 })`
- Check for infinite loops in component
- Verify mocks are set up correctly

### "Cannot read property of undefined"

**Solution**:
- Ensure mocks return expected structure
- Check that providers are set up correctly
- Verify component receives required props

---

**Last Updated**: 2025-01-27

