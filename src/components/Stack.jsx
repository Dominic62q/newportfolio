import { motion } from 'framer-motion'
import { stackGroups } from '../data/stack'

export default function Stack() {
  return (
    <section id="stack" className="py-24 border-t border-[#e5e5e3] dark:border-[#2a2a2a]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-xs text-[#aaa] dark:text-[#555] uppercase tracking-widest mb-4">Stack</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#111] dark:text-[#f0f0ee] leading-tight tracking-tight">
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
              <div className="sm:w-32 shrink-0">
                <p className="text-xs text-[#aaa] dark:text-[#555] uppercase tracking-widest pt-1">{category}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="text-sm px-3 py-1.5 border border-[#e5e5e3] dark:border-[#2a2a2a] text-[#444] dark:text-[#bbb] rounded-lg bg-white dark:bg-[#1a1a1a] hover:border-[#ccc] dark:hover:border-[#444] transition-colors"
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
