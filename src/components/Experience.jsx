import { motion } from 'framer-motion'
import { experiences } from '../data/experience'

export default function Experience() {
  return (
    <section id="experience" className="py-28 border-t border-[#e5e5e3] dark:border-[#1e1e1e]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-[#f97316]">04</span>
            <span className="text-xs uppercase tracking-[0.18em] text-[#aaa] dark:text-[#555]">Experience</span>
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-[#111] dark:text-[#f0f0ee] leading-[1.05] tracking-tight">
            Where I've worked.
          </h2>
        </motion.div>

        <div className="space-y-10">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="flex flex-col md:flex-row gap-4 md:gap-12"
            >
              <div className="md:w-40 shrink-0">
                <p className="text-xs font-mono text-[#999] dark:text-[#555] mt-0.5 leading-snug">{exp.period}</p>
              </div>

              <div className="flex-1">
                <div className="flex items-start gap-3 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f97316] mt-2 shrink-0" />
                  <h3 className="text-base font-semibold text-[#111] dark:text-[#f0f0ee] leading-snug">
                    {exp.role}
                  </h3>
                </div>
                <p className="text-sm text-[#999] dark:text-[#666] mb-4 ml-[18px]">{exp.company}</p>
                <ul className="space-y-2 ml-[18px]">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className="text-sm text-[#666] dark:text-[#999] flex items-start gap-2 leading-relaxed">
                      <span className="text-[#f97316]/40 shrink-0 mt-0.5">—</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
