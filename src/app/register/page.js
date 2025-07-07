"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [form, setForm] = useState({ nombre: "", username: "", password: "", imagen: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        router.replace("/dashboard");
      }
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen" && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, imagen: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Error");
    else {
      setSuccess("Usuario registrado correctamente");
      setTimeout(() => router.push("/login"), 1200);
    }
    setLoading(false);
  };

  return (
    <form className="space-y-4 max-w-sm mx-auto p-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-center">Registro</h2>
      <Input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
      <Input name="username" placeholder="Usuario" value={form.username} onChange={handleChange} required />
      <Input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
      <Input name="imagen" type="file" accept="image/*" onChange={handleChange} />
      {form.imagen && <img src={form.imagen} alt="preview" className="w-20 h-20 rounded-full mx-auto" />}
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Registrando..." : "Registrarse"}</Button>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      {success && <div className="text-green-600 text-sm text-center">{success}</div>}
    </form>
  );
}
