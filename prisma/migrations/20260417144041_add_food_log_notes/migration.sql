/*
  Warnings:

  - Added the required column `notes` to the `food_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "food_logs" ADD COLUMN     "notes" TEXT NOT NULL;
