import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://salonbook-server-vz28.onrender.com",
  fetchOptions: { credentials: "include" },
});