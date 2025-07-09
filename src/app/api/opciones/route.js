import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function GET(request) {
  try {
    const url = request?.url || "";
    const conVotos = url.includes("conVotos=1");
    const opciones = await prisma.foodOption.findMany({
      include: {
        creador: { select: { id: true, nombre: true, username: true, imagen: true } },
        ...(conVotos ? { votes: true } : {}),
      },
      orderBy: { nombre: 'asc' },
    });
    if (conVotos) {
      // Calcular promedio, total de votos y desviación estándar
      opciones.forEach(op => {
        op.totalVotos = op.votes.length;
        op.promedio = op.votes.length ? op.votes.reduce((a, v) => a + v.puntuacion, 0) / op.votes.length : 0;
        // Desviación estándar
        if (op.votes.length > 0) {
          const mean = op.promedio;
          const variance = op.votes.reduce((acc, v) => acc + Math.pow(v.puntuacion - mean, 2), 0) / op.votes.length;
          op.desviacion = Math.sqrt(variance);
        } else {
          op.desviacion = 0;
        }
        delete op.votes;
      });
    }
    return NextResponse.json({ opciones });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener opciones.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, descripcion, minPrice, maxPrice, delivery, ubicacion, url, imagen } = body;
    if (!nombre || !minPrice || !maxPrice) {
      return NextResponse.json({ error: 'Nombre, precio mínimo y máximo son obligatorios.' }, { status: 400 });
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
        minPrice: parseFloat(minPrice),
        maxPrice: parseFloat(maxPrice),
        delivery: !!delivery,
        ubicacion,
        url,
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
