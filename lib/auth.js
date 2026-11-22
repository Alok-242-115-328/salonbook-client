import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import dns from 'node:dns';

// Node.js DNS বাগ ফিক্স
dns.setServers(['8.8.8.8', '1.1.1.1']);

// 👇 Lazy Initialization: ডেটাবেস কানেকশন শুধু রানটাইমে তৈরি হবে
let client;
let db;

function getDb() {
  if (!db) {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    client = new MongoClient(process.env.MONGODB_URI, {
      autoSelectFamily: false // SSL এরর ফিক্স
    });
    db = client.db("salonbook");
  }
  return { db, client };
}

// Better Auth কনফিগারেশন
export const auth = betterAuth({
  database: mongodbAdapter(getDb().db, { client: getDb().client }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
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