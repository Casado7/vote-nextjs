import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Estrellas from "./Estrellas";
import { Star, MapPin, Bike } from "lucide-react";

function StarRating({ value }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      stars.push(<Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />);
    } else if (value >= i - 0.75) {
      stars.push(
        <span key={i} className="relative inline-block" style={{ width: 20, height: 20 }}>
          <Star size={20} className="text-muted-foreground" />
          <span className="absolute left-0 top-0 overflow-hidden" style={{ width: '50%' }}>
            <Star size={20} className="fill-yellow-400 text-yellow-400" />
          </span>
        </span>
      );
    } else {
      stars.push(<Star key={i} size={20} className="text-muted-foreground" />);
    }
  }
  return <span className="flex items-center gap-0.5">{stars}</span>;
}

export default function OpcionCard({
  op,
  user,
  onDelete,
  onVotar,
  votos,
  showResultados = false,
  deleteId,
  setDeleteId
}) {
  return (
    <li className="relative flex items-center gap-4 p-4 border rounded-lg bg-card">
      {user?.id === op.creador?.id && onDelete && (
        <Dialog open={deleteId === op.id} onOpenChange={v => setDeleteId(v ? op.id : null)}>
          <DialogTrigger asChild>
            <button className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 rounded-full p-1" title="Eliminar opción">
              <span className="sr-only">Eliminar</span>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Eliminar opción?</DialogTitle>
              <DialogDescription>Esta acción no se puede deshacer. ¿Seguro que deseas eliminar esta opción?</DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={() => onDelete(op.id)}>Eliminar</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {op.imagen ? (
        <Dialog>
          <DialogTrigger asChild>
            <img
              src={op.imagen}
              alt={op.nombre}
              className="w-16 h-16 rounded object-cover border cursor-pointer transition hover:scale-105"
              title="Ver imagen grande"
            />
          </DialogTrigger>
          <DialogContent className="max-w-md flex flex-col items-center">
            <img
              src={op.imagen}
              alt={op.nombre}
              className="w-full max-w-[90vw] sm:max-w-[500px] h-auto rounded object-contain border"
              style={{ maxHeight: '80vh' }}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <div className="w-16 h-16 rounded bg-muted flex items-center justify-center text-2xl font-bold">
          {op.nombre[0].toUpperCase()}
        </div>
      )}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="font-semibold text-lg">{op.nombre}</div>
          <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
            {Number(op.minPrice).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 })}
            {op.maxPrice && (
              <>
                <span>-</span>
                {Number(op.maxPrice).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 })}
              </>
            )}
          </span>
          <span className="text-xs text-muted-foreground">{op.creador?.nombre || op.creador?.username}</span>
        </div>
        {op.descripcion && <div className="text-sm text-muted-foreground">{op.descripcion}</div>}
        {/* Ubicación, delivery y URL en la misma línea si existen */}
        {(op.ubicacion || typeof op.delivery === 'boolean' || op.url) && (
          <div className="flex items-center gap-2 mb-1">
            {op.ubicacion && (
              <span className="flex items-center text-sm text-muted-foreground">
                <MapPin size={16} className="mr-1 text-primary" />
                {op.ubicacion}
              </span>
            )}
            {typeof op.delivery === 'boolean' && (
              <span className="relative flex items-center group cursor-pointer">
                <Bike size={18} className={op.delivery ? 'text-green-600' : 'text-red-600'} />
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-10 whitespace-nowrap rounded bg-card border px-2 py-1 text-xs shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                  {op.delivery ? 'Tiene delivery' : 'Sin delivery'}
                </span>
              </span>
            )}
            {op.url && (
              <a href={op.url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">Ver sitio</a>
            )}
          </div>
        )}
        <div className={showResultados ? "mt-2 flex items-center gap-2 flex-wrap" : "mt-2"}>
          {showResultados ? (
            <div className="flex items-center gap-2 flex-wrap">
              <StarRating value={op.promedio || 0} />
              <span className="text-sm text-muted-foreground">{op.promedio?.toFixed(2) || 0} / 5</span>
              {typeof op.desviacion === 'number' && op.totalVotos > 0 && (
                <span
                  className={
                    'text-base font-semibold ml-3 cursor-help ' +
                    (op.desviacion > 1.5
                      ? 'text-red-600'
                      : op.desviacion > 1
                        ? 'text-orange-500'
                        : 'text-green-600')
                  }
                  title="Desviación estándar de los votos"
                  style={{ minWidth: 60, display: 'inline-block' }}
                >
                  σ = {op.desviacion.toFixed(2)}
                </span>
              )}
              <span className="text-xs text-muted-foreground ml-2">({op.totalVotos || 0} votos)</span>
            </div>
          ) : (
            <Estrellas
              opcionId={op.id}
              initial={votos?.[op.id] || 0}
              onVotar={onVotar ? (n) => onVotar(op.id, n) : undefined}
            />
          )}
        </div>
      </div>
    </li>
  );
}
