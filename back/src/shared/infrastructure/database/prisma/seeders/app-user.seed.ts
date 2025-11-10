import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding app users...');

  const appUsers = [
    {
      externalId: uuidv4(),
      email: 'john.doe@example.com',
      name: 'John Doe',
    },
    {
      externalId: uuidv4(),
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
    },
    {
      externalId: uuidv4(),
      email: 'bob.johnson@example.com',
      name: 'Bob Johnson',
    },
  ];

  for (const user of appUsers) {
    const existing = await prisma.appUser.findUnique({
      where: { email: user.email },
    });

    if (!existing) {
      await prisma.appUser.create({
        data: user,
      });
      console.log(`Created app user: ${user.name} (${user.email})`);
    } else {
      console.log(`App user already exists: ${user.name} (${user.email})`);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


