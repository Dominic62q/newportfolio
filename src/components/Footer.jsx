export default function Footer() {
  return (
    <footer className="border-t border-[#e5e5e3] dark:border-[#1e1e1e] py-12 bg-[#f9f9f7] dark:bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#bbb] dark:text-[#444]">
          &copy; {new Date().getFullYear()} Dominic Amuah
        </p>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center gap-2 text-xs text-[#bbb] dark:text-[#444] hover:text-[#f97316] dark:hover:text-[#f97316] transition-colors group"
        >
          Back to top
          <span className="inline-flex w-5 h-5 border border-[#ddd] dark:border-[#2a2a2a] rounded-full items-center justify-center group-hover:border-[#f97316] transition-colors">
            ↑
          </span>
        </button>
      </div>
    </footer>
  )
}
