import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function About() {
  return (
    <section id="about" className="py-24 border-t border-[#e5e5e3] dark:border-[#2a2a2a]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <p className="text-xs text-[#aaa] dark:text-[#555] uppercase tracking-widest mb-4">About</p>

          <h2 className="text-3xl md:text-4xl font-semibold text-[#111] dark:text-[#f0f0ee] leading-tight tracking-tight mb-8">
            Building backend systems<br className="hidden md:block" /> that actually work.
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4 text-[#444] dark:text-[#bbb] text-base leading-relaxed">
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

            <div className="space-y-6">
              <div>
                <p className="text-xs text-[#aaa] dark:text-[#555] uppercase tracking-widest mb-3">Education</p>
                <div>
                  <p className="text-sm font-medium text-[#111] dark:text-[#f0f0ee]">BSc Biological Sciences</p>
                  <p className="text-sm text-[#888] dark:text-[#666]">University of Ghana &middot; 2021 – 2024</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-[#aaa] dark:text-[#555] uppercase tracking-widest mb-3">Certifications</p>
                <ul className="space-y-1.5">
                  {[
                    'ALX Professional Foundations',
                    'ALX Software Engineering — Python Backend',
                    'ALX Cybersecurity Program',
                  ].map((cert) => (
                    <li key={cert} className="text-sm text-[#555] dark:text-[#aaa] flex items-start gap-2">
                      <span className="text-[#bbb] dark:text-[#444] mt-0.5">—</span>
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs text-[#aaa] dark:text-[#555] uppercase tracking-widest mb-3">Languages</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { lang: 'English', level: 'Expert' },
                    { lang: 'Twi', level: 'Expert' },
                    { lang: 'French', level: 'Intermediate' },
                  ].map(({ lang, level }) => (
                    <span key={lang} className="text-sm text-[#555] dark:text-[#aaa]">
                      {lang} <span className="text-[#aaa] dark:text-[#555]">({level})</span>
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
