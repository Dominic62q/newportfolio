import Reveal from './Reveal'
import Section from './Section'
import { experiences } from '../data/experience'

export default function Experience() {
  return (
    <Section
      id="experience"
      index="04"
      label="Experience"
      title="Where I've *worked.*"
    >
      <div>
        {experiences.map((exp, i) => (
          <Reveal
            key={exp.id}
            delay={i * 0.06}
            as="article"
            className="grid gap-6 border-t border-rule py-10 last:border-b md:py-14 lg:grid-cols-12 lg:gap-16"
          >
            <div className="lg:col-span-4">
              <p className="eyebrow !text-signal">{exp.period}</p>
              <h3 className="display mt-4 text-[clamp(2rem,3.4vw,3.25rem)]">{exp.role}</h3>
              <p className="mt-3 text-[17px] text-mute">{exp.company}</p>
            </div>

            <ul className="lg:col-span-8">
              {exp.bullets.map((bullet, idx) => (
                <li
                  key={bullet}
                  className="grid grid-cols-[2.25rem_1fr] border-b border-rule py-4 text-[16px] leading-[1.65] first:pt-0 last:border-b-0 last:pb-0"
                >
                  <span className="eyebrow pt-[5px]">{String(idx + 1).padStart(2, '0')}</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
