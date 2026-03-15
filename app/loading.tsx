export default function GlobalLoading() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-5xl flex-col items-center justify-center px-6 py-16">
      <div className="flex items-center gap-3 rounded-full border border-slate-400/20 bg-white/70 px-5 py-3 text-sm shadow-sm backdrop-blur dark:bg-slate-900/70">
        <span className="font-medium text-slate-700 dark:text-slate-200">Loading page...</span>
      </div>
    </section>
  );
}
