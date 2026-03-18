import pool from "@/lib/db";
import { log } from "console";

export async function GET() {
  const { rows } = await pool.query("SELECT * FROM Item");
  console.log(rows);
  return Response.json(rows);
}