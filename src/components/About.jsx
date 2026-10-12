import Reveal from './Reveal'
import ScrollWords from './ScrollWords'
import Section from './Section'

const certifications = [
  'ALX Software Engineering Program: Python Backend Development',
  'ALX Cybersecurity Program',
  'ALX Professional Foundations',
]

const languages = [
  { lang: 'English', level: 'Expert' },
  { lang: 'Twi', level: 'Expert' },
  { lang: 'French', level: 'Intermediate' },
]

function Fact({ label, children }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-t border-rule py-5">
      <dt className="eyebrow pt-1">{label}</dt>
      <dd className="text-[15px] leading-relaxed">{children}</dd>
    </div>
  )
}

export default function About() {
  return (
    <Section id="about" index="01" label="About">
      <ScrollWords
        id="about-heading"
        text="I'm a software developer in Accra, building *backend-focused* full-stack products, internal tools, and healthcare and operations systems."
        className="font-serif text-[clamp(2rem,4.6vw,4.5rem)] leading-[1.06] tracking-[-0.02em] md:max-w-[22ch] lg:max-w-[26ch]"
      />

      <div className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-12 lg:gap-20">
        <Reveal className="space-y-6 text-[17px] leading-[1.7] text-mute lg:col-span-6">
          <p>
            My work spans Django and Django REST Framework, Node.js, React, PostgreSQL, authentication, RBAC, API
            integration, debugging, and deployment support. A cybersecurity background shapes how I think about
            access control, data privacy, and reliability.
          </p>
          <p>
            Recent work includes hospital inventory and ordering workflows, AssetTrack Pro, open-source mapping
            tooling, and MarianSave, an offline-first desktop finance tracker.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-6">
          <dl className="border-b border-rule">
            <Fact label="Education">
              <p className="font-medium">BSc Biological Sciences (Biochemistry &amp; Plant Biology)</p>
              <p className="text-mute">University of Ghana · 2021 – 2024</p>
            </Fact>
            <Fact label="Certified">
              <ul className="space-y-1.5">
                {certifications.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </Fact>
            <Fact label="Languages">
              <ul className="flex flex-wrap gap-x-6 gap-y-1">
                {languages.map(({ lang, level }) => (
                  <li key={lang}>
                    {lang} <span className="text-mute">({level})</span>
                  </li>
                ))}
              </ul>
            </Fact>
          </dl>
        </Reveal>
      </div>
    </Section>
  )
}
