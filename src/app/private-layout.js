"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "../context/user-context";

export default function PrivateLayout({ children }) {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.replace("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b border-border">
        {/* Barra de navegación */}
        <nav className="flex gap-4">
          <a href="/dashboard" className="font-medium hover:underline underline-offset-4">Inicio</a>
          <a href="/usuarios" className="font-medium hover:underline underline-offset-4">Usuarios</a>
          <a href="/opciones" className="font-medium hover:underline underline-offset-4">Opciones</a>
        </nav>
        {/* Usuario y dropdown */}
        <div className="relative min-w-[160px] flex items-center justify-end">
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => setDropdown((d) => !d)}
            disabled={!user}
          >
            {user ? (
              user.imagen ? (
                <img
                  src={user.imagen}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">
                  {user?.nombre?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
                </div>
              )
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            )}
            <span className="font-medium">
              {user ? (user.nombre || user.username) : <span className="bg-muted rounded w-20 h-4 inline-block animate-pulse" />}
            </span>
          </button>
          {user && dropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-popover border rounded shadow z-10">
              <Button className="w-full justify-start" variant="ghost" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </div>
          )}
        </div>
      </header>
      <main>
        {(!user && typeof window !== "undefined" && localStorage.getItem("token")) ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-pulse text-lg">Cargando...</div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
