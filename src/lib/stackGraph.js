import { projects } from '../data/projects'
import { resolveTech } from './tech'

// Nicer display labels for keys that merge several raw stack labels
// (e.g. "Django", "Django/DRF" and "Django REST Framework" all become django).
const LABELS = {
  django: 'Django',
  node: 'Node.js',
  nuxt: 'Nuxt',
  vue: 'Vue',
  tailwind: 'Tailwind CSS',
  typescript: 'TypeScript',
  postgresql: 'PostgreSQL',
  firebase: 'Firebase',
}

function prettify(key) {
  if (LABELS[key]) return LABELS[key]
  return key.charAt(0).toUpperCase() + key.slice(1)
}

/**
 * Builds the tool graph from real shipped projects: every tool that appears in
 * a project's stack becomes a node, and every pair of tools used together on a
 * project becomes an edge weighted by how many projects share them.
 * Computed once at module load — the constellation never re-parses this.
 */
export function buildStackGraph() {
  const nodes = new Map() // key -> { key, label, color }
  const links = new Map() // "a|b" (sorted) -> { source, target, count, projects: [] }

  for (const project of projects) {
    const keys = []
    const seen = new Set()
    for (const item of project.stack) {
      const resolved = resolveTech(item)
      if (!resolved || seen.has(resolved.key)) continue
      seen.add(resolved.key)
      keys.push(resolved.key)
      if (!nodes.has(resolved.key)) {
        nodes.set(resolved.key, { key: resolved.key, label: prettify(resolved.key), color: resolved.color })
      } else if (!LABELS[resolved.key]) {
        // keep the nicest raw label seen so far
        const node = nodes.get(resolved.key)
        if (item.length < node.label.length && /^[A-Za-z0-9. #/-]+$/.test(item)) node.label = item
      }
    }
    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        const [a, b] = [keys[i], keys[j]].sort()
        const id = `${a}|${b}`
        const link = links.get(id) ?? { source: a, target: b, count: 0, projects: [] }
        link.count += 1
        if (!link.projects.includes(project.title)) link.projects.push(project.title)
        links.set(id, link)
      }
    }
  }

  return {
    nodes: [...nodes.values()],
    links: [...links.values()],
  }
}

const cache = buildStackGraph()

/**
 * Deterministic orbital layout. Higher-degree tools sit closer to the centre;
 * the rest spread evenly on rings. No randomness — identical output every run.
 */
export function getStackLayout() {
  const degrees = new Map(cache.nodes.map((n) => [n.key, 0]))
  for (const l of cache.links) {
    degrees.set(l.source, degrees.get(l.source) + 1)
    degrees.set(l.target, degrees.get(l.target) + 1)
  }

  const sorted = [...cache.nodes].sort(
    (a, b) => degrees.get(b.key) - degrees.get(a.key) || a.key.localeCompare(b.key),
  )
  const [hub] = sorted
  const positions = new Map([[hub.key, { x: 50, y: 50 }]])

  const rings = [
    sorted.filter((n) => n.key !== hub.key && degrees.get(n.key) >= 5),
    sorted.filter((n) => n.key !== hub.key && degrees.get(n.key) >= 3 && degrees.get(n.key) < 5),
    sorted.filter((n) => n.key !== hub.key && degrees.get(n.key) < 3),
  ]
  const radii = [
    { rx: 22, ry: 25 },
    { rx: 33, ry: 31 },
    { rx: 41, ry: 37 },
  ]
  let goldenOffset = Math.PI / 6
  rings.forEach((ring, ringIndex) => {
    ring.forEach((node, i) => {
      const angle =
        (i / ring.length) * Math.PI * 2 +
        goldenOffset +
        ((i % 2) * Math.PI) / ring.length // interleave to reduce overlapping lines
      const { rx, ry } = radii[ringIndex]
      positions.set(node.key, {
        x: 50 + Math.cos(angle) * rx,
        y: 50 + Math.sin(angle) * ry,
      })
      goldenOffset += 2.399963 // golden-angle drift per ring keeps things organic
    })
  })

  const neighbours = new Map(cache.nodes.map((n) => [n.key, new Set()]))
  for (const l of cache.links) {
    neighbours.get(l.source).add(l.target)
    neighbours.get(l.target).add(l.source)
  }

  return {
    nodes: cache.nodes,
    links: cache.links,
    hubKey: hub?.key ?? null,
    positions,
    degrees,
    neighbours,
  }
}
