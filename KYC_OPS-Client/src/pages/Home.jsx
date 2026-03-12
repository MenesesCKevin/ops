export default function Home() {
  return (
    <div
      className="h-full w-full min-h-[60vh] bg-cover bg-center flex items-center justify-center rounded-lg"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="bg-card/90 p-10 rounded-lg shadow-xl border border-border text-center">
        <h1 className="text-4xl font-bold text-foreground">
          Bienvenido a KYC OPS
        </h1>
        <p className="mt-2 text-muted-foreground">Operaciones KYC</p>
      </div>
    </div>
  );
}
