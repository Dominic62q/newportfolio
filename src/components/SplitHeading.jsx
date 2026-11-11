import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT, parseEmphasis, plainText } from '../lib/motion'

// Heading whose words rise out of a mask, staggered, when scrolled into view.
// `text` uses *asterisks* to mark italic/accent words.
export default function SplitHeading({ text, as = 'h2', id, className = '', delay = 0 }) {
  const Tag = motion[as]
  const reduced = useReducedMotion()
  const words = parseEmphasis(text)

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{plainText(text)}</span>
      <span aria-hidden="true">
        {words.map((word, i) => {
          const inner = (
            <span className="-mr-[0.12em] inline-block overflow-hidden pb-[0.14em] pr-[0.12em] align-bottom -mb-[0.14em]">
              <motion.span
                className="inline-block"
                initial={{ transform: reduced ? 'none' : 'translateY(115%) rotate(4deg)' }}
                whileInView={{ transform: reduced ? 'none' : 'translateY(0%) rotate(0deg)' }}
                viewport={{ once: true, margin: '-12% 0px' }}
                transition={{ duration: 1.1, delay: delay + i * 0.08, ease: EASE_OUT }}
              >
                {word.text}
              </motion.span>
            </span>
          )
          return (
            <span key={`${word.text}-${i}`}>
              {word.em ? <em>{inner}</em> : inner}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          )
        })}
      </span>
    </Tag>
  )
}
