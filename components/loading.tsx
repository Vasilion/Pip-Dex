export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[50vh]">
      <div className="text-emerald-500 font-mono text-center">
        <div className="text-2xl mb-4 animate-pulse">LOADING...</div>
        <div className="text-sm">Accessing Pokédex data</div>
        <div className="mt-8 space-y-2">
          <div className="w-64 h-4 bg-emerald-900/30 animate-pulse"></div>
          <div className="w-48 h-4 bg-emerald-900/30 animate-pulse"></div>
          <div className="w-56 h-4 bg-emerald-900/30 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

