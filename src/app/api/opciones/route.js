import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function GET() {
  try {
    const opciones = await prisma.foodOption.findMany({
      include: {
        creador: { select: { id: true, nombre: true, username: true, imagen: true } },
      },
      orderBy: { nombre: 'asc' },
    });
    return NextResponse.json({ opciones });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener opciones.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, descripcion, precio, delivery, ubicacion, imagen } = body;
    if (!nombre || !precio) {
      return NextResponse.json({ error: 'Nombre y precio son obligatorios.' }, { status: 400 });
    }
    // Obtener el usuario autenticado desde el JWT en el header Authorization
    const auth = request.headers.get('authorization');
    let creadorId = null;
    if (auth && auth.startsWith('Bearer ')) {
      try {
        const token = auth.replace('Bearer ', '');
        const payload = jwt.verify(token, JWT_SECRET);
        creadorId = payload.id;
      } catch {}
    }
    if (!creadorId) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }
    // Limitar a 3 opciones por usuario
    const count = await prisma.foodOption.count({ where: { creadorId } });
    if (count >= 3) {
      return NextResponse.json({ error: 'Solo puedes crear hasta 3 opciones.' }, { status: 403 });
    }
    const opcion = await prisma.foodOption.create({
      data: {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        delivery: !!delivery,
        ubicacion,
        imagen,
        creadorId,
      },
      include: {
        creador: { select: { id: true, nombre: true, username: true, imagen: true } },
      },
    });
    return NextResponse.json({ opcion });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear opción.' }, { status: 500 });
  }
}
