import pool from "@/lib/db";
import { log } from "console";

export async function GET() {
  const { rows } = await pool.query("SELECT * FROM items");
  console.log(rows);
  return Response.json(rows);
}

