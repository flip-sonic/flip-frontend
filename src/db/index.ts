import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();


const connectionString = process.env.NEXTDATABASE_URL!;
        

const client = postgres(connectionString);
export const db = drizzle(client);