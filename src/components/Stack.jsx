import { motion } from 'framer-motion'
import { stackGroups } from '../data/stack'

export default function Stack() {
  return (
    <section id="stack" className="py-28 border-t border-[#e5e5e3] dark:border-[#1e1e1e]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-[#f97316]">03</span>
            <span className="text-xs uppercase tracking-[0.18em] text-[#aaa] dark:text-[#555]">Stack</span>
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-[#111] dark:text-[#f0f0ee] leading-[1.05] tracking-tight">
            Tools I work with.
          </h2>
        </motion.div>

        <div className="space-y-8">
          {stackGroups.map(({ category, items }, i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex flex-col sm:flex-row sm:items-start gap-4"
            >
              <div className="sm:w-28 shrink-0 pt-0.5">
                <p className="text-[10px] font-mono text-[#f97316] uppercase tracking-widest">{category}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="text-sm px-3 py-1.5 border border-[#e8e8e6] dark:border-[#1e1e1e] text-[#555] dark:text-[#999] rounded-lg bg-white dark:bg-[#0f0f0f] hover:border-[#f97316]/40 hover:text-[#f97316] dark:hover:border-[#f97316]/30 dark:hover:text-[#f97316] transition-all cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
