export default function Loading() {
  return (
    <div className="fixed top-4 left-4 z-[9999]">
      <div className="bg-background/90 flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm shadow">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        <span className="font-medium">Chờ một chút…</span>
      </div>
    </div>
  );
}
