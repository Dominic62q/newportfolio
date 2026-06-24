import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
      <span className="absolute -top-3 -left-1 font-mono text-[10px] text-brand/40 group-hover:text-brand transition-colors">
        {String(index + 1).padStart(2, '0')}
      </span>

      <Card className="border-border bg-card shadow-none transition-all duration-300 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5">
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base leading-snug text-foreground transition-colors group-hover:text-brand">
                {project.title}
              </CardTitle>
              {project.contributor && (
                <Badge variant="outline" className="shrink-0 border-brand/20 bg-brand/10 font-mono text-[10px] text-brand/70 hover:bg-brand/10">
                  contributor
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {project.github && (
                <Button asChild variant="link" size="sm" className="h-auto px-0 text-xs text-muted-foreground/60 hover:text-brand">
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    GitHub ↗
                  </a>
                </Button>
              )}
              {project.demo && (
                <Button asChild variant="link" size="sm" className="h-auto px-0 text-xs text-muted-foreground/60 hover:text-brand">
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    Live ↗
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            {project.summary}
          </p>

          <ul className="space-y-1.5 mb-5">
            {project.features.slice(0, 3).map((f) => (
              <li key={f} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-brand/40 mt-0.5 shrink-0">→</span>
                {f}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="rounded-full border-border bg-muted px-2.5 py-0.5 text-[11px] font-normal text-muted-foreground"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="py-28 border-t border-border">
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
              <span className="text-xs font-mono text-brand">02</span>
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground/60">Projects</span>
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl text-foreground leading-[1.05] tracking-tight">
              Things I've built.
            </h2>
          </div>
          <a
            href="https://github.com/Dominic62q"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground/60 hover:text-brand transition-colors shrink-0"
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
