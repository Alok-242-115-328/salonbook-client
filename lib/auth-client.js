import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // 👇 এখানে Render সার্ভারের লিংকটা বসাও
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", 
});