import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function About() {
  return (
    <section id="about" className="py-28 border-t border-[#e5e5e3] dark:border-[#1e1e1e]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          {/* Section label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono text-[#f97316]">01</span>
            <span className="text-xs uppercase tracking-[0.18em] text-[#aaa] dark:text-[#555]">About</span>
          </div>

          <h2 className="font-display font-black text-4xl md:text-5xl text-[#111] dark:text-[#f0f0ee] leading-[1.05] tracking-tight mb-10">
            Building backend systems<br className="hidden md:block" />
            <span className="text-[#f97316]"> that actually work.</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4 text-[#555] dark:text-[#999] text-base leading-relaxed">
              <p>
                I'm a backend-focused developer based in Accra, Ghana. I build
                web applications and REST APIs using Python, Django, and Django
                REST Framework — with enough frontend experience to ship
                complete products.
              </p>
              <p>
                I focus on backend logic, authentication, permissions, database
                design, and clean integration between systems. I care about
                building things that are practical and maintainable.
              </p>
              <p>
                Currently working in software systems support at Rigelis Inc.,
                and actively seeking roles in backend or full-stack development.
              </p>
            </div>

            <div className="space-y-7">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#aaa] dark:text-[#555] mb-3">Education</p>
                <div>
                  <p className="text-sm font-semibold text-[#111] dark:text-[#f0f0ee]">BSc Biological Sciences</p>
                  <p className="text-sm text-[#999] dark:text-[#666]">University of Ghana · 2021 — 2024</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#aaa] dark:text-[#555] mb-3">Certifications</p>
                <ul className="space-y-2">
                  {[
                    'ALX Professional Foundations',
                    'ALX Software Engineering — Python Backend',
                    'ALX Cybersecurity Program',
                  ].map((cert) => (
                    <li key={cert} className="text-sm text-[#666] dark:text-[#aaa] flex items-start gap-2">
                      <span className="text-[#f97316] mt-0.5 shrink-0">—</span>
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#aaa] dark:text-[#555] mb-3">Languages</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { lang: 'English', level: 'Expert' },
                    { lang: 'Twi', level: 'Expert' },
                    { lang: 'French', level: 'Intermediate' },
                  ].map(({ lang, level }) => (
                    <span key={lang} className="text-sm text-[#555] dark:text-[#aaa]">
                      {lang} <span className="text-[#bbb] dark:text-[#555] text-xs">({level})</span>
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
