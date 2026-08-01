import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function About() {
  return (
    <section id="about" className="py-28 border-t border-border">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono text-brand">01</span>
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground/60">About</span>
          </div>

          <h2 className="font-display font-black text-4xl md:text-5xl text-foreground leading-[1.05] tracking-tight mb-10">
            Building backend systems
            <br className="hidden md:block" />
            <span className="text-brand"> that actually work.</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4 text-muted-foreground text-base leading-relaxed">
              <p>
                I'm a Software Developer at Rigelis Inc. based in Accra, Ghana,
                building backend-focused full-stack products, internal tools,
                and healthcare and operations systems.
              </p>
              <p>
                My work spans Django and Django REST Framework, Node.js, React,
                PostgreSQL, authentication, RBAC, API integration, debugging,
                and deployment support. A cybersecurity background shapes how I
                think about access control, data privacy, and reliability.
              </p>
              <p>
                Recent work includes hospital inventory and ordering workflows,
                AssetTrack Pro, open-source mapping tooling, and MarianSave, an
                offline-first desktop finance tracker.
              </p>
            </div>

            <div className="space-y-7">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 mb-3">Education</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">BSc Biological Sciences (Biochemistry &amp; Plant Biology)</p>
                  <p className="text-sm text-muted-foreground">University of Ghana · 2021 - 2024</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 mb-3">Certifications</p>
                <ul className="space-y-2">
                  {[
                    'ALX Software Engineering Program - Python Backend Development',
                    'ALX Cybersecurity Program',
                    'ALX Professional Foundations',
                  ].map((cert) => (
                    <li key={cert} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-brand mt-0.5 shrink-0">-</span>
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 mb-3">Languages</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { lang: 'English', level: 'Expert' },
                    { lang: 'Twi', level: 'Expert' },
                    { lang: 'French', level: 'Intermediate' },
                  ].map(({ lang, level }) => (
                    <span key={lang} className="text-sm text-muted-foreground">
                      {lang} <span className="text-muted-foreground/50 text-xs">({level})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
