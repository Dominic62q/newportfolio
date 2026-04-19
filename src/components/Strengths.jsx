import { motion } from 'framer-motion'

const strengths = [
  {
    title: 'Backend Systems',
    description:
      'Design and build robust backend architectures with Django and DRF — authentication, permissions, APIs, and database logic.',
  },
  {
    title: 'REST API Design',
    description:
      'Build clean, documented REST APIs that frontend clients can rely on — serializers, viewsets, filtering, and pagination.',
  },
  {
    title: 'Database Design',
    description:
      'Model data well from the start — relational schemas, query optimisation, and migration-safe design with PostgreSQL.',
  },
  {
    title: 'Frontend Integration',
    description:
      'Connect backend logic to usable frontend interfaces using React — comfortable on both sides of the stack.',
  },
  {
    title: 'Debugging & Problem Solving',
    description:
      'Diagnose and fix issues in running systems — from API errors to database bottlenecks to frontend rendering bugs.',
  },
  {
    title: 'Shipping',
    description:
      'Deploy to production on Render, Vercel, and Heroku — environment config, build pipelines, and live troubleshooting.',
  },
]

export default function Strengths() {
  return (
    <section id="strengths" className="py-28 border-t border-[#e5e5e3] dark:border-[#1e1e1e]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-[#f97316]">05</span>
            <span className="text-xs uppercase tracking-[0.18em] text-[#aaa] dark:text-[#555]">Capabilities</span>
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-[#111] dark:text-[#f0f0ee] leading-[1.05] tracking-tight">
            What I do well.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {strengths.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            className="group relative pl-5 border-l-2 border-[#e8e8e6] dark:border-[#1e1e1e] hover:border-[#f97316] dark:hover:border-[#f97316] transition-colors duration-300"
          >
            <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full border-2 border-[#e8e8e6] dark:border-[#1e1e1e] group-hover:border-[#f97316] group-hover:bg-[#f97316] bg-[#f9f9f7] dark:bg-[#0a0a0a] transition-all duration-300" />
            <h3 className="text-sm font-semibold text-[#111] dark:text-[#f0f0ee] mb-1.5 group-hover:text-[#f97316] transition-colors">{s.title}</h3>
            <p className="text-sm text-[#777] dark:text-[#888] leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
