export default function Footer() {
  return (
    <footer className="border-t border-[#e5e5e3] dark:border-[#2a2a2a] py-10">
      <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#aaa] dark:text-[#555]">
          &copy; {new Date().getFullYear()} Dominic Amuah
        </p>
        <p className="text-sm text-[#ccc] dark:text-[#444]">
          Built with React &amp; Tailwind CSS
        </p>
      </div>
    </footer>
  )
}
