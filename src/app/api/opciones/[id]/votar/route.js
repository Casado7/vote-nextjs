
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// POST: Guardar o actualizar voto
export async function POST(req, { params }) {
  // Autenticación por JWT (header Authorization)
  const auth = req.headers.get('authorization');
  let usuarioId = null;
  if (auth && auth.startsWith('Bearer ')) {
    try {
      const token = auth.replace('Bearer ', '');
      const payload = jwt.verify(token, JWT_SECRET);
      usuarioId = payload.id;
    } catch {}
  }
  if (!usuarioId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = params; // id de la opción de comida
  const { puntuacion } = await req.json();
  if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
    return NextResponse.json({ error: "Voto inválido" }, { status: 400 });
  }
  // Upsert voto
  const voto = await prisma.vote.upsert({
    where: {
      usuarioId_comidaId: {
        usuarioId,
        comidaId: id,
      },
    },
    update: { puntuacion },
    create: {
      puntuacion,
      usuarioId,
      comidaId: id,
    },
  });
  return NextResponse.json({ ok: true, voto });
}

// GET: Obtener voto del usuario autenticado para esta opción
export async function GET(req, { params }) {
  const auth = req.headers.get('authorization');
  let usuarioId = null;
  if (auth && auth.startsWith('Bearer ')) {
    try {
      const token = auth.replace('Bearer ', '');
      const payload = jwt.verify(token, JWT_SECRET);
      usuarioId = payload.id;
    } catch {}
  }
  if (!usuarioId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = params;
  // Buscar voto
  const voto = await prisma.vote.findUnique({
    where: {
      usuarioId_comidaId: {
        usuarioId,
        comidaId: id,
      },
    },
  });
  return NextResponse.json({ voto });
}
