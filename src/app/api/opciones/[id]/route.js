import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function DELETE(request, { params }) {
  try {
    const auth = request.headers.get('authorization');
    let userId = null;
    if (auth && auth.startsWith('Bearer ')) {
      try {
        const token = auth.replace('Bearer ', '');
        const payload = jwt.verify(token, JWT_SECRET);
        userId = payload.id;
      } catch {}
    }
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }
    const id = params.id;
    // Solo permitir borrar si la opción pertenece al usuario
    const opcion = await prisma.foodOption.findUnique({ where: { id } });
    if (!opcion || opcion.creadorId !== userId) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 403 });
    }
    await prisma.foodOption.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar opción.' }, { status: 500 });
  }
}
