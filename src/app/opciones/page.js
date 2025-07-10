"use client";
import { useEffect, useState } from "react";
import ModalNuevaOpcion from "./ModalNuevaOpcion";
import { Button } from "@/components/ui/button";
import { useUser } from "../../context/user-context";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import OpcionCard from "./OpcionCard";

export default function OpcionesPage() {
  const [opciones, setOpciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { user } = useUser();
  const [votos, setVotos] = useState({}); // { [opcionId]: puntuacion }

  useEffect(() => {
    fetch("/api/opciones")
      .then((res) => res.json())
      .then(async (data) => {
        setOpciones(data.opciones || []);
        // Obtener votos del usuario para cada opción
        const token = localStorage.getItem("token");
        if (token && data.opciones?.length) {
          const votosObj = {};
          await Promise.all(
            data.opciones.map(async (op) => {
              const res = await fetch(`/api/opciones/${op.id}/votar`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (res.ok) {
                const { voto } = await res.json();
                if (voto && voto.puntuacion) votosObj[op.id] = voto.puntuacion;
              }
            })
          );
          setVotos(votosObj);
        }
        setLoading(false);
      });
  }, []);

  const handleCreated = (nueva) => {
    setOpciones((prev) => [nueva, ...prev]);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/opciones/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      setOpciones((prev) => prev.filter((op) => op.id !== id));
    }
    setDeleteId(null);
  };

  const handleVotar = (opcionId, puntuacion) => {
    setVotos((prev) => ({ ...prev, [opcionId]: puntuacion }));
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
            <OpcionCard
              key={op.id}
              op={op}
              user={user}
              onDelete={handleDelete}
              onVotar={handleVotar}
              votos={votos}
              deleteId={deleteId}
              setDeleteId={setDeleteId}
              showResultados={false}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
