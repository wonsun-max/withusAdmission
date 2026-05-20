const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
async function main() {
  const g = await db.universityGuideline.findFirst({ where: { university: 'snu' } });
  console.log(JSON.stringify(g.requirements, null, 2));
}
main().finally(() => db.$disconnect());
