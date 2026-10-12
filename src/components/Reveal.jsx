import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

// Scroll-triggered fade-up used across sections. Reduced motion is handled
// globally by <MotionConfig reducedMotion="user"> in App.
export default function Reveal({ children, delay = 0, y = 28, as = 'div', className, ...rest }) {
  const Component = motion[as]
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  )
}
