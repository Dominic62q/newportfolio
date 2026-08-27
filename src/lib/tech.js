import {
  SiPython,
  SiDjango,
  SiNodedotjs,
  SiRedis,
  SiReact,
  SiTypescript,
  SiNuxt,
  SiVuedotjs,
  SiTailwindcss,
  SiPostgresql,
  SiMysql,
  SiSqlite,
  SiFirebase,
  SiCloudinary,
  SiGit,
  SiGithub,
  SiLinux,
  SiPostman,
  SiVite,
  SiDocker,
  SiTauri,
} from 'react-icons/si'

// Real brand logos + their Simple Icons brand hex.
const KEY_TO_TECH = {
  python: { icon: SiPython, color: '#3776AB' },
  django: { icon: SiDjango, color: '#0C4B33' },
  node: { icon: SiNodedotjs, color: '#339933' },
  redis: { icon: SiRedis, color: '#DC382D' },
  react: { icon: SiReact, color: '#61DAFB' },
  typescript: { icon: SiTypescript, color: '#3178C6' },
  nuxt: { icon: SiNuxt, color: '#00DC82' },
  vue: { icon: SiVuedotjs, color: '#42B883' },
  tailwind: { icon: SiTailwindcss, color: '#38BDF8' },
  postgresql: { icon: SiPostgresql, color: '#4169E1' },
  mysql: { icon: SiMysql, color: '#4479A1' },
  sqlite: { icon: SiSqlite, color: '#0F80CC' },
  firebase: { icon: SiFirebase, color: '#FFCA28' },
  cloudinary: { icon: SiCloudinary, color: '#3448C5' },
  git: { icon: SiGit, color: '#F05032' },
  github: { icon: SiGithub, color: '#E1E4E8' },
  linux: { icon: SiLinux, color: '#FCC624' },
  postman: { icon: SiPostman, color: '#FF6C37' },
  vite: { icon: SiVite, color: '#A259FF' },
  docker: { icon: SiDocker, color: '#2496ED' },
  tauri: { icon: SiTauri, color: '#FFC807' },
}

// Map messy data labels onto the keys above.
const ALIAS = {
  'django rest framework': 'django',
  'django drf': 'django',
  'django templates': 'django',
  'linux bash': 'linux',
  'postman swagger': 'postman',
}

function normalize(label) {
  return label
    .toLowerCase()
    .replace(/\//g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+basics$/, '')
    .replace(/\s+templates$/, '')
    .trim()
}

export function resolveTech(label) {
  if (!label) return null
  const norm = normalize(label)
  const key = ALIAS[norm] ?? norm
  const resolved = KEY_TO_TECH[key]
  return resolved ? { key, ...resolved } : null
}
