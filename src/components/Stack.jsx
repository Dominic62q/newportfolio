import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { stackGroups } from '../data/stack'

export default function Stack() {
  return (
    <section id="stack" className="py-28 border-t border-border">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-brand">03</span>
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground/60">Stack</span>
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-foreground leading-[1.05] tracking-tight">
            Tools I work with.
          </h2>
        </motion.div>

        <div className="space-y-5">
          {stackGroups.map(({ category, items }, i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Card className="border-border bg-card shadow-none">
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start px-(--card-spacing) py-4">
                  <div className="sm:w-28 shrink-0 pt-0.5">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-brand">{category}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <Badge
                        key={item}
                        variant="outline"
                        className="cursor-default rounded-lg border-border bg-card px-3 py-1.5 text-sm font-normal text-muted-foreground transition-all hover:border-brand/40 hover:text-brand"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
