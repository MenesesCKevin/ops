const LoadingSpinner = ({ message = 'Cargando...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
    <div className="relative size-16">
      <div className="absolute inset-0 border-4 border-secondary rounded-full" />
      <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
    </div>
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

export default LoadingSpinner;
