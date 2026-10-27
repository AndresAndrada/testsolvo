export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] text-zinc-400">
      <div className="flex flex-col items-center gap-3">
        <div className="h-1 w-12 animate-pulse bg-red-500" />
        <p className="text-xs uppercase tracking-[0.3em]">Cargando...</p>
      </div>
    </div>
  );
}
