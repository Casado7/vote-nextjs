"use client";
import { useEffect, useState } from "react";
import ModalNuevaOpcion from "./ModalNuevaOpcion";
import { Button } from "@/components/ui/button";
import { useUser } from "../../context/user-context";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Estrellas from "./Estrellas";

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
                <li key={op.id} className="relative flex items-center gap-4 p-4 border rounded-lg bg-card">
                  {user?.id === op.creador?.id && (
                    <Dialog open={deleteId === op.id} onOpenChange={v => setDeleteId(v ? op.id : null)}>
                      <DialogTrigger asChild>
                        <button className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 rounded-full p-1" title="Eliminar opción">
                          <span className="sr-only">Eliminar</span>
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>¿Eliminar opción?</DialogTitle>
                          <DialogDescription>Esta acción no se puede deshacer. ¿Seguro que deseas eliminar esta opción?</DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-2 justify-end mt-4">
                          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancelar</Button>
                          <Button variant="destructive" onClick={() => handleDelete(op.id)}>Eliminar</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
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
                    <div className="font-semibold text-lg">{op.nombre}</div>
                    {op.descripcion && <div className="text-sm text-muted-foreground">{op.descripcion}</div>}
                    {op.url && (
                      <a href={op.url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm block mb-1">Ver sitio</a>
                    )}
                    <div className="text-sm mt-1">Precio: <span className="font-medium">${op.precio}</span></div>
                    <div className="text-xs text-muted-foreground mt-1">Creador: {op.creador?.nombre || op.creador?.username}</div>
                    <div className="mt-2">
                      <Estrellas
                        opcionId={op.id}
                        initial={votos[op.id] || 0}
                        onVotar={(n) => handleVotar(op.id, n)}
                      />
                    </div>
                  </div>
                </li>
              ))}
        </ul>
      )}
    </div>
  );
}
