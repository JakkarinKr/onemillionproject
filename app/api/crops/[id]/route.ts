import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cropResult = await pool.query(
      `SELECT c.*, 
              cqf.sunlight_requirement, cqf.water_need, cqf.soil_ph_min, 
              cqf.soil_ph_max, cqf.spacing, cqf.is_organic_certified,
              cat.name as category_name
       FROM crops c
       LEFT JOIN crop_quick_facts cqf ON c.id = cqf.crop_id
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE c.id = $1`,
      [id]
    );

    if (cropResult.rows.length === 0) {
      return NextResponse.json({ error: "Crop not found" }, { status: 404 });
    }

    const stepsResult = await pool.query(
      `SELECT * FROM planting_steps WHERE crop_id = $1 ORDER BY step_number ASC`,
      [id]
    );

    const crop = {
      ...cropResult.rows[0],
      planting_steps: stepsResult.rows,
    };

    return NextResponse.json({ crop });
  } catch (error) {
    console.error("Error fetching crop:", error);
    return NextResponse.json(
      { error: "Failed to fetch crop" },
      { status: 500 }
    );
  }
}