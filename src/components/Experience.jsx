import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { experiences } from '../data/experience'

export default function Experience() {
  return (
    <section id="experience" className="py-28 border-t border-border">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-brand">04</span>
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground/60">Experience</span>
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-foreground leading-[1.05] tracking-tight">
            Where I've worked.
          </h2>
        </motion.div>

        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Card className="border-border bg-card shadow-none">
                <CardContent className="px-(--card-spacing) py-5">
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="mb-2 flex items-start gap-3">
                        <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        <div>
                          <h3 className="text-base font-semibold leading-snug text-foreground">
                            {exp.role}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">{exp.company}</p>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="w-fit rounded-full border-border bg-card px-3 py-1 text-xs font-mono text-muted-foreground"
                    >
                      {exp.period}
                    </Badge>
                  </div>

                  <ul className="space-y-2">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                        <span className="mt-0.5 shrink-0 text-brand/40">→</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
