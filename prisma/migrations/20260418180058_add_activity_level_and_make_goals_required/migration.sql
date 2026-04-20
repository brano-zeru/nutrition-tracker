/*
  Warnings:

  - Made the column `target_weight` on table `profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `calorie_goal` on table `profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `protein_goal` on table `profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTRA_ACTIVE');

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "activityLevel" "ActivityLevel" NOT NULL DEFAULT 'MODERATELY_ACTIVE',
ALTER COLUMN "target_weight" SET NOT NULL,
ALTER COLUMN "calorie_goal" SET NOT NULL,
ALTER COLUMN "calorie_goal" DROP DEFAULT,
ALTER COLUMN "protein_goal" SET NOT NULL,
ALTER COLUMN "protein_goal" DROP DEFAULT;
