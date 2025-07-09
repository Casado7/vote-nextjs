/*
  Warnings:

  - You are about to drop the column `rol` on the `User` table. All the data in the column will be lost.
  - Added the required column `rolId` to the `User` table without a default value. This is not possible if the table is not empty.
*/
-- 1. Crear la tabla Rol
CREATE TABLE "Rol" (
    "id" VARCHAR(36) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- 2. Crear índice único para nombre
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- 3. Insertar rol por defecto
INSERT INTO "Rol" (id, nombre) VALUES ('00000000-0000-0000-0000-000000000001', 'usuario') ON CONFLICT (nombre) DO NOTHING;

-- 4. Agregar campo rolId a User (permitiendo NULL)
ALTER TABLE "User" ADD COLUMN "rolId" VARCHAR(36);

-- 5. Asignar rolId por defecto a todos los usuarios existentes
UPDATE "User" SET "rolId" = '00000000-0000-0000-0000-000000000001' WHERE "rolId" IS NULL;

-- 6. Hacer rolId NOT NULL
ALTER TABLE "User" ALTER COLUMN "rolId" SET NOT NULL;

-- 7. Agregar la foreign key
ALTER TABLE "User" ADD CONSTRAINT "User_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 8. Eliminar el campo rol antiguo
ALTER TABLE "User" DROP COLUMN "rol";
