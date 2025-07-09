import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function PUT(request) {
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
    const { nombre, username, imagen } = await request.json();
    if (!nombre || !username) {
      return NextResponse.json({ error: 'Nombre y usuario son obligatorios.' }, { status: 400 });
    }
    // Validar que el username no esté en uso por otro usuario
    const existe = await prisma.user.findFirst({ where: { username, NOT: { id: userId } } });
    if (existe) {
      return NextResponse.json({ error: 'El usuario ya está en uso.' }, { status: 400 });
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: { nombre, username, imagen },
      select: { id: true, nombre: true, username: true, imagen: true, rolId: true },
    });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar perfil.' }, { status: 500 });
  }
}
