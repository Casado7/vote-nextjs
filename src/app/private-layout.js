"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function getUserFromToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

export default function PrivateLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setUser(getUserFromToken());
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex justify-end items-center p-4">
        {user && (
          <div className="relative">
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setDropdown((d) => !d)}
            >
              {user.imagen ? (
                <img
                  src={user.imagen}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">
                  {user.nombre?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                </div>
              )}
              <span className="font-medium">{user.nombre || user.username}</span>
            </button>
            {dropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-popover border rounded shadow z-10">
                <Button className="w-full justify-start" variant="ghost" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </div>
            )}
          </div>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}
