import Reveal from './Reveal'
import Section from './Section'

const strengths = [
  {
    title: 'Backend Systems',
    description:
      'Design and improve robust backend systems with Django, DRF, and Node.js across authentication, permissions, APIs, and business logic.',
  },
  {
    title: 'REST API Design',
    description:
      'Build practical REST APIs that frontend clients and internal tools can rely on, with clear structure, filtering, and maintainable integration points.',
  },
  {
    title: 'Database Design',
    description:
      'Model relational data carefully from the start with PostgreSQL, MySQL, and SQLite, including query debugging and workflow-aware schema decisions.',
  },
  {
    title: 'Frontend Integration',
    description:
      'Connect backend logic to usable interfaces with React, Nuxt, and Django templates while keeping frontend-backend workflows clean.',
  },
  {
    title: 'Secure Product Thinking',
    description:
      'Apply cybersecurity awareness to access control, authentication flows, input handling, privacy, and safer operational user experiences.',
  },
  {
    title: 'Debugging & Delivery',
    description:
      'Diagnose API, database, UI, deployment, and workflow issues, then document fixes, support testing, and help teams ship reliably.',
  },
]

const numerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi']

// The same content is drawn twice: ink on paper below, paper on ink above. The top
// layer is revealed by a circle that grows from wherever the pointer entered.
function CardFace({ item, numeral, inverted }) {
  return (
    <div className={`p-8 md:p-10 ${inverted ? 'bg-ink text-paper' : ''}`}>
      <span className={`font-serif text-4xl italic leading-none ${inverted ? 'text-paper' : 'text-signal'}`}>{numeral}.</span>
      <h3 className="display mt-14 text-[clamp(1.75rem,2.4vw,2.35rem)] md:mt-20">{item.title}</h3>
      <p className={`mt-4 text-[15px] leading-[1.65] ${inverted ? 'text-paper/75' : 'text-mute'}`}>{item.description}</p>
    </div>
  )
}

function Capability({ item, numeral, index }) {
  const setOrigin = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }
  return (
    <Reveal delay={(index % 3) * 0.07} y={22} className="-ml-px border-b border-r border-t border-rule">
      <div
        onPointerEnter={setOrigin}
        onPointerLeave={setOrigin}
        className="group relative overflow-hidden [--x:50%] [--y:50%]"
      >
        <CardFace item={item} numeral={numeral} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [clip-path:circle(0px_at_var(--x)_var(--y))] transition-[clip-path] duration-[800ms] ease-[var(--ease-out-expo)] group-hover:[clip-path:circle(160%_at_var(--x)_var(--y))]"
        >
          <CardFace item={item} numeral={numeral} inverted />
        </div>
      </div>
    </Reveal>
  )
}

export default function Strengths() {
  return (
    <Section id="strengths" index="05" label="Capabilities" title="What I do *well.*">
      <div className="grid border-l border-rule sm:grid-cols-2 lg:grid-cols-3">
        {strengths.map((s, i) => (
          <Capability key={s.title} item={s} numeral={numerals[i]} index={i} />
        ))}
      </div>
    </Section>
  )
}
