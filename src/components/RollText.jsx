// Text that rolls up and is replaced by a copy on hover. The parent must carry
// the `group/roll` class (a link or button) so the whole hit area triggers it.
export default function RollText({ children, className = '' }) {
  return (
    <span className={`relative inline-block overflow-hidden align-bottom ${className}`}>
      <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/roll:-translate-y-full group-focus-visible/roll:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute left-0 top-full block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/roll:-translate-y-full group-focus-visible/roll:-translate-y-full"
      >
        {children}
      </span>
    </span>
  )
}
