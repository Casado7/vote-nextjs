import PrivateLayout from "../private-layout";

export default function DashboardPage() {
  return (
    <PrivateLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-2">¡Bienvenido!</h1>
        <p className="text-muted-foreground">Has iniciado sesión correctamente.</p>
      </div>
    </PrivateLayout>
  );
}
