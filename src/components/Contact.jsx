import { useState } from 'react'
import emailjs from '@emailjs/browser'
import Magnetic from './Magnetic'
import Reveal from './Reveal'
import RollText from './RollText'
import Section from './Section'

const EMAIL = 'dominicquainoo62@gmail.com'

const links = [
  { label: 'GitHub', href: 'https://github.com/Dominic62q' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dominic-amuah' },
]

const fieldClass =
  'peer w-full border-0 border-b border-rule bg-transparent px-0 py-3 text-[17px] text-ink outline-none transition-colors placeholder:text-mute/60 focus:border-signal focus-visible:outline-none'

function Field({ id, label, children }) {
  return (
    <div className="group">
      <label htmlFor={id} className="eyebrow block transition-colors group-focus-within:!text-signal">
        {label}
      </label>
      {children}
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [sending, setSending] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setStatus({ type: '', message: '' })
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: EMAIL,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      setStatus({ type: 'success', message: "Message sent. I'll get back to you soon." })
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus({
        type: 'error',
        message: `Failed to send. Email me directly at ${EMAIL}`,
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <Section
      id="contact"
      index="06"
      label="Contact"
      title="Let's work *together.*"
    >
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-5">
          <p className="max-w-[34ch] font-serif text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.2]">
            Open to backend, full-stack, and API-focused roles. If you're building something that has to work, say
            hello.
          </p>

          <div className="mt-10 border-t border-rule pt-6">
            <p className="eyebrow">Email</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <a href={`mailto:${EMAIL}`} className="link-u break-all text-[17px] font-medium hover:text-signal">
                {EMAIL}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex h-8 items-center rounded-full border border-rule px-3 font-mono text-[11px] uppercase tracking-[0.1em] text-mute transition-colors hover:border-ink hover:text-ink"
              >
                <span aria-live="polite">{copied ? 'Copied ✓' : 'Copy'}</span>
              </button>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-8">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-u inline-flex min-h-11 items-center text-[15px] hover:text-signal"
                  >
                    {label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <form onSubmit={handleSubmit} aria-labelledby="contact-heading" className="space-y-9">
            <div className="grid gap-9 md:grid-cols-2">
              <Field id="name" label="Name">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  placeholder="Your name"
                  className={fieldClass}
                />
              </Field>
              <Field id="email" label="Email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@company.com"
                  className={fieldClass}
                />
              </Field>
            </div>

            <Field id="message" label="Message">
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="What are you working on?"
                className={`${fieldClass} resize-none`}
              />
            </Field>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Magnetic strength={0.3}>
                <button
                  type="submit"
                  disabled={sending}
                  className="group/roll group inline-flex h-14 items-center gap-3 rounded-full bg-ink px-8 text-[15px] font-medium text-paper transition-colors hover:bg-signal hover:text-signal-ink disabled:opacity-60"
                >
                  <RollText>{sending ? 'Sending…' : 'Send message'}</RollText>
                  {!sending && <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>}
                </button>
              </Magnetic>

              {status.message && (
                <p
                  role={status.type === 'error' ? 'alert' : 'status'}
                  aria-live={status.type === 'error' ? 'assertive' : 'polite'}
                  aria-atomic="true"
                  className={`text-sm ${status.type === 'success' ? 'text-signal' : 'text-destructive'}`}
                >
                  {status.message}
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  )
}
