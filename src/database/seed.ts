import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const clientPassword = await argon2.hash('clientPassword');
  const managerPassword = await argon2.hash('managerPassword');

  const client = await prisma.user.create({
    data: {
      email: 'diego@example.com',
      firstName: 'Diego',
      age: "20",
      lastName: 'Arevalo',
      password: clientPassword,
      roles: {
        set: [UserRole.CLIENT],
      },
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'roommonitor@example.com',
      firstName: 'roommonitor',
      lastName: 'Dev',
      age: "20",
      password: managerPassword,
      roles: {
        set: [UserRole.MANAGER],
      },
    },
  });

  console.log({ client, manager });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
