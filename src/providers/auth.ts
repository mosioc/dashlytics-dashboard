import type { AuthProvider } from "@refinedev/core";

// default credentials for demo/development
export const authCredentials = {
  email: "mehdimaleki@mosioc.com",
  password: "demodemo",
};

export const authProvider: AuthProvider = {
  // authenticates user and stores access token in localstorage
  login: async ({ email }) => {
    console.log(email);
  },
  // clears access token and redirects to login
  logout: async () => {},
  // handles authentication errors, triggers logout on unauthenticated status
  onError: async (error) => {
    console.log(error);
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
