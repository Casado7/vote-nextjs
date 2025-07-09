"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/user-context";

export default function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useUser();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Error");
    else {
      localStorage.setItem("token", data.token);
      // Guardar imagen aparte si viene en la respuesta
      if (data.user && data.user.imagen) {
        localStorage.setItem("_user_img", data.user.imagen);
      } else {
        localStorage.removeItem("_user_img");
      }
      setUser({ ...data.user });
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <form className="space-y-4 max-w-sm mx-auto p-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-center">Iniciar sesión</h2>
      <Input name="username" placeholder="Usuario" value={form.username} onChange={handleChange} required />
      <Input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
      <Button type="button" className="w-full" variant="outline" onClick={() => router.push("/")}>Volver al inicio</Button>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
    </form>
  );
}
