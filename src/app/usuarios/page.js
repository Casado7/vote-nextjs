"use client";
import { useEffect, useState } from "react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
    fetchUsuarios();
  }, []);

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
            <div>
              <div className="font-medium">{u.nombre || u.username}</div>
              <div className="text-xs text-muted-foreground">{u.username}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
