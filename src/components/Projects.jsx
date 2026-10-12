import { useRef, useState, useSyncExternalStore } from 'react'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { useModalA11y } from '../lib/useModalA11y'
import Reveal from './Reveal'
import Section from './Section'
import { TechLogo } from './TechLogo'
import { projects } from '../data/projects'

const EASE = [0.22, 1, 0.36, 1]

function Flag({ children }) {
  return (
    <span className="rounded-full border border-signal/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-signal">
      {children}
    </span>
  )
}

function ProjectLinks({ project }) {
  const linkClass =
    'link-u inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-ink hover:text-signal'
  return (
    <div className="flex flex-wrap items-center gap-x-7">
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label={`${project.staging ? 'Staging' : 'Live'} site for ${project.title}`}
        >
          {project.staging ? 'View staging' : 'Visit live site'} ↗
        </a>
      )}
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label={`Source code for ${project.title} on GitHub`}
        >
          Source on GitHub ↗
        </a>
      )}
    </div>
  )
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.065, delayChildren: 0.04 } },
}
const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

// Case-study body, shared by the sticky desktop panel and the mobile accordion.
// Each block rises in turn whenever the project changes.
function Detail({ project }) {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      <motion.div variants={rise} className="flex flex-wrap items-center gap-2">
        {project.staging && <Flag>Staging</Flag>}
        {project.contributor && <Flag>Contributor</Flag>}
        {project.desktopOnly && <Flag>Desktop-first</Flag>}
      </motion.div>

      <motion.p variants={rise} className="mt-5 text-[17px] leading-[1.65]">
        {project.summary}
      </motion.p>

      {project.problem && (
        <motion.figure variants={rise} className="mt-8 border-l-2 border-signal pl-5">
          <figcaption className="eyebrow mb-2 !text-signal">The problem</figcaption>
          <blockquote className="font-serif text-[1.35rem] italic leading-[1.3]">{project.problem}</blockquote>
        </motion.figure>
      )}

      <ol className="mt-8 space-y-3">
        {project.features.map((feature, i) => (
          <motion.li key={feature} variants={rise} className="grid grid-cols-[2rem_1fr] text-[15px] leading-relaxed text-mute">
            <span className="eyebrow pt-[3px]">{String(i + 1).padStart(2, '0')}</span>
            {feature}
          </motion.li>
        ))}
      </ol>

      <motion.div variants={rise} className="mt-8 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <TechLogo key={tech} name={tech} />
        ))}
      </motion.div>

      {project.desktopOnly && (
        <motion.p variants={rise} className="mt-6 text-sm text-mute">
          Built mainly for PC viewing; the mobile layout is still in progress.
        </motion.p>
      )}

      <motion.div variants={rise} className="mt-6 border-t border-rule pt-2">
        <ProjectLinks project={project} />
      </motion.div>
    </motion.div>
  )
}

const DESKTOP_QUERY = '(min-width: 1024px)'
function useIsDesktop() {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(DESKTOP_QUERY)
      mq.addEventListener('change', notify)
      return () => mq.removeEventListener('change', notify)
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true,
  )
}

// Touch layouts: the case study opens in a bottom sheet so the list never
// reflows under your thumb. Drag the handle down to dismiss.
function ProjectSheet({ project, index, total, onClose, onStep }) {
  const sheetRef = useRef(null)
  const closeRef = useRef(null)
  const controls = useDragControls()
  useModalA11y(true, sheetRef, closeRef)

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 z-[74] bg-ink/45 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />
      <motion.div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        className="fixed inset-x-0 bottom-0 z-[75] mx-auto flex max-h-[90svh] max-w-2xl flex-col rounded-t-[1.5rem] border border-b-0 border-rule bg-paper shadow-[0_-20px_60px_-20px_rgb(0_0_0/0.45)]"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.5, ease: EASE }}
        drag="y"
        dragListener={false}
        dragControls={controls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => (info.offset.y > 110 || info.velocity.y > 600) && onClose()}
      >
        <div className="shrink-0 touch-none px-6 pb-4 pt-3" onPointerDown={(e) => controls.start(e)}>
          <span aria-hidden="true" className="mx-auto mb-4 block h-1 w-10 rounded-full bg-rule" />
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="eyebrow mb-1.5">
                Case {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </p>
              <h3 className="display text-[1.9rem] leading-[1.05]">{project.title}</h3>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close project"
              className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full font-mono text-sm text-mute hover:text-ink"
            >
              ✕
            </button>
          </div>
        </div>

        <div key={project.id} className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-rule px-6 pb-6 pt-6">
          <Detail project={project} />
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-rule px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => onStep(-1)}
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-mute hover:text-ink"
          >
            ← Prev
          </button>
          <span className="eyebrow">{String(index + 1).padStart(2, '0')}</span>
          <button
            type="button"
            onClick={() => onStep(1)}
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-mute hover:text-ink"
          >
            Next →
          </button>
        </div>
      </motion.div>
    </>
  )
}

