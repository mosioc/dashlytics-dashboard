import type { AuthProvider } from "@refinedev/core";
import { API_URL, dataProvider } from "./data";

// default credentials for demo/development
export const authCredentials = {
  email: "mehdimaleki@mosioc.com",
  password: "demodemo",
};

export const authProvider: AuthProvider = {
  // authenticates user and stores access token in localstorage
  login: async ({ email, password }) => {
    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email, password }, 
          rawQuery: `
                mutation Login($email: String!, $password: String!) {
                    login(loginInput: {
                      email: $email
                      password: $password
                    }) {
                      accessToken,
                    }
                  }
                `,
        },
      });

      localStorage.setItem("access_token", data.login.accessToken);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (e) {
      const error = e as Error;

      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Login failed",
          name: "name" in error ? error.name : "Invalid email or password",
        },
      };
    }
  },
  // clears access token and redirects to login
  logout: async () => {
    localStorage.removeItem("access_token");

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  // handles authentication errors, triggers logout on unauthenticated status
  onError: async (error) => {
    if (error.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true,
      };
    }

    return { error };
  },
  // verifies authentication by fetching current user data
  check: async () => {
    console.log("check");
  },
  // fetches current user's profile data
  getIdentity: async () => {
    console.log("getIdentity");
  },
};
