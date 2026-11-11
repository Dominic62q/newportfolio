import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

// Scroll-triggered fade-up used across sections. Reduced motion is handled
// globally by <MotionConfig reducedMotion="user"> in App.
export default function Reveal({ children, delay = 0, y = 18, as = 'div', className, ...rest }) {
  const Component = motion[as]
  const offset = useReducedMotion() ? 0 : y
  // A full `transform` string (not `y`) lets Motion hand the animation to the
  // compositor, so reveals don't restyle and repaint the page on every frame.
  return (
    <Component
      initial={{ opacity: 0, transform: `translateY(${offset}px)` }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.65, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  )
}
