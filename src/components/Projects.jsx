import { motion } from 'framer-motion'
import { projects } from '../data/projects'

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
      className="group border border-[#e5e5e3] rounded-xl p-6 hover:border-[#ccc] transition-colors bg-white"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-base font-semibold text-[#111] dark:text-[#f0f0ee] leading-snug">
          {project.title}
        </h3>
        <div className="flex items-center gap-3 shrink-0">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#888] dark:text-[#666] hover:text-[#111] dark:hover:text-[#f0f0ee] transition-colors"
            >
              GitHub ↗
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#888] dark:text-[#666] hover:text-[#111] dark:hover:text-[#f0f0ee] transition-colors"
            >
              Live ↗
            </a>
          )}
        </div>
      </div>

      <p className="text-sm text-[#666] dark:text-[#999] leading-relaxed mb-4">
        {project.summary}
      </p>

      <ul className="space-y-1 mb-5">
        {project.features.slice(0, 3).map((f) => (
          <li key={f} className="text-xs text-[#888] dark:text-[#666] flex items-start gap-2">
            <span className="text-[#ccc] dark:text-[#444] mt-0.5 shrink-0">→</span>
            {f}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="text-xs px-2.5 py-1 bg-[#f4f4f2] dark:bg-[#222] text-[#666] dark:text-[#999] rounded-full"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 border-t border-[#e5e5e3] dark:border-[#2a2a2a]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-xs text-[#aaa] dark:text-[#555] uppercase tracking-widest mb-4">Projects</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#111] dark:text-[#f0f0ee] leading-tight tracking-tight">
            Things I've built.
          </h2>
          <p className="mt-3 text-[#666] dark:text-[#999] text-base max-w-lg">
            A selection of backend-focused and full-stack projects — real problems, real code.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-[#e5e5e3] dark:border-[#2a2a2a]">
          <a
            href="https://github.com/Dominic62q"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#888] dark:text-[#666] hover:text-[#111] dark:hover:text-[#f0f0ee] transition-colors"
          >
            See more on GitHub ↗
          </a>
        </div>
      </div>
    </section>
  )
}
