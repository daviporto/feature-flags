/*
  Warnings:

  - You are about to alter the column `email` on the `app_users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `app_users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[externalId]` on the table `app_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `app_users` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `app_users` required. This step will fail if there are existing NULL values in that column.
  - The required column `api_token` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "app_users" ADD COLUMN     "externalId" VARCHAR(255) NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "api_token" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "app_users_externalId_key" ON "app_users"("externalId");
