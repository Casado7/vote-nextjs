"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        router.replace("/dashboard");
      }
    }
  }, [router]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <main className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Bienvenido a la app de votación</h1>
        <div className="flex w-full gap-4 mt-4">
          <Link href="/register" className="w-1/2">
            <Button className="w-full">Registrarse</Button>
          </Link>
          <Link href="/login" className="w-1/2">
            <Button className="w-full" variant="outline">Iniciar sesión</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
