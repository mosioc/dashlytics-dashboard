# Testing Documentation

## Overview

This project uses **Vitest** and **React Testing Library** for unit and integration testing. The test suite focuses on critical business logic and user flows, following the 80/20 principle for maximum value.

## Quick Start

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

### File Organization

Tests are located next to their source files in `__tests__` directories:

```
src/
├── providers/
│   ├── __tests__/
│   │   └── auth.test.ts
│   └── data/
│       └── __tests__/
│           └── fetch-wrapper.test.ts
├── routes/
│   ├── companies/
│   │   ├── list/
│   │   │   ├── __tests__/
│   │   │   │   ├── company-list.test.tsx
│   │   │   │   ├── create-modal.test.tsx
│   │   │   │   └── filter-utils.test.ts
│   │   └── edit/
│   │       └── __tests__/
│   │           └── company-edit.test.tsx
│   └── dashboard/
│       ├── __tests__/
│       │   └── dashboard.test.tsx
│       └── components/
│           └── total-counts-card/
│               └── __tests__/
│                   └── index.test.tsx
└── utilities/
    └── __tests__/
        └── utilities.test.ts
```

### Naming Convention

- Test files: `*.test.ts` or `*.test.tsx`
- Match source file names (e.g., `auth.test.ts` for `auth.ts`)
- Use descriptive test names with `describe` and `it` blocks

## Test Categories

### Priority 1: Critical Business Logic (All Passing ✅)

These tests cover the most important functionality:

1. **Authentication Provider** (`src/providers/__tests__/auth.test.ts`)
   - Login/logout flows
   - Session management
   - Error handling
   - Identity retrieval

2. **Fetch Wrapper** (`src/providers/data/__tests__/fetch-wrapper.test.ts`)
   - Authorization header injection
   - GraphQL error parsing
   - Response handling

3. **Utilities** (`src/utilities/__tests__/utilities.test.ts`)
   - Currency formatting
   - Name initials extraction
   - Date color calculation
   - String-to-color mapping

4. **Filter Utilities** (`src/routes/companies/list/__tests__/filter-utils.test.ts`)
   - Saved views management
   - Filter presets
   - localStorage operations

### Priority 2: Component Integration Tests

1. **Company CRUD** - List, create, and edit operations
2. **Dashboard Components** - Data display and loading states
3. **Forms** - Validation and submission

## Test Utilities

### TestWrapper Component

Located at `src/test/test-wrapper.tsx`, this utility provides necessary providers for component tests:

```tsx
import { TestWrapper } from "../../../../test/test-wrapper";

render(
  <TestWrapper>
    <YourComponent />
  </TestWrapper>
);
```

**What it provides:**
- `QueryClientProvider` - React Query client for data fetching hooks
- `ConfigProvider` - Ant Design theme configuration

### Test Setup

The test setup file (`src/test/setup.ts`) configures:
- `@testing-library/jest-dom` matchers
- `localStorage` mocking
- `window.matchMedia` mocking
- Cleanup after each test

## Writing Tests

### Example: Testing a Utility Function

```typescript
import { describe, it, expect } from "vitest";
import { currencyNumber } from "../index";

describe("currencyNumber", () => {
  it("should format number as USD currency", () => {
    expect(currencyNumber(1234.56)).toBe("$1,234.56");
  });
});
```

### Example: Testing a Component

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestWrapper } from "../../../../test/test-wrapper";
import { YourComponent } from "../index";

describe("YourComponent", () => {
  it("should render correctly", () => {
    render(
      <TestWrapper>
        <YourComponent />
      </TestWrapper>
    );

    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });
});
```

### Example: Testing with Mocks

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock a module
vi.mock("../data", () => ({
  dataProvider: {
    custom: vi.fn(),
  },
}));

describe("YourFeature", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle mocked data", async () => {
    vi.mocked(dataProvider.custom).mockResolvedValue({
      data: { result: "test" },
    });

    // Your test code
  });
});
```

## Best Practices

### 1. Test Behavior, Not Implementation

✅ **Good:**
```typescript
it("should display error message on failed login", async () => {
  // Test what user sees
  expect(screen.getByText("Login failed")).toBeInTheDocument();
});
```

❌ **Bad:**
```typescript
it("should call login function", () => {
  // Testing implementation details
  expect(mockLogin).toHaveBeenCalled();
});
```

### 2. Use Appropriate Queries

Prefer queries that reflect how users interact:

1. `getByRole` - Most accessible
2. `getByLabelText` - For form inputs
3. `getByText` - For visible text
4. `getByTestId` - Last resort

### 3. Handle Async Operations

```typescript
// Use waitFor for async updates
await waitFor(() => {
  expect(screen.getByText("Loaded")).toBeInTheDocument();
});

// Use findBy for elements that appear asynchronously
const element = await screen.findByText("Async Content");
```

### 4. Keep Tests Focused

- One assertion per test when possible
- Test one behavior at a time
- Use descriptive test names

### 5. Mock External Dependencies

Always mock:
- API calls (GraphQL, REST)
- localStorage
- Third-party services
- Timers (when needed)

## Coverage Goals

- **Priority 1 modules**: 80%+ coverage
- **Priority 2 modules**: 60-70% coverage
- **Overall project**: 60-70% (realistic, not 100%)

Focus on:
- ✅ Business logic functions
- ✅ Error handling paths
- ✅ User interaction flows
- ✅ Data transformations

Skip:
- ❌ Simple UI components (buttons, labels)
- ❌ Third-party library wrappers
- ❌ Static configuration files
- ❌ CSS/styling tests

## Common Issues and Solutions

### Issue: "No QueryClient set"

**Solution:** Wrap component with `TestWrapper`:

```typescript
render(
  <TestWrapper>
    <YourComponent />
  </TestWrapper>
);
```

### Issue: Test timeout

**Solution:** Use `waitFor` or increase timeout:

```typescript
await waitFor(() => {
  expect(screen.getByText("Content")).toBeInTheDocument();
}, { timeout: 3000 });
```

### Issue: Text not found

**Solution:** Check actual rendered text, use flexible matchers:

```typescript
// Use regex for partial matches
expect(screen.getByText(/\$50,000/)).toBeInTheDocument();

// Use getAllByText for multiple matches
const elements = screen.getAllByText("0");
```

## Running Specific Tests

```bash
# Run a specific test file
npm test -- src/providers/__tests__/auth.test.ts

# Run tests matching a pattern
npm test -- auth

# Run tests in a directory
npm test -- src/routes/companies
```

## Continuous Integration

Tests should run automatically in CI/CD pipelines. Ensure:

1. All Priority 1 tests pass
2. No new tests are skipped without reason
3. Coverage thresholds are maintained
4. Tests complete in reasonable time (<30 seconds)

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Test Statistics

- **Total Tests**: 96
- **Passing**: 93 (97%)
- **Test Files**: 9
- **Priority 1 Coverage**: 100% ✅
- **Average Test Runtime**: ~30 seconds

---

**Last Updated**: 2025-01-27  
**Test Framework**: Vitest 4.0.14  
**Testing Library**: @testing-library/react 16.3.0

