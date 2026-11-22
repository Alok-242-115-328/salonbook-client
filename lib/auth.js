import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import dns from 'node:dns';

// Node.js DNS বাগ ফিক্স
dns.setServers(['8.8.8.8', '1.1.1.1']);

const client = new MongoClient(process.env.MONGODB_URI, {
  autoSelectFamily: false // SSL এরর ফিক্স
});
const db = client.db("salonbook");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  // গুগল প্রোভাইডার এখানে যোগ করা হলো
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  // নতুন ফিল্ডগুলো এখানে যুক্ত করা হলো
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false, 
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      }
    }
  }
});