import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  const client = await pool.connect();
  try {
    const body = await req.json();
    const {
      categoryId,
      cropName,
      botanicalName,
      variety,
      heroImageUrl,
      status = "draft",
      sunlightRequirement,
      waterNeed,
      soilPhMin,
      soilPhMax,
      spacing,
      isOrganicCertified,
      plantingSteps = [],
    } = body;

    await client.query("BEGIN");

    // Insert crop
    const cropResult = await client.query(
      `INSERT INTO crops 
        (id, category_id, crop_name, botanical_name, variety, hero_image_url, status, created_at, updated_at)
       VALUES 
        (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id`,
      [categoryId, cropName, botanicalName, variety, heroImageUrl, status]
    );

    const cropId = cropResult.rows[0].id;

    // Insert quick facts
    await client.query(
      `INSERT INTO crop_quick_facts 
        (id, crop_id, sunlight_requirement, water_need, soil_ph_min, soil_ph_max, spacing, is_organic_certified)
       VALUES 
        (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)`,
      [cropId, sunlightRequirement, waterNeed, soilPhMin, soilPhMax, spacing, isOrganicCertified]
    );

    // Insert planting steps
    for (let i = 0; i < plantingSteps.length; i++) {
      const step = plantingSteps[i];
      await client.query(
        `INSERT INTO planting_steps 
          (id, crop_id, step_number, title, description, created_at)
         VALUES 
          (gen_random_uuid(), $1, $2, $3, $4, NOW())`,
        [cropId, i + 1, step.title, step.description]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ success: true, cropId }, { status: 201 });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating crop:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create crop" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT c.*, cqf.sunlight_requirement, cqf.water_need, cqf.soil_ph_min, cqf.soil_ph_max,
              cqf.spacing, cqf.is_organic_certified, cat.name as category_name
       FROM crops c
       LEFT JOIN crop_quick_facts cqf ON c.id = cqf.crop_id
       LEFT JOIN categories cat ON c.category_id = cat.id
       ORDER BY c.created_at DESC`
    );
    return NextResponse.json({ crops: result.rows });
  } catch (error) {
    console.error("Error fetching crops:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch crops" },
      { status: 500 }
    );
  }
}
