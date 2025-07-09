/*
  Warnings:

  - Added the required column `maxPrice` to the `FoodOption` table without a default value. This is not possible if the table is not empty.

*/
-- Primero añade la columna permitiendo NULL temporalmente
ALTER TABLE "FoodOption" ADD COLUMN "maxPrice" DECIMAL(10,2);

-- Luego actualiza todos los registros existentes con un valor por defecto
UPDATE "FoodOption" SET "maxPrice" = 10.00 WHERE "maxPrice" IS NULL;

-- Finalmente altera la columna para que sea NOT NULL
ALTER TABLE "FoodOption" ALTER COLUMN "maxPrice" SET NOT NULL;
