// Build-time seed: inserts the original question bank ONLY when the
// questions table is empty. Safe to run on every deploy — it never
// modifies or deletes existing rows (e.g. questions added via admin).
// Run with: node prisma/seed-if-empty.mjs   (requires DATABASE_URL)
import { PrismaClient } from "@prisma/client";
import { QUESTIONS } from "./questions-data.mjs";

const db = new PrismaClient();

async function main() {
  const count = await db.question.count();
  if (count > 0) {
    console.log(`Questions table already has ${count} rows — skipping seed.`);
    return;
  }
  console.log(`Questions table is empty — seeding ${QUESTIONS.length} questions…`);
  await db.question.createMany({ data: QUESTIONS });
  const after = await db.question.count();
  console.log(`Done. ${after} questions in the database.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
