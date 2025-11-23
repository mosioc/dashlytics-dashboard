/*
 * graphql client setup for refine crm with authentication and real-time capabilities
 * configures http client with custom fetch wrapper for bearer token auth and error handling,
 * websocket client for live subscriptions, and refine data/live providers for crud and real-time operations
 */

import graphqlDataProvider, {
  GraphQLClient,
  liveProvider as graphqlLiveProvider,
} from "@refinedev/nestjs-query";
import { createClient } from "graphql-ws";
import { fetchWrapper } from "./fetch-wrapper";

// api endpoints
export const API_BASE_URL = "https://api.crm.refine.dev";
export const API_URL = `${API_BASE_URL}/graphql`;
export const WS_URL = "wss://api.crm.refine.dev/graphql";

// graphql client with custom fetch wrapper for auth and error handling
export const client = new GraphQLClient(API_URL, {
  fetch: (url: string, options: RequestInit) => {
    try {
      return fetchWrapper(url, options);
    } catch (error) {
      return Promise.reject(error as Error);
    }
  },
});

// websocket client for real-time subscriptions with bearer token auth
export const wsClient =
  typeof window !== "undefined"
    ? createClient({
        url: WS_URL,
        connectionParams: () => {
          const accessToken = localStorage.getItem("access_token");

          return {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      })
    : undefined;

// refine data provider for crud operations
export const dataProvider = graphqlDataProvider(client);

// refine live provider for real-time updates via websockets
export const liveProvider = wsClient
  ? graphqlLiveProvider(wsClient)
  : undefined;
