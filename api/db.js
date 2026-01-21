import { MongoClient } from "mongodb";
import { MONGO_URI } from "./config.js";

let client;
let database;

export async function connectDb() {
  if (database) return database;

  client = new MongoClient(MONGO_URI);
  await client.connect();
  database = client.db(); // db name comes from URI path (/blog)
  return database;
}

export function getDb() {
  if (!database) {
    throw new Error("MongoDB not connected yet. Call connectDb() first.");
  }
  return database;
}

export async function closeDb() {
  if (client) await client.close();
  client = undefined;
  database = undefined;
}