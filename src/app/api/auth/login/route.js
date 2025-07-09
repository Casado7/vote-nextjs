import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Usuario y contraseña requeridos.' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { username },
      include: { rol: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 });
    }
    // NO incluir la imagen en el payload del JWT
    const rol = user.rol ? { id: user.rol.id, nombre: user.rol.nombre } : null;
    const token = jwt.sign({ id: user.id, username: user.username, rol, nombre: user.nombre }, JWT_SECRET, { expiresIn: '7d' });
    return NextResponse.json({ token, user: { id: user.id, nombre: user.nombre, username: user.username, rol, imagen: user.imagen } });
  } catch (error) {
    return NextResponse.json({ error: 'Error al iniciar sesión.' }, { status: 500 });
  }
}
