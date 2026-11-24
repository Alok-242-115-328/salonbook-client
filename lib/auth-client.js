import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://salonbook-ph09.netlify.app/server-api",
  fetchOptions: { credentials: "include" },
});