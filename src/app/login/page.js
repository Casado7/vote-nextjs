"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
    </form>
  );
}
