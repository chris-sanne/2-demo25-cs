import pg from "pg";
import HTTP_CODES from "../utils/httpCodes.mjs";

const { Client } = pg;

const config = {
    connectionString: process.env.DB_CREDENTIALS,
    ssl: process.env.DB_SSL === "true" ? process.env.DB_SSL : { "rejectUnauthorized": false }
};

const client = new Client(config);

const skillTree = {
  name: "Swiftcast",
  description: "Reduces spell cast time and recast time by 20% for 15s.",
  unlocked: true,
  subskills: [
    {
      name: "Fireball",
      description: "Deals fire damage with 280 potency.",
      unlocked: false,
      subskills: [
        {
          name: "Greater Fireball",
          description: "Deals fire damage with 320 potency.",
          unlocked: false,
          subskills: []
        },
        {
          name: "Firestorm",
          description: "Deals fire damage over time with 100 potency for 45s.",
          unlocked: false,
          subskills: []
        }
      ]
    },
    {
      name: "Cure",
      description: "Restore HP with 500 potency.",
      unlocked: false,
      subskills: [
        {
          name: "Cure 2",
          description: "Restore HP with 800 potency.",
          unlocked: false,
          subskills: []
        },
        {
          name: "Regen",
          description: "Grants healing over time with 250 potency for 18s.",
          unlocked: false,
          subskills: []
        }
      ]
    }
  ]
};

async function createTable() {
  try {
      await client.connect();
      console.log("Successfully connected to the database!");
      const result = await client.query(`
          SELECT EXISTS (
              SELECT 1 
              FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = 'skills'
          );
      `);

      if (!result.rows[0].exists) {
          console.log("skills table doesn't exist. Creating...");
          await client.query(`
              CREATE TABLE "public"."skills" (
                  "id" integer GENERATED ALWAYS AS IDENTITY,
                  "name" TEXT NOT NULL,
                  "description" TEXT,
                  "unlocked" BOOLEAN DEFAULT FALSE,
                  "subskills" TEXT,
                  PRIMARY KEY ("id")
              );
          `);
          console.log("skills table created successfully.");
      } else {
          console.log("skills table already exists.");
      }
  } catch (error) {
      console.error("Error creating table:", error);
  }
}

async function logTableContents() {
  try {
      const result = await client.query('SELECT * FROM "skills";');
      console.log("skills table contents:", result.rows);
  } catch (err) {
      console.error("Error fetching skills table contents:", err);
  }
}

async function listTables() {
  try {
      const result = await client.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public';
      `);
      console.log("Tables in the database:", result.rows);
  } catch (err) {
      console.error("Error fetching tables:", err);
  }
}

async function main() {
  await createTable();
  await logTableContents();
  await listTables();
}

main();

export async function createSkillTree(req, res, next) {
  try {
    await client.query('DELETE FROM "skills"');
    async function insertSkill(skill, parentName = null) {
        const result = await client.query(
            `INSERT INTO skills (name, description, unlocked, subskills) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [
                skill.name,
                skill.description,
                skill.unlocked,
                skill.subskills.map(sub => sub.name).join(",")
            ]
        );
        console.log(`Inserted skill: ${skill.name}`);
        for (const subskill of skill.subskills) {
            await insertSkill(subskill, skill.name);
        }
    }
    await insertSkill(skillTree);
    console.log("Skill tree populated successfully.");

  } catch (error) {
    console.log("Database connection failed:", error);
    res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: "Failed to populate skill tree" });
  }
}

export async function getSkillTree(req, res, next) {
    try {
        const result = await client.query("SELECT * FROM skills");
        console.log("skills table contents:", result.rows);
        res.status(HTTP_CODES.SUCCESS.OK).json(result.rows);
    } catch (error) {
        console.error("Error fetching skill tree:", error);
        res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch skill tree" });
    }
}

export async function updateSkill(req, res, next) {
    const skillName = req.params.skillName;

    try {
        const skill = await client.query("SELECT unlocked FROM skills WHERE name = $1", [skillName]);

        if (skill.rows.length === 0) {
            return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ error: `Skill '${skillName}' not found` });
        }

        const newUnlockedState = !skill.rows[0].unlocked;
        await client.query("UPDATE skills SET unlocked = $1 WHERE name = $2", [newUnlockedState, skillName]);
        res.status(HTTP_CODES.SUCCESS.OK).json(`${skillName} unlocked: ${newUnlockedState}`);
    } catch (error) {
        console.error("Error updating skill:", error);
        res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: "Failed to update skill" });
    }
}

export async function deleteSkill(req, res, next) {
    const skillName = req.params.skillName;

    try {
        const result = await client.query("DELETE FROM skills WHERE name = $1 RETURNING *", [skillName]);

        if (result.rowCount === 0) {
            return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ error: `Skill '${skillName}' not found` });
        }

        res.status(HTTP_CODES.SUCCESS.OK).json(`Deleted skill: ${skillName}`);
    } catch (error) {
        console.error("Error deleting skill:", error);
        res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete skill" });
    }
}