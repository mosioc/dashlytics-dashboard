// authentication provider tests
import { describe, it, expect, vi, beforeEach } from "vitest";
import { authProvider } from "../auth";
import * as dataProviderModule from "../data";

// mock data provider
vi.mock("../data", () => ({
  dataProvider: {
    custom: vi.fn(),
  },
  API_URL: "https://api.crm.refine.dev/graphql",
}));

describe("authProvider", () => {
  beforeEach(() => {
    // clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should successfully login and store token", async () => {
      const mockAccessToken = "test-access-token-123";
      const mockData = {
        login: {
          accessToken: mockAccessToken,
        },
      };

      vi.mocked(dataProviderModule.dataProvider.custom).mockResolvedValue({
        data: mockData,
      } as any);

      const result = await authProvider.login({
        email: "test@example.com",
      });

      expect(result.success).toBe(true);
      expect(result.redirectTo).toBe("/");
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "access_token",
        mockAccessToken
      );
      expect(dataProviderModule.dataProvider.custom).toHaveBeenCalledWith({
        url: dataProviderModule.API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email: "test@example.com" },
          rawQuery: expect.stringContaining("mutation Login"),
        },
      });
    });

    it("should return error on failed login", async () => {
      const mockError = new Error("Invalid credentials");
      vi.mocked(dataProviderModule.dataProvider.custom).mockRejectedValue(
        mockError
      );

      const result = await authProvider.login({
        email: "wrong@example.com",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe("Invalid credentials");
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it("should handle login error without message property", async () => {
      const mockError = { statusCode: 500 };
      vi.mocked(dataProviderModule.dataProvider.custom).mockRejectedValue(
        mockError
      );

      const result = await authProvider.login({
        email: "test@example.com",
      });

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Login failed");
      expect(result.error?.name).toBe("Invalid email or password");
    });
  });

  describe("logout", () => {
    it("should clear token and redirect to login", async () => {
      // set a token first
      localStorage.setItem("access_token", "test-token");

      const result = await authProvider.logout();

      expect(result.success).toBe(true);
      expect(result.redirectTo).toBe("/login");
      expect(localStorage.removeItem).toHaveBeenCalledWith("access_token");
    });
  });

  describe("check", () => {
    it("should return authenticated when API call succeeds", async () => {
      vi.mocked(dataProviderModule.dataProvider.custom).mockResolvedValue({
        data: { me: { name: "Test User" } },
      } as any);

      const result = await authProvider.check();

      expect(result.authenticated).toBe(true);
      expect(result.redirectTo).toBe("/");
      expect(dataProviderModule.dataProvider.custom).toHaveBeenCalledWith({
        url: dataProviderModule.API_URL,
        method: "post",
        headers: {},
        meta: {
          rawQuery: expect.stringContaining("query Me"),
        },
      });
    });

    it("should return unauthenticated when API call fails", async () => {
      vi.mocked(dataProviderModule.dataProvider.custom).mockRejectedValue(
        new Error("Unauthorized")
      );

      const result = await authProvider.check();

      expect(result.authenticated).toBe(false);
      expect(result.redirectTo).toBe("/login");
    });
  });

  describe("getIdentity", () => {
    it("should fetch and return user identity with token", async () => {
      const mockToken = "test-token-123";
      const mockUser = {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        jobTitle: "Developer",
        timezone: "UTC",
        avatarUrl: "https://example.com/avatar.jpg",
      };

      localStorage.setItem("access_token", mockToken);

      vi.mocked(dataProviderModule.dataProvider.custom).mockResolvedValue({
        data: { me: mockUser },
      } as any);

      const result = await authProvider.getIdentity();

      expect(result).toEqual(mockUser);
      expect(dataProviderModule.dataProvider.custom).toHaveBeenCalledWith({
        url: dataProviderModule.API_URL,
        method: "post",
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
        meta: {
          rawQuery: expect.stringContaining("query Me"),
        },
      });
    });

    it("should return undefined when API call fails", async () => {
      localStorage.setItem("access_token", "test-token");

      vi.mocked(dataProviderModule.dataProvider.custom).mockRejectedValue(
        new Error("Unauthorized")
      );

      const result = await authProvider.getIdentity();

      expect(result).toBeUndefined();
    });

    it("should work without token in localStorage", async () => {
      const mockUser = {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
      };

      vi.mocked(dataProviderModule.dataProvider.custom).mockResolvedValue({
        data: { me: mockUser },
      } as any);

      const result = await authProvider.getIdentity();

      expect(result).toEqual(mockUser);
      expect(dataProviderModule.dataProvider.custom).toHaveBeenCalledWith({
        url: dataProviderModule.API_URL,
        method: "post",
        headers: {},
        meta: {
          rawQuery: expect.stringContaining("query Me"),
        },
      });
    });
  });

  describe("onError", () => {
    it("should trigger logout on UNAUTHENTICATED status code", async () => {
      const error = {
        statusCode: "UNAUTHENTICATED",
        message: "Token expired",
      };

      const result = await authProvider.onError(error as any);

      expect(result.logout).toBe(true);
    });

    it("should return error for other status codes", async () => {
      const error = {
        statusCode: "INTERNAL_SERVER_ERROR",
        message: "Server error",
      };

      const result = await authProvider.onError(error as any);

      expect(result.error).toEqual(error);
      expect(result.logout).toBeUndefined();
    });
  });
});

