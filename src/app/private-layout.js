"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PrivateLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
