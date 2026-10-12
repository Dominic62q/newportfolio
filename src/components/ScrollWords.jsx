import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { parseEmphasis, plainText } from '../lib/motion'

function Word({ word, index, count, progress }) {
  // Each word owns a slice of the scroll range and fades from faint to full ink.
  const start = (index / count) * 0.85
  const end = start + 0.15
  const opacity = useTransform(progress, [start, end], [0.16, 1])
  const y = useTransform(progress, [start, end], [6, 0])
  return (
    <motion.span style={{ opacity, y }} className={`inline-block will-change-[opacity,transform] ${word.em ? 'italic text-signal' : ''}`}>
      {word.text}
    </motion.span>
  )
}

// A statement that "reads itself" as you scroll through it.
export default function ScrollWords({ text, id, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.88', 'end 0.45'] })
  const words = parseEmphasis(text)

  return (
    <h2 ref={ref} id={id} className={className}>
      <span className="sr-only">{plainText(text)}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={`${word.text}-${i}`}>
            <Word word={word} index={i} count={words.length} progress={scrollYProgress} />
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </h2>
  )
}
