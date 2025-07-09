import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {
  try {
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        nombre: true,
        username: true,
        imagen: true,
      },
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(usuarios);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}

// DELETE /api/usuarios?id=USER_ID
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function DELETE(request) {
  try {
    const auth = request.headers.get("authorization");
    let userId = null;
    if (auth && auth.startsWith("Bearer ")) {
      try {
        const token = auth.replace("Bearer ", "");
        const payload = jwt.verify(token, JWT_SECRET);
        userId = payload.id;
      } catch {}
    }
    if (!userId) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }
    // Solo el admin puede borrar usuarios
    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { rol: true },
    });
    if (!adminUser || adminUser.rol.nombre !== "admin") {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || id === userId) {
      return NextResponse.json({ error: "ID inválido o no puedes borrarte a ti mismo." }, { status: 400 });
    }
    // Cascade delete: votos, comentarios, opciones (y sus votos/comentarios)
    // 1. Borrar votos del usuario
    await prisma.vote.deleteMany({ where: { usuarioId: id } });
    // 2. Borrar comentarios del usuario
    await prisma.comentario.deleteMany({ where: { usuarioId: id } });
    // 3. Buscar opciones creadas por el usuario
    const opciones = await prisma.foodOption.findMany({ where: { creadorId: id }, select: { id: true } });
    const opcionIds = opciones.map(o => o.id);
    if (opcionIds.length > 0) {
      // 4. Borrar votos de esas opciones
      await prisma.vote.deleteMany({ where: { comidaId: { in: opcionIds } } });
      // 5. Borrar comentarios de esas opciones
      await prisma.comentario.deleteMany({ where: { comidaId: { in: opcionIds } } });
      // 6. Borrar las opciones
      await prisma.foodOption.deleteMany({ where: { id: { in: opcionIds } } });
    }
    // 7. Borrar el usuario
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al borrar usuario.", detalle: error?.message || error }, { status: 500 });
  }
}
