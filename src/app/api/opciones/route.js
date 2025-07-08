import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

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
