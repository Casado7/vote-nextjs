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
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [delivery, setDelivery] = useState(false);
  const [ubicacion, setUbicacion] = useState("");
  const [url, setUrl] = useState("");
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
    setError("");
    // Validaciones de precios
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0) {
      setError("El precio mínimo y máximo deben ser mayores a 0.");
      return;
    }
    if (min >= max) {
      setError("El precio mínimo debe ser menor que el precio máximo.");
      return;
    }
    // Validación de URL si se ingresó
    if (url && url.trim() !== "") {
      try {
        new URL(url);
      } catch {
        setError("El URL ingresado no es válido.");
        return;
      }
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/opciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ nombre, descripcion, minPrice, maxPrice, delivery, ubicacion, url, imagen }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear opción");
      onCreated(data.opcion);
      onClose();
      setNombre(""); setDescripcion(""); setMinPrice(""); setMaxPrice(""); setDelivery(false); setUbicacion(""); setImagen(null); setPreview(null);
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
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="minPrice" className="mb-1 block">Precio mínimo</Label>
              <Input id="minPrice" required type="number" min="0" step="0.01" placeholder="Precio mínimo" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
            </div>
            <div className="flex-1">
              <Label htmlFor="maxPrice" className="mb-1 block">Precio máximo</Label>
              <Input id="maxPrice" required type="number" min="0" step="0.01" placeholder="Precio máximo" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="ubicacion" className="mb-1 block">Ubicación</Label>
            <Input id="ubicacion" placeholder="Ubicación" value={ubicacion} onChange={e => setUbicacion(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="url" className="mb-1 block">URL</Label>
            <Input id="url" placeholder="Enlace o sitio web" value={url} onChange={e => setUrl(e.target.value)} />
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
