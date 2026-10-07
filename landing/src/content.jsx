// All copy for the page lives here, so edits don't mean touching components.
import Out from './components/ExternalLink'

// Sections that can be switched off without deleting them.
export const sections = {
  experience: false,
}

export const links = {
  linkedin: 'https://www.linkedin.com/in/blnkhz/',
  studio: 'https://latestagehumanism.com',
  losien: 'https://losien.to',
  plotter: 'https://blnkhz.github.io/plotter-tools',
  resume: `${import.meta.env.BASE_URL}blanka-hooz-resume.pdf`,
}

export const about = {
  heading: 'XP',
  lede: "Full-stack software engineer with seven years of shipping web applications. I specialise in user interfaces, design systems and accessibility, and I'm happy owning a feature from the API to the last pixel.",
  body: (
    <>
      I&apos;ve built inside the microservice maze of a big blue cloud provider
      and as one of the first engineers at early-stage startups. Today I&apos;m
      at LateStageHumanism, a small studio in Los Angeles, building{' '}
      <Out href={links.losien}>losien.to</Out>, trying to preserve what's left
      of the honest, unoptimized, human side of the internet.
    </>
  ),
  facts: [
    [
      'now',
      <>
        <Out href={links.studio}>latestagehumanism.com</Out>, building{' '}
        <Out href={links.losien}>losien.to</Out>
      </>,
    ],
    ['based', 'Los Angeles, CA'],
    ['speaks', 'English, Hungarian & (some) Spanish'],
  ],
}

export const jobs = [
  {
    when: '2025 – now',
    current: true,
    company: 'latestagehumanism.com',
    href: links.studio,
    role: 'Software engineer · Los Angeles',
    summary: (
      <>
        Building <Out href={links.losien}>losien.to</Out>, a place to leave a
        thought where you&apos;re standing. No feed, no followers, no algorithm.
      </>
    ),
  },
  {
    when: '2023 – 2025',
    company: 'Startups',
    role: 'Full stack software engineer',
    summary:
      'One of the first engineers on a marketing product with POS integration. Set up the front-end architecture and was a key contributor to its design system.',
  },
  {
    when: '2019 – 2023',
    company: 'Big blue cloud provider',
    role: 'Full stack software engineer',
    summary:
      'Internal tools and client-facing apps across a sprawling microservice ecosystem, with a focus on accessibility, internationalisation and the internal design system.',
  },
  {
    when: '2018 – 2019',
    company: 'Coding bootcamp',
    role: 'Software developer mentor · Budapest',
    summary:
      "Mentored 60+ students through Hungary's first coding bootcamp, from zero to their first developer job.",
  },
]

export const toolkit = [
  [
    'build',
    [
      'React',
      'React Native',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Python',
      'GraphQL',
      'Playwright',
    ],
  ],
  [
    'craft',
    [
      'Design systems',
      'Accessibility',
      'Motion',
      'Three.js / WebGL',
      'Core Web Vitals',
      'Figma',
    ],
  ],
  ['ai', ['Agentic coding', 'Claude Code', 'Cursor', 'MCP', 'LLM APIs']],
]

export const hobbies = [
  { label: '3D modeling' },
  { label: 'Illustration' },
  { label: 'Pen plotting' },
  { label: 'Lino printing' },
  { label: 'Generative art' },
]

export const hobbiesNote = 'always making something'