export default function Projects() {
  const [activeId, setActiveId] = useState(projects[0].id)
  const [sheetId, setSheetId] = useState(null)
  const isDesktop = useIsDesktop()
  const active = projects.find((p) => p.id === activeId) ?? projects[0]
  const sheetIndex = isDesktop ? -1 : projects.findIndex((p) => p.id === sheetId)
  const stepSheet = (dir) => setSheetId(projects[(sheetIndex + dir + projects.length) % projects.length].id)
  const select = (id) => (isDesktop ? setActiveId(id) : setSheetId(id))

  return (
    <Section
      id="projects"
      index="02"
      label="Selected work"
      title="Things I've *built.*"
      aside={
        <a
          href="https://github.com/Dominic62q"
          target="_blank"
          rel="noopener noreferrer"
          className="eyebrow link-u hidden hover:!text-signal sm:inline"
        >
          All on GitHub ↗
        </a>
      }
    >
      <div className="grid gap-x-16 lg:grid-cols-12">
        <ul className="lg:col-span-7" aria-label="Projects">
          {projects.map((project, i) => {
            const isActive = isDesktop && project.id === activeId
            return (
              <Reveal as="li" key={project.id} delay={Math.min(i, 5) * 0.04} y={20} className="group/row relative isolate -mx-3 border-b border-rule px-3 first:border-t">
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 -z-10 origin-bottom bg-paper-deep transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/row:scale-y-100 ${isActive ? 'scale-y-100' : 'scale-y-0'}`}
                />
                <button
                  type="button"
                  onClick={() => select(project.id)}
                  onMouseEnter={() => isDesktop && setActiveId(project.id)}
                  onFocus={() => isDesktop && setActiveId(project.id)}
                  {...(isDesktop
                    ? { 'aria-expanded': isActive, 'aria-controls': 'project-details' }
                    : { 'aria-haspopup': 'dialog' })}
                  className="group grid w-full grid-cols-[1.75rem_1fr_auto] items-baseline gap-x-3 py-6 text-left md:py-7"
                >
                  <span className={`eyebrow transition-colors duration-300 ${isActive ? '!text-signal' : ''}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span className="min-w-0">
                    <span
                      className={`display block text-[clamp(1.85rem,3.3vw,3rem)] leading-[1.02] transition-[transform,color] duration-500 ease-[var(--ease-out-expo)] ${
                        isActive ? 'translate-x-2 text-signal' : 'group-hover:translate-x-2'
                      }`}
                    >
                      {project.title}
                    </span>
                    <span className="eyebrow mt-2.5 block truncate !normal-case !tracking-[0.04em]">
                      {project.stack.slice(0, 3).join(' · ')}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className={`font-mono text-lg transition-transform duration-500 ${isActive ? 'rotate-45 text-signal' : 'text-mute'}`}
                  >
                    +
                  </span>
                </button>
              </Reveal>
            )
          })}
        </ul>

        {/* Desktop: sticky case-study panel. */}
        <aside id="project-details" className="relative hidden lg:col-span-5 lg:block" aria-label="Project details">
          <div className="sticky top-24">
            <div className="relative mb-3 h-[2px] bg-rule" aria-hidden="true">
              <motion.span
                className="absolute inset-y-0 left-0 w-full origin-left bg-signal"
                animate={{ scaleX: (projects.findIndex((p) => p.id === active.id) + 1) / projects.length }}
                transition={{ duration: 0.8, ease: EASE }}
              />
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="rounded-sm border border-rule bg-paper-deep/60 p-8"
              >
                <p className="eyebrow mb-5 flex items-center justify-between">
                  <span>
                    Case {String(projects.findIndex((p) => p.id === active.id) + 1).padStart(2, '0')} /{' '}
                    {String(projects.length).padStart(2, '0')}
                  </span>
                  <span className="text-signal">{active.title}</span>
                </p>
                <Detail project={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {sheetIndex >= 0 && (
          <ProjectSheet
            project={projects[sheetIndex]}
            index={sheetIndex}
            total={projects.length}
            onClose={() => setSheetId(null)}
            onStep={stepSheet}
          />
        )}
      </AnimatePresence>
    </Section>
  )
}
