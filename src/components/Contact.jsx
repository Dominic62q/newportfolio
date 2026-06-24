import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

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
    <section id="contact" className="py-28 border-t border-border">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-brand">06</span>
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground/60">Contact</span>
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-foreground leading-[1.05] tracking-tight">
            Let's work together.
          </h2>
          <p className="mt-4 text-muted-foreground text-base max-w-md">
            Open to backend, full-stack, and API-focused roles. Feel free to reach out.
          </p>

          <div className="flex flex-wrap gap-5 mt-7">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-brand transition-colors"
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
          className="max-w-lg"
        >
          <Card className="border-border bg-card shadow-none">
            <CardContent className="space-y-5 px-(--card-spacing) py-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="h-12 rounded-xl border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus-visible:border-brand focus-visible:ring-brand/20"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="h-12 rounded-xl border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus-visible:border-brand focus-visible:ring-brand/20"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="What are you working on?"
                  className="min-h-36 rounded-xl border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus-visible:border-brand focus-visible:ring-brand/20"
                />
              </div>

              {status.message && (
                <p className={`text-sm ${status.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {status.message}
                </p>
              )}

              <Button
                type="submit"
                disabled={sending}
                size="lg"
                className="rounded-full bg-brand px-6 text-brand-foreground hover:brightness-90"
              >
                {sending ? 'Sending...' : 'Send Message'}
                {!sending && (
                  <ArrowUpRight className="size-2.5" />
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.form>
      </div>
    </section>
  )
}
