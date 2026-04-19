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
    <section id="strengths" className="py-24 border-t border-[#e5e5e3] dark:border-[#2a2a2a]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-xs text-[#aaa] dark:text-[#555] uppercase tracking-widest mb-4">What I do well</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#111] dark:text-[#f0f0ee] leading-tight tracking-tight">
            Capabilities that matter.
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
            >
              <h3 className="text-sm font-semibold text-[#111] dark:text-[#f0f0ee] mb-2">{s.title}</h3>
              <p className="text-sm text-[#666] dark:text-[#999] leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
