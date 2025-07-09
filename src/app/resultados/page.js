
"use client";
import PrivateLayout from "../private-layout";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
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
              <li key={op.id} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
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
                        className="w-full max-w-xs h-auto rounded object-contain border"
                        style={{ maxHeight: 400 }}
                      />
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="w-16 h-16 rounded bg-muted flex items-center justify-center text-2xl font-bold">
                    {op.nombre[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-semibold text-lg">{op.nombre}</div>
                  <div className="text-sm text-muted-foreground">{op.descripcion}</div>
                  {op.url && (
                    <a href={op.url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm block mb-1">Ver sitio</a>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map((n) => (
                        <Star key={n} size={20} className={n <= Math.round(op.promedio) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"} />
                      ))}
                    </span>
                    <span className="text-sm text-muted-foreground">{op.promedio?.toFixed(2) || 0} / 5</span>
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
