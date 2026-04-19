import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 pb-12 relative overflow-hidden">
      {/* Soft glow orbs */}
      <div className="absolute -top-60 right-0 w-[600px] h-[600px] rounded-full bg-[#f97316]/[0.05] dark:bg-[#f97316]/[0.07] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-40 w-80 h-80 rounded-full bg-[#f97316]/[0.03] dark:bg-[#f97316]/[0.05] blur-3xl pointer-events-none" />

      {/* Watermark */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[clamp(8rem,22vw,16rem)] font-black font-display leading-none text-[#111]/[0.025] dark:text-[#f0f0ee]/[0.025] select-none pointer-events-none tracking-tighter">
        DA.
      </div>

      <div className="max-w-4xl mx-auto px-6 w-full relative z-10">

        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 mb-10 px-4 py-2 rounded-full border border-[#e5e5e3] dark:border-[#222] bg-white dark:bg-[#111] text-xs text-[#777] dark:text-[#666]"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f97316] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#f97316]" />
          </span>
          Available for work — Accra, Ghana
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-[#111] dark:text-[#f0f0ee] leading-[0.88] tracking-[-0.04em] mb-8"
          style={{ fontSize: 'clamp(3.5rem, 11vw, 7.5rem)' }}
        >
          Dominic<br />
          Amuah<span className="text-[#f97316]">.</span>
        </motion.h1>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex items-start gap-5 mb-10 max-w-xl"
        >
          <div className="w-[2px] h-14 bg-[#f97316]/40 shrink-0 mt-1 rounded-full" />
          <p className="text-base md:text-lg text-[#555] dark:text-[#999] leading-relaxed">
            Backend developer building practical web applications with{' '}
            <span className="text-[#111] dark:text-[#eee] font-semibold">Django</span>,{' '}
            <span className="text-[#111] dark:text-[#eee] font-semibold">REST APIs</span>, and modern frontend tools.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center gap-3 mb-16"
        >
          <a
            href="#projects"
            onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#f97316] hover:bg-[#ea6c00] text-white text-sm font-medium rounded-full transition-colors"
          >
            View Projects
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </a>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#ddd] dark:border-[#2a2a2a] text-[#111] dark:text-[#f0f0ee] text-sm font-medium rounded-full hover:border-[#999] dark:hover:border-[#666] transition-colors"
          >
            Get in touch
          </a>
          <a
            href="/documents/Dominic-Amuah-Resume.pdf"
            download="Dominic-Amuah-Resume.pdf"
            className="text-sm text-[#aaa] dark:text-[#555] hover:text-[#f97316] dark:hover:text-[#f97316] transition-colors underline underline-offset-4"
          >
            Resume ↓
          </a>
        </motion.div>

        {/* Numbered socials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="flex items-center gap-8 pt-8 border-t border-[#e5e5e3] dark:border-[#1e1e1e]"
        >
          {[
            { num: '01', label: 'GitHub', href: 'https://github.com/Dominic62q' },
            { num: '02', label: 'LinkedIn', href: 'https://www.linkedin.com/in/dominic-amuah' },
            { num: '03', label: 'Email', href: 'mailto:dominicquainoo62@gmail.com' },
          ].map(({ num, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="group flex items-center gap-2"
            >
              <span className="text-[10px] font-mono text-[#f97316]/50 group-hover:text-[#f97316] transition-colors">{num}</span>
              <span className="text-sm text-[#888] dark:text-[#666] group-hover:text-[#111] dark:group-hover:text-[#f0f0ee] transition-colors">{label} ↗</span>
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll pulse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-[#ccc] dark:bg-[#333] origin-top"
        />
      </motion.div>
    </section>
  )
}
