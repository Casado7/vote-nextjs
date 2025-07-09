import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function ModalNuevaOpcion({ open, onClose, onCreated, trigger }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [delivery, setDelivery] = useState(false);
  const [ubicacion, setUbicacion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagen(ev.target.result);
      setPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/opciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ nombre, descripcion, precio, delivery, ubicacion, imagen }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear opción");
      onCreated(data.opcion);
      onClose();
      setNombre(""); setDescripcion(""); setPrecio(""); setDelivery(false); setUbicacion(""); setImagen(null); setPreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v ? onClose() : undefined}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva opción</DialogTitle>
          <DialogDescription>Agrega una nueva opción de comida al sistema.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre" className="mb-1 block">Nombre</Label>
            <Input id="nombre" required placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="descripcion" className="mb-1 block">Descripción</Label>
            <Textarea id="descripcion" placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="precio" className="mb-1 block">Precio</Label>
            <Input id="precio" required type="number" min="0" step="0.01" placeholder="Precio" value={precio} onChange={e => setPrecio(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="ubicacion" className="mb-1 block">Ubicación</Label>
            <Input id="ubicacion" placeholder="Ubicación" value={ubicacion} onChange={e => setUbicacion(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="delivery" checked={delivery} onCheckedChange={setDelivery} />
            <Label htmlFor="delivery" className="ml-2">Delivery disponible</Label>
          </div>
          <div>
            <Label htmlFor="imagen" className="mb-1 block">Imagen</Label>
            <Input id="imagen" type="file" accept="image/*" onChange={handleImagen} />
          </div>
          {preview && <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded border mx-auto" />}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Guardando..." : "Crear opción"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
