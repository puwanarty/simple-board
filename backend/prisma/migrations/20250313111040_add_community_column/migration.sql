/*
  Warnings:

  - Added the required column `community` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Community" AS ENUM ('HISTORY', 'FOOD', 'OTHER');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "community" "Community" NOT NULL;
