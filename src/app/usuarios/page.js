"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/context/user-context";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { user } = useUser();

  async function fetchUsuarios() {
    try {
      const res = await fetch("/api/usuarios");
      if (!res.ok) throw new Error("Error al obtener usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/usuarios?id=${deleteId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al borrar usuario");
      }
      setDeleteId(null);
      fetchUsuarios();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Usuarios registrados</h2>
      {loading && <div>Cargando...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <ul className="divide-y divide-border">
        {usuarios.map((u) => (
          <li key={u.id} className="flex items-center gap-4 py-3">
            {u.imagen ? (
              <img src={u.imagen} alt={u.nombre || u.username} className="w-10 h-10 rounded-full border" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">
                {u.nombre?.[0]?.toUpperCase() || u.username?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <div className="font-medium">{u.nombre || u.username}</div>
              <div className="text-xs text-muted-foreground">{u.username}</div>
            </div>
            {/* Mostrar botón de borrar solo si el usuario tiene rol admin y no es él mismo */}
            {user?.rol?.nombre === "admin" && u.id !== user.id && (
              <Dialog open={deleteId === u.id} onOpenChange={open => setDeleteId(open ? u.id : null)}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="icon" title="Eliminar usuario">
                    <span className="sr-only">Eliminar</span>
                    &#10005;
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>¿Eliminar usuario?</DialogTitle>
                    <DialogDescription>
                      Esta acción eliminará al usuario <b>{u.nombre || u.username}</b> y <br />
                      <span className="text-destructive">todas sus opciones, votos y comentarios.</span>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={deleting}>Cancelar</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                      {deleting ? "Eliminando..." : "Eliminar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
