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
    <div className="border-y border-[#e5e5e3] dark:border-[#1e1e1e] py-4 overflow-hidden bg-[#f4f4f2]/60 dark:bg-[#111]/60">
      <div className="flex animate-marquee whitespace-nowrap">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 mx-8 text-[10px] uppercase tracking-[0.2em] text-[#999] dark:text-[#444] font-medium"
          >
            {item}
            <span className="text-[#f97316]">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
