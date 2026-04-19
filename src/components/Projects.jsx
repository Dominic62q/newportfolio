import { motion } from 'framer-motion'
import { projects } from '../data/projects'

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      {/* Numbered index */}
      <span className="absolute -top-3 -left-1 font-mono text-[10px] text-[#f97316]/40 group-hover:text-[#f97316] transition-colors">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="border border-[#e5e5e3] dark:border-[#1e1e1e] rounded-2xl p-6 bg-white dark:bg-[#111] hover:border-[#f97316]/40 dark:hover:border-[#f97316]/30 hover:shadow-lg hover:shadow-[#f97316]/5 transition-all duration-300">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-base font-semibold text-[#111] dark:text-[#f0f0ee] leading-snug group-hover:text-[#f97316] transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center gap-3 shrink-0">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#ccc] dark:text-[#444] hover:text-[#f97316] dark:hover:text-[#f97316] transition-colors"
              >
                GitHub ↗
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#ccc] dark:text-[#444] hover:text-[#f97316] dark:hover:text-[#f97316] transition-colors"
              >
                Live ↗
              </a>
            )}
          </div>
        </div>

        <p className="text-sm text-[#777] dark:text-[#888] leading-relaxed mb-5">
          {project.summary}
        </p>

        <ul className="space-y-1.5 mb-5">
          {project.features.slice(0, 3).map((f) => (
            <li key={f} className="text-xs text-[#999] dark:text-[#666] flex items-start gap-2">
              <span className="text-[#f97316]/40 mt-0.5 shrink-0">→</span>
              {f}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="text-[11px] px-2.5 py-0.5 bg-[#f4f4f2] dark:bg-[#1a1a1a] text-[#888] dark:text-[#666] rounded-full border border-[#e8e8e6] dark:border-[#252525]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="py-28 border-t border-[#e5e5e3] dark:border-[#1e1e1e]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between gap-6 mb-14"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-[#f97316]">02</span>
              <span className="text-xs uppercase tracking-[0.18em] text-[#aaa] dark:text-[#555]">Projects</span>
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl text-[#111] dark:text-[#f0f0ee] leading-[1.05] tracking-tight">
              Things I've built.
            </h2>
          </div>
          <a
            href="https://github.com/Dominic62q"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#aaa] dark:text-[#555] hover:text-[#f97316] dark:hover:text-[#f97316] transition-colors shrink-0"
          >
            All on GitHub ↗
          </a>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
