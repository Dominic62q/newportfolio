import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

const strengths = [
  {
    title: 'Backend Systems',
    description:
      'Design and improve robust backend systems with Django, DRF, and Node.js across authentication, permissions, APIs, and business logic.',
  },
  {
    title: 'REST API Design',
    description:
      'Build practical REST APIs that frontend clients and internal tools can rely on, with clear structure, filtering, and maintainable integration points.',
  },
  {
    title: 'Database Design',
    description:
      'Model relational data carefully from the start with PostgreSQL, MySQL, and SQLite, including query debugging and workflow-aware schema decisions.',
  },
  {
    title: 'Frontend Integration',
    description:
      'Connect backend logic to usable interfaces with React, Nuxt, and Django templates while keeping frontend-backend workflows clean.',
  },
  {
    title: 'Secure Product Thinking',
    description:
      'Apply cybersecurity awareness to access control, authentication flows, input handling, privacy, and safer operational user experiences.',
  },
  {
    title: 'Debugging & Delivery',
    description:
      'Diagnose API, database, UI, deployment, and workflow issues, then document fixes, support testing, and help teams ship reliably.',
  },
]

export default function Strengths() {
  return (
    <section id="strengths" className="py-28 border-t border-border">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-brand">05</span>
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground/60">Capabilities</span>
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-foreground leading-[1.05] tracking-tight">
            What I do well.
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {strengths.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Card className="group h-full border-border bg-card shadow-none transition-colors hover:border-brand/40">
                <CardContent className="px-(--card-spacing) py-5">
                  <div className="mb-3 flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full border border-border bg-card transition-colors group-hover:border-brand group-hover:bg-brand" />
                    <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
                      {s.title}
                    </h3>
                  </div>
                  <p className="pl-[22px] text-sm leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
