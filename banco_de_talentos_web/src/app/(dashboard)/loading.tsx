export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="h-8 w-64 bg-slate-800 rounded-xl mb-2" />
          <div className="h-4 w-96 bg-slate-800/60 rounded-lg" />
        </div>
        <div className="h-10 w-40 bg-slate-800 rounded-xl" />
      </div>

      <div className="h-24 bg-slate-900 border border-slate-800 rounded-2xl p-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-64 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-slate-800 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-800 rounded" />
                  <div className="h-3 w-20 bg-slate-800/60 rounded" />
                </div>
              </div>
              <div className="h-4 w-24 bg-emerald-500/20 rounded-full mb-3" />
              <div className="h-3 w-full bg-slate-800/60 rounded mb-2" />
              <div className="h-3 w-4/5 bg-slate-800/60 rounded mb-4" />
            </div>
            <div className="h-9 bg-slate-800 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}
