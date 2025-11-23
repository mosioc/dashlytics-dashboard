# Test Suite

This directory contains the test setup and utilities for the Dashlytics Dashboard application.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

- `setup.ts` - Global test setup and configuration
- `../providers/__tests__/` - Tests for authentication and data providers
- `../graphql/__tests__/` - Tests for GraphQL queries, mutations, and types

## Writing Tests

Tests are written using Vitest and Testing Library. Follow these conventions:

1. **File naming**: Use `*.test.ts` or `*.test.tsx` for test files
2. **Describe blocks**: Group related tests using `describe()`
3. **Test naming**: Use clear, descriptive test names that explain what is being tested
4. **Mocking**: Use `vi.mock()` for module mocking and `vi.fn()` for function mocking
5. **Assertions**: Use `expect()` from Vitest for all assertions

## Coverage Goals

Aim for:
- 80%+ statement coverage
- 80%+ branch coverage
- 80%+ function coverage
- 80%+ line coverage

## Testing Guidelines

### Unit Tests
- Test pure functions and business logic in isolation
- Mock external dependencies
- Focus on edge cases and error handling

### Integration Tests
- Test interactions between components
- Test API integrations with mocked responses
- Verify data flow through the application

### Best Practices
1. Keep tests simple and focused
2. Use descriptive test names
3. Follow the Arrange-Act-Assert pattern
4. Mock external dependencies
5. Test both happy paths and error cases
6. Avoid testing implementation details