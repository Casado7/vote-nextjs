"use client";
import { useEffect, useState } from "react";
import ModalNuevaOpcion from "./ModalNuevaOpcion";
import { Button } from "@/components/ui/button";

export default function OpcionesPage() {
  const [opciones, setOpciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    fetch("/api/opciones")
      .then((res) => res.json())
      .then((data) => {
        setOpciones(data.opciones || []);
        setLoading(false);
      });
  }, []);

  const handleCreated = (nueva) => {
    setOpciones((prev) => [nueva, ...prev]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Opciones de comida</h1>
        <ModalNuevaOpcion
          open={modal}
          onClose={() => setModal(false)}
          onCreated={handleCreated}
          trigger={<Button onClick={() => setModal(true)}>+ Nueva opción</Button>}
        />
      </div>
      {loading ? (
        <div className="animate-pulse text-lg">Cargando...</div>
      ) : opciones.length === 0 ? (
        <div className="text-muted-foreground">No hay opciones registradas.</div>
      ) : (
        <ul className="space-y-4">
          {opciones.map((op) => (
            <li key={op.id} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
              {op.imagen ? (
                <img src={op.imagen} alt={op.nombre} className="w-16 h-16 rounded object-cover border" />
              ) : (
                <div className="w-16 h-16 rounded bg-muted flex items-center justify-center text-2xl font-bold">
                  {op.nombre[0].toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-semibold text-lg">{op.nombre}</div>
                {op.descripcion && <div className="text-sm text-muted-foreground">{op.descripcion}</div>}
                <div className="text-sm mt-1">Precio: <span className="font-medium">${op.precio}</span></div>
                <div className="text-xs text-muted-foreground mt-1">Creador: {op.creador?.nombre || op.creador?.username}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
