import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function upsertUser(
  email: string,
  role: Role,
  firstName: string,
  lastName: string,
  password: string,
) {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      firstName,
      lastName,
      role,
      status: 'ACTIVE',
      wallet: { create: { balance: 100 } },
    },
  });
  console.log(`Seeded ${role}: ${email} / ${password}`);
  return user;
}

async function main() {
  await upsertUser('superadmin@otpprovider.com', 'SUPER_ADMIN', 'Super', 'Admin', 'ChangeMe123!');
  await upsertUser('admin@otpprovider.com', 'ADMIN', 'System', 'Admin', 'ChangeMe123!');
  await upsertUser('support@otpprovider.com', 'SUPPORT', 'Support', 'Agent', 'ChangeMe123!');
  await upsertUser('reseller@otpprovider.com', 'RESELLER', 'Reseller', 'Partner', 'ChangeMe123!');
  await upsertUser('client@otpprovider.com', 'CLIENT', 'Demo', 'Client', 'ChangeMe123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
