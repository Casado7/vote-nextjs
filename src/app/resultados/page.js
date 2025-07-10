"use client";
import PrivateLayout from "../private-layout";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
// Componente para mostrar estrellas con soporte para medias
function StarRating({ value }) {
  // value: número entre 0 y 5, puede ser decimal
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      // Llena
      stars.push(
        <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
      );
    } else if (value >= i - 0.75) {
      // Media estrella (relleno parcial)
      stars.push(
        <span key={i} className="relative inline-block" style={{ width: 20, height: 20 }}>
          <Star size={20} className="text-muted-foreground" />
          <span className="absolute left-0 top-0 overflow-hidden" style={{ width: '50%' }}>
            <Star size={20} className="fill-yellow-400 text-yellow-400" />
          </span>
        </span>
      );
    } else {
      // Vacía
      stars.push(
        <Star key={i} size={20} className="text-muted-foreground" />
      );
    }
  }
  return <span className="flex items-center gap-0.5">{stars}</span>;
}
import OpcionCard from "../opciones/OpcionCard";

export default function ResultadosPage() {
  const [opciones, setOpciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/opciones?conVotos=1")
      .then((res) => res.json())
      .then((data) => {
        // Ordenar por promedio descendente
        const ordenadas = (data.opciones || []).slice().sort((a, b) => (b.promedio || 0) - (a.promedio || 0));
        setOpciones(ordenadas);
        setLoading(false);
      });
  }, []);

  return (
    <PrivateLayout>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Resultados de la votación</h1>
        {loading ? (
          <div className="animate-pulse text-lg">Cargando...</div>
        ) : opciones.length === 0 ? (
          <div className="text-muted-foreground">No hay opciones registradas.</div>
        ) : (
          <ul className="space-y-4">
            {opciones.map((op) => (
              <OpcionCard
                key={op.id}
                op={op}
                user={null}
                showResultados={true}
              />
            ))}
          </ul>
        )}
      </div>
    </PrivateLayout>
  );
}
