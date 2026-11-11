import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { useModalA11y } from '../lib/useModalA11y'
import Reveal from './Reveal'
import Section from './Section'
import { TechLogo } from './TechLogo'
import { projects } from '../data/projects'

const EASE = [0.22, 1, 0.36, 1]
const pad = (n) => String(n).padStart(2, '0')

function Flag({ children }) {
  return (
    <span className="rounded-full border border-signal/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-signal">
      {children}
    </span>
  )
}

function Flags({ project }) {
  if (!project.staging && !project.contributor && !project.desktopOnly) return null
  return (
    <span className="flex flex-wrap items-center gap-2">
      {project.staging && <Flag>Staging</Flag>}
      {project.contributor && <Flag>Contributor</Flag>}
      {project.desktopOnly && <Flag>Desktop-first</Flag>}
    </span>
  )
}

// What the fake browser bar says above each preview.
function frameLabel(project) {
  if (project.frameLabel) return project.frameLabel
  if (project.staging) return 'staging server'
  if (project.demo) return new URL(project.demo).host.replace(/^www\./, '')
  if (project.github) return `github.com${new URL(project.github).pathname}`
  return 'private'
}

// Covers for work that has nothing to screenshot (a CLI, a desktop app).
// They show real commands and facts, never an invented interface.
function Cover({ cover }) {
  if (cover.kind === 'terminal') {
    return (
      <div className="flex h-full flex-col justify-center gap-[0.7em] bg-[oklch(0.17_0.012_70)] px-[7%] font-mono text-[clamp(11px,1.35vw,15px)] leading-snug text-[oklch(0.9_0.012_85)]">
        {cover.lines.map((line) => (
          <p key={line} className={line.startsWith('#') ? 'text-[oklch(0.62_0.012_80)]' : ''}>
            {line.startsWith('$') ? (
              <>
                <span className="text-[oklch(0.74_0.16_268)]">$</span>
                {line.slice(1)}
              </>
            ) : (
              line
            )}
          </p>
        ))}
        <span aria-hidden="true" className="mt-1 inline-block h-[1.1em] w-[0.55em] bg-[oklch(0.9_0.012_85)]" />
      </div>
    )
  }
  return (
    <div className="flex h-full flex-col justify-between bg-signal p-[7%] text-signal-ink">
      <p className="display text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[0.95]">
        {cover.lines[0]}
        <br />
        <em className="!text-signal-ink/80">{cover.lines[1]}</em>
      </p>
      <p className="eyebrow !text-signal-ink/75">{cover.meta}</p>
    </div>
  )
}

// A project's preview inside a quiet browser frame.
function Preview({ project, sizes, eager = false, zoom = true }) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-rule bg-paper-deep shadow-[0_24px_60px_-32px_rgb(0_0_0/0.35)] transition-shadow duration-500 group-hover:shadow-[0_32px_70px_-30px_rgb(0_0_0/0.45)]">
      <div className="flex h-8 items-center gap-1.5 border-b border-rule px-3">
        <span className="size-2 rounded-full bg-rule" />
        <span className="size-2 rounded-full bg-rule" />
        <span className="size-2 rounded-full bg-rule" />
        <span className="ml-3 min-w-0 truncate font-mono text-[10.5px] tracking-[0.02em] text-mute">{frameLabel(project)}</span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.imageAlt ?? `${project.title} preview`}
            width={1600}
            height={1000}
            sizes={sizes}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            className={`size-full object-cover object-top ${zoom ? 'transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.035]' : ''}`}
          />
        ) : (
          project.cover && <Cover cover={project.cover} />
        )}
        {project.imageNote && (
          <span className="absolute bottom-3 left-3 rounded-full bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink backdrop-blur-sm">
            {project.imageNote}
          </span>
        )}
      </div>
    </div>
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
      {!project.demo && !project.github && <span className="py-3 text-sm text-mute">Private codebase</span>}
    </div>
  )
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
}
const rise = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

