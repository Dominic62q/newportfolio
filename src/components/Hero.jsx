import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 pb-12 relative overflow-hidden">
      <div className="absolute -top-60 right-0 w-[600px] h-[600px] rounded-full bg-brand/5 dark:bg-brand/[0.07] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-40 w-80 h-80 rounded-full bg-brand/[0.03] dark:bg-brand/[0.05] blur-3xl pointer-events-none" />

      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[clamp(8rem,22vw,16rem)] font-black font-display leading-none text-foreground/[0.025] select-none pointer-events-none tracking-tighter">
        DA.
      </div>

      <div className="max-w-4xl mx-auto px-6 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 mb-10 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand" />
          </span>
          Available for work - Accra, Ghana
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-foreground leading-[0.88] tracking-[-0.04em] mb-8"
          style={{ fontSize: 'clamp(3.5rem, 11vw, 7.5rem)' }}
        >
          Dominic
          <br />
          Amuah<span className="text-brand">.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex items-start gap-5 mb-10 max-w-xl"
        >
          <div className="w-[2px] h-14 bg-brand/40 shrink-0 mt-1 rounded-full" />
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Software developer building practical web applications, REST APIs,
            and internal tools with{' '}
            <span className="text-foreground font-semibold">Django</span>,{' '}
            <span className="text-foreground font-semibold">Node.js</span>, and modern frontend tools.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center gap-3 mb-16"
        >
          <Button asChild size="lg" className="rounded-full bg-brand px-6 text-brand-foreground hover:brightness-90">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              View Projects
              <ArrowUpRight className="size-2.5" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full border-border bg-transparent px-6 text-foreground hover:border-muted-foreground hover:bg-transparent">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Get in touch
            </a>
          </Button>
          <Button asChild variant="link" className="px-0 text-muted-foreground/60 hover:text-brand">
            <a href="/documents/Dominic-Amuah-Resume.pdf" download="Dominic-Amuah-Resume.pdf">
              Resume ↓
            </a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="flex items-center gap-8 pt-8 border-t border-border"
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
              <span className="text-[10px] font-mono text-brand/50 group-hover:text-brand transition-colors">{num}</span>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{label} ↗</span>
            </a>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-border origin-top"
        />
      </motion.div>
    </section>
  )
}
