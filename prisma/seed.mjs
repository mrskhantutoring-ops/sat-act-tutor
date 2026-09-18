// Seed script: inserts 25 ORIGINAL practice questions (no copyrighted content).
// Run with: npm run db:seed   (requires DATABASE_URL to be set)
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

import { QUESTIONS } from "./questions-data.mjs";

async function main() {
  console.log(`Seeding ${QUESTIONS.length} questions…`);
  await db.question.deleteMany();
  await db.question.createMany({ data: QUESTIONS });
  const count = await db.question.count();
  console.log(`Done. ${count} questions in the database.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
