import { execSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';

export function setUpPrismaTest() {
  execSync('npm run prisma:migrate-test');
}

export async function resetDatabase(prismaService: PrismaClient) {
  await prismaService.$executeRaw`TRUNCATE TABLE 
    users, app_users, feature_flags, user_feature_flags, audit_logs
    CASCADE`;
}
