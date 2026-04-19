import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-16">
      <div className="max-w-3xl mx-auto px-6 py-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="text-sm text-[#888] dark:text-[#666] mb-6 tracking-wide uppercase">
            Based in Accra, Ghana &mdash; Available for work
          </p>

          <h1 className="text-5xl md:text-7xl font-semibold text-[#111] dark:text-[#f0f0ee] leading-[1.05] tracking-tight mb-6">
            Dominic<br />Amuah.
          </h1>

          <p className="text-lg md:text-xl text-[#444] dark:text-[#bbb] leading-relaxed max-w-xl mb-10">
            Backend developer building practical web applications with Django,
            REST APIs, and modern frontend tools. Strong in backend logic,
            authentication, and database design.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#111] dark:bg-[#f0f0ee] text-[#f9f9f7] dark:text-[#111] text-sm font-medium rounded-full hover:bg-[#333] dark:hover:bg-[#ddd] transition-colors"
            >
              View Projects
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#ddd] dark:border-[#333] text-[#111] dark:text-[#f0f0ee] text-sm font-medium rounded-full hover:border-[#111] dark:hover:border-[#f0f0ee] transition-colors"
            >
              Contact Me
            </a>
          </div>

          <div className="mt-12 flex items-center gap-6">
            <a
              href="https://github.com/Dominic62q"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#888] dark:text-[#666] hover:text-[#111] dark:hover:text-[#f0f0ee] transition-colors"
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/dominic-amuah"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#888] dark:text-[#666] hover:text-[#111] dark:hover:text-[#f0f0ee] transition-colors"
            >
              LinkedIn ↗
            </a>
            <a
              href="mailto:dominicquainoo62@gmail.com"
              className="text-sm text-[#888] dark:text-[#666] hover:text-[#111] dark:hover:text-[#f0f0ee] transition-colors"
            >
              Email ↗
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
