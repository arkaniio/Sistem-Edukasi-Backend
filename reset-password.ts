import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('app123', 10);
  const result = await prisma.user.updateMany({
    data: { password },
  });
  console.log(`Updated ${result.count} users password to 'app123'`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
