import { motion } from 'framer-motion'
import { experiences } from '../data/experience'

export default function Experience() {
  return (
    <section id="experience" className="py-24 border-t border-[#e5e5e3] dark:border-[#2a2a2a]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-xs text-[#aaa] dark:text-[#555] uppercase tracking-widest mb-4">Experience</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#111] dark:text-[#f0f0ee] leading-tight tracking-tight">
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
              className="flex flex-col md:flex-row gap-4 md:gap-10"
            >
              <div className="md:w-44 shrink-0">
                <p className="text-xs text-[#aaa] dark:text-[#555] mt-0.5 leading-snug">{exp.period}</p>
              </div>

              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#111] dark:text-[#f0f0ee] leading-snug mb-0.5">
                  {exp.role}
                </h3>
                <p className="text-sm text-[#888] dark:text-[#666] mb-4">{exp.company}</p>
                <ul className="space-y-2">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className="text-sm text-[#555] dark:text-[#aaa] flex items-start gap-2 leading-relaxed">
                      <span className="text-[#ccc] dark:text-[#444] shrink-0 mt-0.5">—</span>
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
