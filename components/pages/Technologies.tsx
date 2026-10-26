import type { SimpleIcon } from "simple-icons"
import {
  siAndroid,
  siApple,
  siClaude,
  siDigitalocean,
  siDocker,
  siFigma,
  siFirebase,
  siGit,
  siGithub,
  siGithubcopilot,
  siIonic,
  siJavascript,
  siLaravel,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siPhp,
  siPostgresql,
  siPrisma,
  siReact,
  siReacthookform,
  siRedux,
  siSass,
  siShadcnui,
  siStorybook,
  siStripe,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVuedotjs,
  siWoocommerce,
  siWordpress,
  siZod,
} from "simple-icons"
import type { LucideIcon } from "lucide-react"
import { Braces, RefreshCw, Workflow } from "lucide-react"
import Image from "next/image"
import { SECTION_TITLES } from "@/lib/constants"
import TechHoverCard from "@/components/shared/TechHoverCard"
import { Reveal } from "@/components/shared"

// Local constants - only used in this component (outside component to avoid recreation)
// Names must match TECHNOLOGIES keys in lib/constants so each chip keeps its hover card.
// `color` overrides the brand hex where it's too dark to read on the navy background.
// Brands missing from simple-icons use their official SVG from public/assets/tech (`image`).
// Concepts with no logo at all (REST APIs, CI/CD, DevOps) use a lucide icon in the accent colour.
interface Skill {
  name: string
  icon?: SimpleIcon
  image?: string
  lucide?: LucideIcon
  color?: string
}

const LIGHT = "#ccd6f6"

const SKILL_GROUPS: { label: string; skills: Skill[] }[] = [
  {
    label: "Frontend",
    skills: [
      { name: "Next.js", icon: siNextdotjs, color: LIGHT },
      { name: "React", icon: siReact },
      { name: "TypeScript", icon: siTypescript },
      { name: "JavaScript", icon: siJavascript },
      { name: "Tailwind CSS", icon: siTailwindcss },
      { name: "shadcn/ui", icon: siShadcnui, color: LIGHT },
      { name: "Redux", icon: siRedux },
      { name: "Motion", image: "/assets/tech/motion.svg" },
      { name: "React Hook Form", icon: siReacthookform },
      { name: "Zod", icon: siZod },
      { name: "Vue.js", icon: siVuedotjs },
      { name: "Sass", icon: siSass },
      { name: "Storybook", icon: siStorybook },
      { name: "Figma", icon: siFigma },
    ],
  },
  {
    label: "Mobile",
    skills: [
      { name: "React Native", icon: siReact },
      { name: "Android", icon: siAndroid },
      { name: "iOS", icon: siApple, color: LIGHT },
      { name: "Ionic", icon: siIonic },
    ],
  },
  {
    label: "Backend & Data",
    skills: [
      { name: "Node.js", icon: siNodedotjs },
      { name: "Laravel", icon: siLaravel },
      { name: "PHP", icon: siPhp },
      { name: "REST APIs", lucide: Braces },
      { name: "WebSockets", image: "/assets/tech/websocket.svg" },
      { name: "MySQL", icon: siMysql },
      { name: "PostgreSQL", icon: siPostgresql },
      { name: "Prisma", icon: siPrisma, color: LIGHT },
      { name: "Supabase", icon: siSupabase },
      { name: "Firebase", icon: siFirebase },
      { name: "Stripe", icon: siStripe },
      { name: "WordPress", icon: siWordpress, color: "#7aa7d6" },
      { name: "WooCommerce", icon: siWoocommerce },
    ],
  },
  {
    label: "DevOps & Tools",
    skills: [
      { name: "Docker", icon: siDocker },
      { name: "Vercel", icon: siVercel, color: LIGHT },
      { name: "DigitalOcean", icon: siDigitalocean },
      { name: "Git", icon: siGit },
      { name: "GitHub", icon: siGithub, color: LIGHT },
      { name: "CI/CD", lucide: RefreshCw },
      { name: "Azure DevOps", image: "/assets/tech/azure-devops.svg" },
      { name: "DevOps", lucide: Workflow },
    ],
  },
  {
    label: "AI",
    skills: [
      { name: "Claude Code", icon: siClaude },
      { name: "GitHub Copilot", icon: siGithubcopilot, color: LIGHT },
      { name: "ChatGPT", image: "/assets/tech/chatgpt.svg" },
      { name: "Codex", image: "/assets/tech/codex.svg" },
      { name: "Antigravity", image: "/assets/tech/antigravity.svg" },
    ],
  },
]

const SkillChip = ({ skill }: { skill: Skill }) => (
  <TechHoverCard techName={skill.name} className="no-underline hover:no-underline">
    <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-custom-foreground transition-colors hover:border-custom-accent/50 hover:bg-white/[0.06]">
      {skill.icon ? (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill={skill.color ?? `#${skill.icon.hex}`} aria-hidden>
          <path d={skill.icon.path} />
        </svg>
      ) : skill.image ? (
        // SVGs can't go through the image optimizer, and these are tiny anyway
        <Image src={skill.image} alt="" width={16} height={16} unoptimized className="w-4 h-4 shrink-0" />
      ) : (
        skill.lucide && <skill.lucide className="w-4 h-4 shrink-0 text-custom-accent" strokeWidth={1.75} aria-hidden />
      )}
      {skill.name}
    </span>
  </TechHoverCard>
)

const Technologies = () => (
  <section id="technologies" className="w-full pt-10 pb-20 sm:pt-20">
    <div className="container mx-auto">
      <div className="flex items-center mb-8 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-custom-accent">{SECTION_TITLES.technologies}</h2>
        <div className="flex-1 h-px bg-custom-secondary/40 ml-4 sm:ml-8"></div>
      </div>

      {/* One row per area: label on the left, logo chips on the right (stacked on mobile) */}
      <div className="divide-y divide-white/5">
        {SKILL_GROUPS.map((group, index) => (
          <Reveal key={group.label} delay={index * 0.06}>
            <div className="grid gap-3 py-5 sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-8">
              <h3 className="font-mono text-sm text-custom-secondary">{group.label}</h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map(skill => (
                  <SkillChip key={skill.name} skill={skill} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
)

export default Technologies