// Case-study body inside the dialog.
function Detail({ project }) {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      <motion.div variants={rise}>
        <Preview project={project} sizes="(min-width: 1024px) 832px, 100vw" eager zoom={false} />
      </motion.div>

      <div className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <motion.div variants={rise}>
            <Flags project={project} />
          </motion.div>
          <motion.p variants={rise} className="mt-4 text-[17px] leading-[1.65]">
            {project.summary}
          </motion.p>
          {project.problem && (
            <motion.figure variants={rise} className="mt-7 border-l-2 border-signal pl-5">
              <figcaption className="eyebrow mb-2 !text-signal">The problem</figcaption>
              <blockquote className="font-serif text-[1.3rem] italic leading-[1.3]">{project.problem}</blockquote>
            </motion.figure>
          )}
        </div>

        <div>
          <motion.p variants={rise} className="eyebrow mb-4">What I did</motion.p>
          <ol className="space-y-3">
            {project.features.map((feature, i) => (
              <motion.li key={feature} variants={rise} className="grid grid-cols-[2rem_1fr] text-[15px] leading-relaxed text-mute">
                <span className="eyebrow pt-[3px]">{pad(i + 1)}</span>
                {feature}
              </motion.li>
            ))}
          </ol>
        </div>
      </div>

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

// Case study: a bottom sheet on touch layouts (drag the handle down to close),
// a centred dialog on desktop (arrow keys step between projects).
function ProjectDialog({ project, index, total, isDesktop, onClose, onStep }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const bodyRef = useRef(null)
  const controls = useDragControls()
  useModalA11y(true, dialogRef, closeRef)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [project.id])

  const onKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowRight') onStep(1)
    if (e.key === 'ArrowLeft') onStep(-1)
  }

  const motionProps = isDesktop
    ? {
        initial: { opacity: 0, y: 24, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.98 },
        transition: { duration: 0.45, ease: EASE },
      }
    : {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
        transition: { duration: 0.5, ease: EASE },
        drag: 'y',
        dragListener: false,
        dragControls: controls,
        dragConstraints: { top: 0, bottom: 0 },
        dragElastic: { top: 0, bottom: 0.6 },
        onDragEnd: (_, info) => (info.offset.y > 110 || info.velocity.y > 600) && onClose(),
      }

  const stepClass =
    'inline-flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-mute hover:text-ink'

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 z-[74] bg-ink/50 backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onKeyDown={onKeyDown}
        className="fixed inset-x-0 bottom-0 z-[75] mx-auto flex max-h-[92svh] max-w-2xl flex-col rounded-t-[1.5rem] border border-b-0 border-rule bg-paper shadow-[0_-20px_60px_-20px_rgb(0_0_0/0.45)] lg:inset-0 lg:my-auto lg:h-fit lg:max-h-[90vh] lg:max-w-[56rem] lg:rounded-2xl lg:border-b lg:shadow-[0_40px_120px_-40px_rgb(0_0_0/0.55)]"
        {...motionProps}
      >
        <div
          className="shrink-0 touch-none px-6 pb-4 pt-3 lg:touch-auto lg:px-10 lg:pt-7"
          onPointerDown={(e) => !isDesktop && controls.start(e)}
        >
          <span aria-hidden="true" className="mx-auto mb-4 block h-1 w-10 rounded-full bg-rule lg:hidden" />
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="eyebrow mb-1.5">
                Case {pad(index + 1)} / {pad(total)}
              </p>
              <h3 className="display text-[1.9rem] leading-[1.05] lg:text-[2.6rem]">{project.title}</h3>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close project"
              className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full font-mono text-sm text-mute transition-colors hover:bg-paper-deep hover:text-ink"
            >
              ✕
            </button>
          </div>
        </div>

        <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-rule px-6 pb-8 pt-6 lg:px-10 lg:pt-8">
          <Detail key={project.id} project={project} />
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-rule px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:px-10">
          <button type="button" onClick={() => onStep(-1)} className={stepClass}>
            ← Prev
          </button>
          <span className="eyebrow hidden lg:inline">Use ← → to browse</span>
          <button type="button" onClick={() => onStep(1)} className={stepClass}>
            Next →
          </button>
        </div>
      </motion.div>
    </>
  )
}

function ProjectCard({ project, index, wide, onOpen }) {
  return (
    <Reveal as="li" delay={(index % 2) * 0.08} y={22} className={wide ? 'md:col-span-2' : ''}>
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className={`group block w-full cursor-pointer text-left ${wide ? 'lg:grid lg:grid-cols-12 lg:items-end lg:gap-12' : ''}`}
      >
        <div className={`transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-1 ${wide ? 'lg:col-span-8' : ''}`}>
          <Preview
            project={project}
            sizes={wide ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 768px) 50vw, 100vw'}
            eager={index === 0}
          />
        </div>

        <div className={`mt-6 grid grid-cols-[1.75rem_1fr_auto] items-baseline gap-x-3 ${wide ? 'lg:col-span-4 lg:mt-0 lg:pb-2' : ''}`}>
          <span className="eyebrow transition-colors duration-300 group-hover:!text-signal">{pad(index + 1)}</span>
          <span className="min-w-0">
            <span
              className={`display block leading-[1.02] transition-colors duration-300 group-hover:text-signal ${
                wide ? 'text-[clamp(2rem,3.6vw,3.25rem)]' : 'text-[clamp(1.75rem,2.6vw,2.4rem)]'
              }`}
            >
              {project.title}
            </span>
            <span className="mt-3 line-clamp-2 block text-[15px] leading-relaxed text-mute">{project.summary}</span>
            <span className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="eyebrow !normal-case !tracking-[0.04em]">{project.stack.slice(0, 3).join(' · ')}</span>
              <Flags project={project} />
            </span>
          </span>
          <span
            aria-hidden="true"
            className="font-mono text-lg text-mute transition-[transform,color] duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
          >
            ↗
          </span>
        </div>
      </button>
    </Reveal>
  )
}

export default function Projects() {
  const [openId, setOpenId] = useState(null)
  const isDesktop = useIsDesktop()
  const openIndex = projects.findIndex((p) => p.id === openId)
  const step = (dir) => setOpenId(projects[(openIndex + dir + projects.length) % projects.length].id)

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
      <ul className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:gap-x-14 lg:gap-y-24" aria-label="Projects">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} wide={i === 0} onOpen={() => setOpenId(project.id)} />
        ))}
      </ul>

      {/* Portalled so it sits above the page's own stacking context (and the floating pills). */}
      {createPortal(
        <AnimatePresence>
          {openIndex >= 0 && (
            <ProjectDialog
              project={projects[openIndex]}
              index={openIndex}
              total={projects.length}
              isDesktop={isDesktop}
              onClose={() => setOpenId(null)}
              onStep={step}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </Section>
  )
}
