import { describe, it, expect, beforeEach, vi } from "vitest";
import { authProvider, authCredentials } from "../auth";
import { dataProvider } from "../data";

// Mock the data provider
vi.mock("../data", () => ({
  dataProvider: {
    custom: vi.fn(),
  },
  API_URL: "https://api.crm.refine.dev/graphql",
}));

describe("authProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("login", () => {
    it("should successfully login with valid credentials", async () => {
      const mockAccessToken = "mock-access-token-123";
      const mockEmail = "test@example.com";
      const mockPassword = "password123";

      vi.mocked(dataProvider.custom).mockResolvedValueOnce({
        data: {
          login: {
            accessToken: mockAccessToken,
          },
        },
      });

      const result = await authProvider.login({
        email: mockEmail,
        password: mockPassword,
      });

      expect(result).toEqual({
        success: true,
        redirectTo: "/",
      });
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "access_token",
        mockAccessToken
      );
      expect(dataProvider.custom).toHaveBeenCalledWith({
        url: "https://api.crm.refine.dev/graphql",
        method: "post",
        headers: {},
        meta: {
          variables: { email: mockEmail, password: mockPassword },
          rawQuery: expect.stringContaining("mutation Login"),
        },
      });
    });

    it("should fail login with invalid credentials", async () => {
      const mockError = new Error("Invalid credentials");
      Object.assign(mockError, { message: "Invalid credentials" });

      vi.mocked(dataProvider.custom).mockRejectedValueOnce(mockError);

      const result = await authProvider.login({
        email: "wrong@example.com",
        password: "wrongpassword",
      });

      expect(result).toEqual({
        success: false,
        error: {
          message: "Invalid credentials",
          name: "Error",
        },
      });
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it("should handle network errors during login", async () => {
      const networkError = new Error("Network error");

      vi.mocked(dataProvider.custom).mockRejectedValueOnce(networkError);

      const result = await authProvider.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it("should handle errors without message property", async () => {
      vi.mocked(dataProvider.custom).mockRejectedValueOnce({});

      const result = await authProvider.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        success: false,
        error: {
          message: "Login failed",
          name: "Invalid email or password",
        },
      });
    });

    it("should work with default credentials", async () => {
      const mockAccessToken = "default-access-token";

      vi.mocked(dataProvider.custom).mockResolvedValueOnce({
        data: {
          login: {
            accessToken: mockAccessToken,
          },
        },
      });

      const result = await authProvider.login({
        email: authCredentials.email,
        password: authCredentials.password,
      });

      expect(result.success).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "access_token",
        mockAccessToken
      );
    });
  });

  describe("logout", () => {
    it("should clear access token and redirect to login", async () => {
      localStorage.setItem("access_token", "some-token");

      const result = await authProvider.logout({});

      expect(localStorage.removeItem).toHaveBeenCalledWith("access_token");
      expect(result).toEqual({
        success: true,
        redirectTo: "/login",
      });
    });

    it("should handle logout even when no token exists", async () => {
      const result = await authProvider.logout({});

      expect(result).toEqual({
        success: true,
        redirectTo: "/login",
      });
    });
  });

  describe("onError", () => {
    it("should trigger logout on UNAUTHENTICATED error", async () => {
      const error = { statusCode: "UNAUTHENTICATED" };

      const result = await authProvider.onError(error);

      expect(result).toEqual({ logout: true });
    });

    it("should return error for other error types", async () => {
      const error = { statusCode: "FORBIDDEN", message: "Access denied" };

      const result = await authProvider.onError(error);

      expect(result).toEqual({ error });
    });

    it("should handle errors without statusCode", async () => {
      const error = { message: "Unknown error" };

      const result = await authProvider.onError(error);

      expect(result).toEqual({ error });
    });
  });

  describe("check", () => {
    it("should return authenticated when user query succeeds", async () => {
      vi.mocked(dataProvider.custom).mockResolvedValueOnce({
        data: {
          me: {
            name: "John Doe",
          },
        },
      });

      const result = await authProvider.check();

      expect(result).toEqual({
        authenticated: true,
        redirectTo: "/",
      });
      expect(dataProvider.custom).toHaveBeenCalledWith({
        url: "https://api.crm.refine.dev/graphql",
        method: "post",
        headers: {},
        meta: {
          rawQuery: expect.stringContaining("query Me"),
        },
      });
    });

    it("should return unauthenticated when user query fails", async () => {
      vi.mocked(dataProvider.custom).mockRejectedValueOnce(
        new Error("Unauthorized")
      );

      const result = await authProvider.check();

      expect(result).toEqual({
        authenticated: false,
        redirectTo: "/login",
      });
    });

    it("should handle network failures during check", async () => {
      vi.mocked(dataProvider.custom).mockRejectedValueOnce(
        new Error("Network error")
      );

      const result = await authProvider.check();

      expect(result).toEqual({
        authenticated: false,
        redirectTo: "/login",
      });
    });
  });

  describe("getIdentity", () => {
    it("should return user identity with valid token", async () => {
      const mockToken = "valid-token";
      const mockUser = {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        jobTitle: "Developer",
        timezone: "America/New_York",
        avatarUrl: "https://example.com/avatar.jpg",
      };

      localStorage.getItem = vi.fn().mockReturnValue(mockToken);
      vi.mocked(dataProvider.custom).mockResolvedValueOnce({
        data: {
          me: mockUser,
        },
      });

      const result = await authProvider.getIdentity();

      expect(result).toEqual(mockUser);
      expect(localStorage.getItem).toHaveBeenCalledWith("access_token");
      expect(dataProvider.custom).toHaveBeenCalledWith({
        url: "https://api.crm.refine.dev/graphql",
        method: "post",
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
        meta: {
          rawQuery: expect.stringContaining("query Me"),
        },
      });
    });

    it("should fetch identity without Authorization header when no token", async () => {
      const mockUser = {
        id: "1",
        name: "Guest User",
        email: "guest@example.com",
      };

      localStorage.getItem = vi.fn().mockReturnValue(null);
      vi.mocked(dataProvider.custom).mockResolvedValueOnce({
        data: {
          me: mockUser,
        },
      });

      const result = await authProvider.getIdentity();

      expect(result).toEqual(mockUser);
      expect(dataProvider.custom).toHaveBeenCalledWith({
        url: "https://api.crm.refine.dev/graphql",
        method: "post",
        headers: {},
        meta: {
          rawQuery: expect.stringContaining("query Me"),
        },
      });
    });

    it("should return undefined when fetching identity fails", async () => {
      localStorage.getItem = vi.fn().mockReturnValue("invalid-token");
      vi.mocked(dataProvider.custom).mockRejectedValueOnce(
        new Error("Unauthorized")
      );

      const result = await authProvider.getIdentity();

      expect(result).toBeUndefined();
    });

    it("should handle malformed user data", async () => {
      localStorage.getItem = vi.fn().mockReturnValue("token");
      vi.mocked(dataProvider.custom).mockResolvedValueOnce({
        data: {},
      });

      const result = await authProvider.getIdentity();

      expect(result).toBeUndefined();
    });

    it("should include all user fields in the query", async () => {
      localStorage.getItem = vi.fn().mockReturnValue("token");
      vi.mocked(dataProvider.custom).mockResolvedValueOnce({
        data: {
          me: {
            id: "1",
            name: "Test User",
            email: "test@test.com",
            phone: "123",
            jobTitle: "Tester",
            timezone: "UTC",
            avatarUrl: "url",
          },
        },
      });

      await authProvider.getIdentity();

      const callArgs = vi.mocked(dataProvider.custom).mock.calls[0][0];
      const rawQuery = callArgs.meta.rawQuery;
      
      expect(rawQuery).toContain("id");
      expect(rawQuery).toContain("name");
      expect(rawQuery).toContain("email");
      expect(rawQuery).toContain("phone");
      expect(rawQuery).toContain("jobTitle");
      expect(rawQuery).toContain("timezone");
      expect(rawQuery).toContain("avatarUrl");
    });
  });

  describe("authCredentials", () => {
    it("should export default credentials for demo", () => {
      expect(authCredentials).toEqual({
        email: "mehdimaleki@mosioc.com",
        password: "demodemo",
      });
    });

    it("should have valid email format", () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(authCredentials.email).toMatch(emailRegex);
    });

    it("should have non-empty password", () => {
      expect(authCredentials.password).toBeTruthy();
      expect(authCredentials.password.length).toBeGreaterThan(0);
    });
  });
});