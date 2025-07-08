import { Star } from "lucide-react";
import { useState, useEffect } from "react";

export default function Estrellas({ opcionId, initial, onVotar }) {
  const [valor, setValor] = useState(initial || 0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValor(initial || 0);
  }, [initial]);

  const votar = async (n) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/opciones/${opcionId}/votar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ puntuacion: n }),
      });
      if (res.ok) {
        setValor(n);
        if (onVotar) onVotar(n);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={loading}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => votar(n)}
          className="group"
        >
          <Star
            className={
              (hover ? n <= hover : n <= valor)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }
            fill={
              (hover ? n <= hover : n <= valor)
                ? "#facc15"
                : "none"
            }
            strokeWidth={1.5}
            size={22}
          />
        </button>
      ))}
    </div>
  );
}
