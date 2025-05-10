/*
  Warnings:

  - You are about to drop the column `position` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `rotation` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `scale` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "position",
DROP COLUMN "rotation",
DROP COLUMN "scale",
ADD COLUMN     "positionX" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "positionY" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "positionZ" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "rotationX" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "rotationY" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "rotationZ" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "scaleX" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "scaleY" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "scaleZ" DOUBLE PRECISION NOT NULL DEFAULT 1;
