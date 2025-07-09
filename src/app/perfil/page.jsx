"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUser } from "../../context/user-context";

export default function PerfilPage() {
  const { user, setUser } = useUser();
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [imagen, setImagen] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setNombre(user.nombre || "");
      setUsername(user.username || "");
      setImagen(user.imagen || "");
    }
  }, [user]);

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagen(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ nombre, username, imagen }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar perfil");
      setUser(data.user);
      setSuccess("Perfil actualizado correctamente.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mi perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="username">Usuario</Label>
          <Input id="username" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="imagen">Foto de perfil</Label>
          <Input id="imagen" type="file" accept="image/*" onChange={handleImagen} />
          {imagen && <img src={imagen} alt="preview" className="w-20 h-20 object-cover rounded border mt-2" />}
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Guardando..." : "Guardar cambios"}</Button>
      </form>
    </div>
  );
}
