const items = [
  'Backend Developer',
  'Django',
  'REST APIs',
  'PostgreSQL',
  'React',
  'Python',
  'Open to Work',
  'Accra, Ghana',
]

export default function Marquee() {
  const repeated = [...items, ...items, ...items]
  return (
    <div className="border-y border-border py-3.5 overflow-hidden bg-muted/60">
      <div className="flex animate-marquee whitespace-nowrap">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 mx-8 text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium"
          >
            {item}
            <span className="text-brand">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
