import pool from "@/lib/db";
import { log } from "console";

export async function GET() {
  const { rows } = await pool.query("SELECT * FROM items ORDER BY id ASC");
  return Response.json(rows);
}
 
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemno, name } = body;
 
    if (!itemno || !name) {
      return Response.json(
        { error: "itemno and name are required" },
        { status: 400 }
      );
    }
 
    const { rows } = await pool.query(
      "INSERT INTO items (itemno, name) VALUES ($1, $2) RETURNING *",
      [itemno, name]
    );
 
    return Response.json(rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to insert item" }, { status: 500 });
  }
}