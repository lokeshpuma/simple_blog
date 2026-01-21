export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URI) {
  throw new Error("Missing MONGO_URI. Create api/.env with MONGO_URI=...");
}
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET. Create api/.env with JWT_SECRET=...");
}

