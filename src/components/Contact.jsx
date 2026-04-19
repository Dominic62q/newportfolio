import { useState } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'

const links = [
  { label: 'GitHub', href: 'https://github.com/Dominic62q' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dominic-amuah' },
  { label: 'Email', href: 'mailto:dominicquainoo62@gmail.com' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

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
          to_email: 'dominicquainoo62@gmail.com',
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      setStatus({ type: 'success', message: "Message sent. I'll get back to you soon." })
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus({
        type: 'error',
        message: 'Failed to send. Email me directly at dominicquainoo62@gmail.com',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="py-28 border-t border-[#e5e5e3] dark:border-[#1e1e1e]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-[#f97316]">06</span>
            <span className="text-xs uppercase tracking-[0.18em] text-[#aaa] dark:text-[#555]">Contact</span>
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-[#111] dark:text-[#f0f0ee] leading-[1.05] tracking-tight">
            Let's work together.
          </h2>
          <p className="mt-4 text-[#777] dark:text-[#888] text-base max-w-md">
            Open to backend, full-stack, and API-focused roles. Feel free to reach out.
          </p>

          <div className="flex flex-wrap gap-5 mt-7">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="text-sm text-[#999] dark:text-[#666] hover:text-[#f97316] dark:hover:text-[#f97316] transition-colors"
              >
                {label} ↗
              </a>
            ))}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-5 max-w-lg"
        >
          <div>
            <label htmlFor="name" className="block text-[10px] text-[#aaa] dark:text-[#555] uppercase tracking-[0.15em] mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full px-4 py-3 text-sm border border-[#e5e5e3] dark:border-[#1e1e1e] rounded-xl bg-white dark:bg-[#111] text-[#111] dark:text-[#f0f0ee] placeholder-[#ccc] dark:placeholder-[#333] focus:outline-none focus:border-[#f97316] dark:focus:border-[#f97316] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[10px] text-[#aaa] dark:text-[#555] uppercase tracking-[0.15em] mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-3 text-sm border border-[#e5e5e3] dark:border-[#1e1e1e] rounded-xl bg-white dark:bg-[#111] text-[#111] dark:text-[#f0f0ee] placeholder-[#ccc] dark:placeholder-[#333] focus:outline-none focus:border-[#f97316] dark:focus:border-[#f97316] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-[10px] text-[#aaa] dark:text-[#555] uppercase tracking-[0.15em] mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="What are you working on?"
              className="w-full px-4 py-3 text-sm border border-[#e5e5e3] dark:border-[#1e1e1e] rounded-xl bg-white dark:bg-[#111] text-[#111] dark:text-[#f0f0ee] placeholder-[#ccc] dark:placeholder-[#333] focus:outline-none focus:border-[#f97316] dark:focus:border-[#f97316] transition-colors resize-none"
            />
          </div>

          {status.message && (
            <p className={`text-sm ${status.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#f97316] hover:bg-[#ea6c00] text-white text-sm font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? 'Sending…' : 'Send Message'}
            {!sending && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  )
}
