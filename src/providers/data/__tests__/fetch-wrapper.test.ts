// fetch wrapper tests
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchWrapper } from "../fetch-wrapper";

// mock global fetch
global.fetch = vi.fn();

describe("fetchWrapper", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should add authorization header from localStorage token", async () => {
    const mockToken = "test-token-123";
    localStorage.setItem("access_token", mockToken);

    const mockResponse = {
      ok: true,
      clone: vi.fn().mockReturnValue({
        json: vi.fn().mockResolvedValue({ data: {} }),
      }),
      json: vi.fn().mockResolvedValue({ data: {} }),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    await fetchWrapper("https://api.example.com/graphql", {
      method: "POST",
      headers: {},
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/graphql",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`,
          "Content-Type": "application/json",
          "Apollo-Require-Preflight": "true",
        }),
      })
    );
  });

  it("should use existing authorization header if provided", async () => {
    const existingToken = "existing-token-456";
    localStorage.setItem("access_token", "localStorage-token");

    const mockResponse = {
      ok: true,
      clone: vi.fn().mockReturnValue({
        json: vi.fn().mockResolvedValue({ data: {} }),
      }),
      json: vi.fn().mockResolvedValue({ data: {} }),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    await fetchWrapper("https://api.example.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${existingToken}`,
      },
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/graphql",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${existingToken}`,
        }),
      })
    );
  });

  it("should add required headers even without token", async () => {
    const mockResponse = {
      ok: true,
      clone: vi.fn().mockReturnValue({
        json: vi.fn().mockResolvedValue({ data: {} }),
      }),
      json: vi.fn().mockResolvedValue({ data: {} }),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    await fetchWrapper("https://api.example.com/graphql", {
      method: "POST",
      headers: {},
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/graphql",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer null",
          "Content-Type": "application/json",
          "Apollo-Require-Preflight": "true",
        }),
      })
    );
  });

  it("should throw error on graphql errors in response", async () => {
    const mockErrorBody = {
      errors: [
        {
          message: "Unauthorized",
          extensions: {
            code: "UNAUTHENTICATED",
          },
        },
      ],
    };

    const mockResponse = {
      ok: true,
      clone: vi.fn().mockReturnValue({
        json: vi.fn().mockResolvedValue(mockErrorBody),
      }),
      json: vi.fn().mockResolvedValue({ data: {} }),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    await expect(
      fetchWrapper("https://api.example.com/graphql", {
        method: "POST",
        headers: {},
      })
    ).rejects.toEqual({
      message: "Unauthorized",
      statusCode: "UNAUTHENTICATED",
    });
  });

  it("should handle graphql errors without extensions code", async () => {
    const mockErrorBody = {
      errors: [
        {
          message: "Validation error",
        },
      ],
    };

    const mockResponse = {
      ok: true,
      clone: vi.fn().mockReturnValue({
        json: vi.fn().mockResolvedValue(mockErrorBody),
      }),
      json: vi.fn().mockResolvedValue({ data: {} }),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    await expect(
      fetchWrapper("https://api.example.com/graphql", {
        method: "POST",
        headers: {},
      })
    ).rejects.toEqual({
      message: "Validation error",
      statusCode: 500,
    });
  });

  it("should handle multiple graphql errors", async () => {
    const mockErrorBody = {
      errors: [
        { message: "Error 1" },
        { message: "Error 2" },
      ],
    };

    const mockResponse = {
      ok: true,
      clone: vi.fn().mockReturnValue({
        json: vi.fn().mockResolvedValue(mockErrorBody),
      }),
      json: vi.fn().mockResolvedValue({ data: {} }),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    await expect(
      fetchWrapper("https://api.example.com/graphql", {
        method: "POST",
        headers: {},
      })
    ).rejects.toEqual({
      message: "Error 1Error 2",
      statusCode: 500,
    });
  });

  it("should handle empty body", async () => {
    const mockResponse = {
      ok: true,
      clone: vi.fn().mockReturnValue({
        json: vi.fn().mockResolvedValue(null),
      }),
      json: vi.fn().mockResolvedValue({ data: {} }),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    await expect(
      fetchWrapper("https://api.example.com/graphql", {
        method: "POST",
        headers: {},
      })
    ).rejects.toEqual({
      message: "Unknown error",
      statusCode: "INTERNAL_SERVER_ERROR",
    });
  });

  it("should return response on success", async () => {
    const mockResponse = {
      ok: true,
      clone: vi.fn().mockReturnValue({
        json: vi.fn().mockResolvedValue({ data: { users: [] } }),
      }),
      json: vi.fn().mockResolvedValue({ data: { users: [] } }),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    const result = await fetchWrapper("https://api.example.com/graphql", {
      method: "POST",
      headers: {},
    });

    expect(result).toBe(mockResponse);
  });

  it("should preserve existing headers", async () => {
    localStorage.setItem("access_token", "test-token");

    const mockResponse = {
      ok: true,
      clone: vi.fn().mockReturnValue({
        json: vi.fn().mockResolvedValue({ data: {} }),
      }),
      json: vi.fn().mockResolvedValue({ data: {} }),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    await fetchWrapper("https://api.example.com/graphql", {
      method: "POST",
      headers: {
        "X-Custom-Header": "custom-value",
      },
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/graphql",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Custom-Header": "custom-value",
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
          "Apollo-Require-Preflight": "true",
        }),
      })
    );
  });
});

