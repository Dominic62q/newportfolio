import { motion } from 'framer-motion'
import { EASE_OUT } from '../lib/motion'
import Reveal from './Reveal'
import SplitHeading from './SplitHeading'

// Shared section frame: a numbered caption row whose hairline draws in, then the
// serif heading (words rise out of a mask). `title` marks accent words with *asterisks*.
export default function Section({ id, index, label, aside, title, children, className = '' }) {
  return (
    <section id={id} className={`border-t border-rule ${className}`} aria-labelledby={`${id}-heading`}>
      <div className="container-x py-24 md:py-36">
        <div className="relative flex items-baseline justify-between gap-6 pb-4">
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-rule"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
          />
          <Reveal y={12} className="w-full">
            <div className="flex items-baseline justify-between gap-6">
              <p className="eyebrow">
                <span className="text-signal">({index})</span>
                <span className="ml-3">{label}</span>
              </p>
              {aside}
            </div>
          </Reveal>
        </div>

        {title && (
          <SplitHeading
            id={`${id}-heading`}
            text={title}
            className="display mt-12 max-w-[16ch] text-[clamp(2.75rem,7vw,6.5rem)] md:mt-16"
          />
        )}

        <div className={title ? 'mt-14 md:mt-20' : 'mt-12 md:mt-16'}>{children}</div>
      </div>
    </section>
  )
}
