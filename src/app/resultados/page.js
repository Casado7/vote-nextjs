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
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

export default function ResultadosPage() {
  const [opciones, setOpciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/opciones?conVotos=1")
      .then((res) => res.json())
      .then((data) => {
        setOpciones(data.opciones || []);
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
              <li key={op.id} className="relative flex items-center gap-4 p-4 border rounded-lg bg-card">
                {op.imagen ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <img
                        src={op.imagen}
                        alt={op.nombre}
                        className="w-16 h-16 rounded object-cover border cursor-pointer transition hover:scale-105"
                        title="Ver imagen grande"
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-md flex flex-col items-center">
                      <img
                        src={op.imagen}
                        alt={op.nombre}
                        className="w-full max-w-[90vw] sm:max-w-[500px] h-auto rounded object-contain border"
                        style={{ maxHeight: '80vh' }}
                      />
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="w-16 h-16 rounded bg-muted flex items-center justify-center text-2xl font-bold">
                    {op.nombre[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-semibold text-lg">{op.nombre}</div>
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      {Number(op.precio).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-muted-foreground">{op.creador?.nombre || op.creador?.username}</span>
                  </div>
                  {op.descripcion && <div className="text-sm text-muted-foreground">{op.descripcion}</div>}
                  {op.url && (
                    <a href={op.url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm block mb-1">Ver sitio</a>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating value={op.promedio || 0} />
                    <span className="text-sm text-muted-foreground">{op.promedio?.toFixed(2) || 0} / 5</span>

                    {typeof op.desviacion === 'number' && op.totalVotos > 0 && (
                      <span
                        className={
                          'text-base font-semibold ml-3 cursor-help ' +
                          (op.desviacion > 1.5
                            ? 'text-red-600'
                            : op.desviacion > 1
                              ? 'text-orange-500'
                              : 'text-green-600')
                        }
                        title="Desviación estándar de los votos"
                        style={{ minWidth: 60, display: 'inline-block' }}
                      >
                        σ = {op.desviacion.toFixed(2)}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground ml-2">({op.totalVotos || 0} votos)</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PrivateLayout>
  );
}
