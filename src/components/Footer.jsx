export default function Footer() {
  return (
    <footer className="border-t border-border py-12 bg-background">
      <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground/50">
          &copy; {new Date().getFullYear()} Dominic Amuah
        </p>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center gap-2 text-xs text-muted-foreground/50 hover:text-brand transition-colors group"
        >
          Back to top
          <span className="inline-flex w-5 h-5 border border-border rounded-full items-center justify-center group-hover:border-brand transition-colors">
            ↑
          </span>
        </button>
      </div>
    </footer>
  )
}
