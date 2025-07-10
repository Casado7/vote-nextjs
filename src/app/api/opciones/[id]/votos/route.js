import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/opciones/[id]/votos - Devuelve la lista de votos con usuario para una opción
export async function GET(req, context) {
  const id = context.params?.id;
  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
  }
  try {
    const votos = await prisma.vote.findMany({
      where: { comidaId: id },
      include: {
        usuario: { select: { id: true, nombre: true, username: true, imagen: true } }
      },
      orderBy: { fecha: 'desc' }
    });
    return NextResponse.json({ votos });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener votos.' }, { status: 500 });
  }
}
