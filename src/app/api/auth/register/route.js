import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { nombre, username, password, imagen } = await request.json();
    if (!nombre || !username || !password) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios.' }, { status: 400 });
    }
    const exists = await prisma.user.findUnique({ where: { username } });
    if (exists) {
      return NextResponse.json({ error: 'El usuario ya existe.' }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        nombre,
        username,
        passwordHash,
        rol: 'normal-user',
        imagen: imagen || null,
      },
      select: { id: true, nombre: true, username: true, rol: true, imagen: true },
    });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar usuario.' }, { status: 500 });
  }
}
