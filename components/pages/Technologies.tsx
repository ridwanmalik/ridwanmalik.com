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
  siShadcnui,
  siStripe,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siWordpress,
  siZod,
} from "simple-icons"
import type { LucideIcon } from "lucide-react"
import { Braces, RefreshCw, Workflow } from "lucide-react"
import Image from "next/image"
import { SECTION_TITLES } from "@/lib/constants"
import TechHoverCard from "@/components/shared/TechHoverCard"
import { StaggerGroup, StaggerItem } from "@/components/shared"
import CollapsibleChips from "@/components/shared/CollapsibleChips"

// Local constants - only used in this component (outside component to avoid recreation)
// Names must match TECHNOLOGIES keys in lib/constants so each chip keeps its hover card.
// `color` overrides the brand hex where it's too dark to read on the navy background.
// Brands missing from simple-icons use their official SVG from public/assets/tech (`image`).
// Concepts with no logo at all (REST APIs, CI/CD, DevOps) use a lucide icon in the accent colour.
// `core` marks the main skills; they get a mint border so they stand out from the rest.
interface Skill {
  name: string
  icon?: SimpleIcon
  image?: string
  lucide?: LucideIcon
  color?: string
  core?: boolean
}

const CHIP_STYLES = {
  base: "inline-flex items-center gap-2 whitespace-nowrap rounded-md border px-3 py-1.5 text-sm text-custom-foreground transition-colors",
  regular: "border-white/10 bg-white/[0.03] hover:border-custom-accent/50 hover:bg-white/[0.06]",
  core: "border-custom-accent/60 bg-custom-accent/[0.06] hover:border-custom-accent hover:bg-custom-accent/10",
}

const LIGHT = "#ccd6f6"

// Seconds between each chip appearing (~45 items, so the whole section takes ~1.4s)
const CHIP_STAGGER = 0.03

const SKILL_GROUPS: { label: string; skills: Skill[] }[] = [
  {
    label: "Frontend",
    skills: [
      { name: "Next.js", icon: siNextdotjs, color: LIGHT, core: true },
      { name: "React", icon: siReact, core: true },
      { name: "TypeScript", icon: siTypescript, core: true },
      { name: "JavaScript", icon: siJavascript },
      { name: "Tailwind CSS", icon: siTailwindcss },
      { name: "shadcn/ui", icon: siShadcnui, color: LIGHT },
      { name: "Redux", icon: siRedux },
      { name: "Motion", image: "/assets/tech/motion.svg" },
      { name: "React Hook Form", icon: siReacthookform },
      { name: "Zod", icon: siZod },
      { name: "Figma", icon: siFigma },
    ],
  },
  {
    label: "Mobile",
    skills: [
      { name: "React Native", icon: siReact, core: true },
      { name: "Android", icon: siAndroid },
      { name: "iOS", icon: siApple, color: LIGHT },
    ],
  },
  {
    label: "Backend & Data",
    skills: [
      { name: "Node.js", icon: siNodedotjs, core: true },
      { name: "Laravel", icon: siLaravel, core: true },
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
    <span className={`${CHIP_STYLES.base} ${skill.core ? CHIP_STYLES.core : CHIP_STYLES.regular}`}>
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

      {/* One row per area: label on the left, logo chips on the right (stacked on mobile).
          Once in view, each label and chip appears one after another, top to bottom. */}
      <StaggerGroup inView stagger={CHIP_STAGGER} className="divide-y divide-white/5">
        {SKILL_GROUPS.map(group => (
          <div key={group.label} className="grid gap-3 py-4 sm:py-6 sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-8">
            <StaggerItem>
              <h3 className="font-mono text-sm text-custom-secondary">{group.label}</h3>
            </StaggerItem>
            {/* Phones see the first few chips plus a "+N" that expands the row; sm and up see all */}
            <CollapsibleChips className="flex flex-wrap gap-3">
              {group.skills.map(skill => (
                <StaggerItem key={skill.name}>
                  <SkillChip skill={skill} />
                </StaggerItem>
              ))}
            </CollapsibleChips>
          </div>
        ))}
      </StaggerGroup>
    </div>
  </section>
)

export default Technologies
