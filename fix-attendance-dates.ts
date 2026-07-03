import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find all attendance records where date is NOT already at UTC midnight
  const all = await prisma.attendance.findMany();
  let fixed = 0;

  for (const rec of all) {
    const d = new Date(rec.date);
    const midnight = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0),
    );
    if (d.getTime() !== midnight.getTime()) {
      await prisma.attendance.update({
        where: { id: rec.id },
        data: { date: midnight },
      });
      fixed++;
      console.log(`Fixed: ${rec.id} → ${midnight.toISOString()}`);
    }
  }

  console.log(`Done. Fixed ${fixed} records.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
