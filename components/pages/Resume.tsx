"use client"

import type { CSSProperties, MouseEvent, ReactNode } from "react"
import { Fragment, useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react"
import { Download } from "lucide-react"
import { Reveal } from "@/components/shared"
import { PERSONAL_INFO, RESUME_SKILLS, SECTION_TITLES } from "@/lib/constants"
import {
  RESUME_LANGUAGES,
  getResumeCertifications,
  getResumeContact,
  getResumeEducation,
  getResumeProjects,
  getResumeRoles,
  stripProtocol,
} from "@/lib/resume/data"

// Local constants - only used in this component (outside component to avoid recreation)
const RESUME_CONTENT = {
  title: "Everything on one page.",
  description:
    "My roles, projects and stack, trimmed to a single page you can read in a minute. It's generated from this site's own data, so it's never out of date, and it's laid out to pass ATS filters as cleanly as it reads for people.",
  cta: {
    text: "Download PDF",
    href: PERSONAL_INFO.resume,
  },
  headings: {
    summary: "Summary",
    skills: "Technical Skills",
    experience: "Professional Experience",
    projects: "Selected Projects",
    education: "Education",
    certifications: "Certifications",
    languages: "Languages",
  },
}

// Seconds. The glass fades in, then the scan line "prints" the page.
const PRINT = {
  paper: 0,
  scanDelay: 0.4,
  scanDuration: 2,
}

// Seconds. The name types itself out, holds, backspaces, and types again — on a loop.
const TYPING = {
  typeChar: 0.08,
  deleteChar: 0.04,
  holdFull: 2.5,
  holdEmpty: 0.5,
  caretBlink: 1,
}

// After the page has printed, a marker swipes across one phrase at a time, in this order.
// "years" stands for the "8+ years" in the summary; the rest are skill items as written
// in RESUME_SKILLS. Keep them to lines that sit in the visible top of the sheet.
const YEARS_PATTERN = /\d+\+ years/
const HIGHLIGHTS = ["years", "React (ReactJS)", "TypeScript", "Next.js (NextJS)", "React Native", "Node.js"]
const HIGHLIGHT = {
  start: PRINT.scanDelay + PRINT.scanDuration + 0.4,
  every: 2.4,
  sweep: 0.6,
  fade: 0.5,
}

const MAX_TILT_DEG = 6
const TILT_SPRING = { stiffness: 150, damping: 18 }

// Soft light that follows the mouse across the glass (desktop only, mouse pointers)
const SPOTLIGHT = {
  color: "rgba(204, 214, 246, 0.09)",
  radius: "40%",
  spring: { stiffness: 200, damping: 30 },
}

// The sheet's font size is a share of its own width (cqw), and everything inside is in
// em, so the page keeps the PDF's proportions at any screen size. Colours are the site's
// dark palette (the PDF uses print colours) so the text reads on the glass.
const PAPER_VARS = {
  "--ink": "#e6f1ff",
  "--body": "#a8b2d1",
  "--muted": "#94a3b8",
  "--accent": "#7CFAD6",
  "--heading": "#7CFAD6",
  "--line": "rgba(255, 255, 255, 0.1)",
} as CSSProperties

// Off matches the sheet's body text (--body); on is near-white with a faint mint glow
const MARKER_STYLE = {
  off: { color: "#a8b2d1", textShadow: "0 0 0px rgba(124, 250, 214, 0)" },
  on: { color: "#ffffff", textShadow: "0 0 10px rgba(124, 250, 214, 0.55)" },
}

// No background: the phrase itself lights up (brighter text, soft glow) and dims back
const Marker = ({ active, children }: { active: boolean; children: ReactNode }) => (
  <motion.span
    initial={false}
    animate={active ? MARKER_STYLE.on : MARKER_STYLE.off}
    transition={{ duration: active ? HIGHLIGHT.sweep : HIGHLIGHT.fade, ease: "easeOut" }}>
    {children}
  </motion.span>
)

const yearsMatch = PERSONAL_INFO.resumeSummary.match(YEARS_PATTERN)?.[0]
const [summaryBefore, summaryAfter] = yearsMatch
  ? PERSONAL_INFO.resumeSummary.split(yearsMatch)
  : [PERSONAL_INFO.resumeSummary, ""]

const contact = getResumeContact()
const roles = getResumeRoles()
const projects = getResumeProjects()
const education = getResumeEducation()
const certifications = getResumeCertifications()

const SheetSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="mt-[1.8em]">
    <h3 className="mb-[0.6em] border-b border-[color:var(--line)] pb-[0.2em] text-[1.08em] font-bold uppercase text-[color:var(--heading)]">
      {title}
    </h3>
    {children}
  </div>
)

const Separator = () => <span className="mx-[0.5em] text-[color:var(--muted)]">|</span>

interface TypingProps {
  play: boolean
  // Reduced motion: show the full name at once
  instant: boolean
}

// Each step schedules the next: type a character, hold when full, backspace, hold when
// empty, repeat. setState only runs inside the timeout, never synchronously in the effect.
const useTypewriter = (text: string, active: boolean) => {
  const [count, setCount] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!active) return

    let wait = TYPING.typeChar
    let next = () => setCount(c => c + 1)
    if (!deleting && count === text.length) {
      wait = TYPING.holdFull
      next = () => setDeleting(true)
    } else if (deleting && count === 0) {
      wait = TYPING.holdEmpty
      next = () => setDeleting(false)
    } else if (deleting) {
      wait = TYPING.deleteChar
      next = () => setCount(c => c - 1)
    } else if (count === 0) {
      wait = TYPING.holdEmpty
    }

    const id = setTimeout(next, wait * 1000)
    return () => clearTimeout(id)
  }, [active, count, deleting, text.length])

  return text.slice(0, count)
}

const TypedName = ({ play, instant }: TypingProps) => {
  const typed = useTypewriter(PERSONAL_INFO.name, play && !instant)

  if (instant) return <>{PERSONAL_INFO.name}</>

  return (
    <>
      <span className="sr-only">{PERSONAL_INFO.name}</span>
      <span aria-hidden>{typed}</span>
      <motion.span
        aria-hidden
        className="ml-[0.06em] inline-block h-[0.85em] w-[0.07em] translate-y-[0.1em] bg-[color:var(--accent)]"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: TYPING.caretBlink, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
      />
    </>
  )
}

interface ResumeSheetProps extends Partial<TypingProps> {
  highlight?: string | null
}

const ResumeSheet = ({ play = true, instant = true, highlight = null }: ResumeSheetProps) => (
  <div
    style={PAPER_VARS}
    className="p-[3.6em] text-[1.48cqw] leading-[1.25] text-[color:var(--body)] [font-family:Helvetica,Arial,sans-serif]">
    <p className="text-[2.27em] font-bold leading-[1.2] tracking-[0.02em] text-[color:var(--ink)]">
      <TypedName play={play} instant={instant} />
    </p>
    <p className="mt-[0.4em] text-[0.97em]">
      <a href={`mailto:${contact.email}`}>{contact.email}</a>
      <Separator />
      <a href={contact.phoneHref}>{contact.phone}</a>
      <Separator />
      <span className="text-[color:var(--muted)]">{contact.location}</span>
    </p>
    <p className="mt-[0.4em] text-[0.97em]">
      {contact.links.map((link, i) => (
        <span key={link.href}>
          {i > 0 ? <Separator /> : null}
          <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-[color:var(--heading)]">
            {link.label}
          </a>
        </span>
      ))}
    </p>

    <SheetSection title={RESUME_CONTENT.headings.summary}>
      <p>
        {summaryBefore}
        {yearsMatch ? <Marker active={highlight === "years"}>{yearsMatch}</Marker> : null}
        {summaryAfter}
      </p>
    </SheetSection>

    <SheetSection title={RESUME_CONTENT.headings.skills}>
      {RESUME_SKILLS.map(group => (
        <div key={group.label} className="mb-[0.25em]">
          <p className="font-semibold text-custom-foreground">{group.label}</p>
          <p>
            {group.items.map((item, i) => (
              <Fragment key={item}>
                {i > 0 ? ", " : null}
                {HIGHLIGHTS.includes(item) ? <Marker active={highlight === item}>{item}</Marker> : item}
              </Fragment>
            ))}
          </p>
        </div>
      ))}
    </SheetSection>

    <SheetSection title={RESUME_CONTENT.headings.experience}>
      {roles.map(job => (
        <div key={job.key} className="mb-[0.4em]">
          <div className="flex items-start justify-between gap-[1em]">
            <p className="text-[1.08em] font-bold text-[color:var(--muted)]">
              {job.role} @ <span className="text-[color:var(--ink)]">{job.company}</span>
            </p>
            <p className="shrink-0 text-[0.91em] text-[color:var(--muted)]">{job.period}</p>
          </div>
          {job.bullets.map(line => (
            <p key={line} className="mt-[0.17em] flex">
              <span className="w-[1em] shrink-0 text-[color:var(--accent)]">•</span>
              <span>{line}</span>
            </p>
          ))}
        </div>
      ))}
    </SheetSection>

    <SheetSection title={RESUME_CONTENT.headings.projects}>
      {projects.map(project => (
        <div key={project.title} className="mb-[0.35em]">
          <p className="text-[color:var(--ink)]">
            <span className="font-bold">{project.title}</span>
            <span className="text-[color:var(--accent)]"> — {project.tech}</span>
            {project.external ? (
              <a
                href={project.external}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-[0.6em] text-[color:var(--heading)]">
                {stripProtocol(project.external)}
              </a>
            ) : null}
          </p>
          <p>{project.summary}</p>
        </div>
      ))}
    </SheetSection>

    <SheetSection title={RESUME_CONTENT.headings.education}>
      {education.map(edu => (
        <p key={edu.degree} className="mb-[0.2em]">
          <span className="font-bold text-[color:var(--ink)]">{edu.degree}</span> — {edu.institution}
          {edu.details}
        </p>
      ))}
    </SheetSection>

    <SheetSection title={RESUME_CONTENT.headings.certifications}>
      <p>
        {certifications.map((cert, i) => (
          <span key={cert.title}>
            {i > 0 ? <span className="mx-[0.8em]">•</span> : null}
            <a
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[color:var(--heading)]">
              {cert.title}
            </a>
          </span>
        ))}
      </p>
    </SheetSection>

    <SheetSection title={RESUME_CONTENT.headings.languages}>
      <p>
        {RESUME_LANGUAGES.map((lang, i) => (
          <span key={lang}>
            {i > 0 ? <span className="mx-[0.8em]">•</span> : null}
            {lang}
          </span>
        ))}
      </p>
    </SheetSection>
  </div>
)

const Resume = () => {
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { once: true, margin: "0px 0px -20% 0px" })
  const reduceMotion = useReducedMotion()
  const play = inView || !!reduceMotion
  // Reduced motion: skip the print sequence and show the finished page
  const timing = (delay: number, duration: number) => (reduceMotion ? { duration: 0 } : { delay, duration })

  // -1 until the page has printed, then cycles through HIGHLIGHTS
  const [highlightIndex, setHighlightIndex] = useState(-1)
  useEffect(() => {
    if (!play || reduceMotion) return
    let interval: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(() => {
      setHighlightIndex(0)
      interval = setInterval(() => setHighlightIndex(i => (i + 1) % HIGHLIGHTS.length), HIGHLIGHT.every * 1000)
    }, HIGHLIGHT.start * 1000)
    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
  }, [play, reduceMotion])

  const rotateX = useSpring(0, TILT_SPRING)
  const rotateY = useSpring(0, TILT_SPRING)

  const spotX = useMotionValue(50)
  const spotY = useMotionValue(50)
  const spotOpacity = useSpring(0, SPOTLIGHT.spring)
  const spotlight = useMotionTemplate`radial-gradient(circle at ${spotX}% ${spotY}%, ${SPOTLIGHT.color}, transparent ${SPOTLIGHT.radius})`

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    rotateY.set(x * MAX_TILT_DEG * 2)
    rotateX.set(-y * MAX_TILT_DEG * 2)
    spotX.set((x + 0.5) * 100)
    spotY.set((y + 0.5) * 100)
    spotOpacity.set(1)
  }

  const resetTilt = () => {
    rotateX.set(0)
    rotateY.set(0)
    spotOpacity.set(0)
  }

  const printEnd = PRINT.scanDelay + PRINT.scanDuration

  return (
    <section id="resume" className="w-full pt-10 pb-20 sm:pt-20">
      <div className="container mx-auto">
        <div className="flex items-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-custom-accent">{SECTION_TITLES.resume}</h2>
          <div className="flex-1 h-px bg-custom-secondary/40 ml-4 sm:ml-8"></div>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,620px)] lg:gap-12">
          <Reveal className="space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-custom-foreground">{RESUME_CONTENT.title}</h3>
            <p className="text-custom-secondary text-sm md:text-base leading-relaxed">{RESUME_CONTENT.description}</p>
            <div className="pt-2">
              <a
                href={RESUME_CONTENT.cta.href}
                className="btn-pop text-sm inline-flex items-center gap-2 border border-accent text-custom-accent px-6 py-3 rounded hover:bg-accent/10 transition-colors font-mono">
                <Download className="h-4 w-4" />
                {RESUME_CONTENT.cta.text}
              </a>
            </div>
          </Reveal>

          <div
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            className="relative mx-auto w-full max-w-[620px] [container-type:inline-size] [perspective:1600px]">
            {/* Soft glow that blooms once the page has printed */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-custom-accent/[0.04] blur-3xl"
              initial={{ opacity: 0 }}
              animate={play ? { opacity: 1 } : undefined}
              transition={timing(printEnd - 0.4, 1)}
            />

            {/* Only the top of the page shows, fading out — a glimpse, not the whole sheet.
                The colour blobs sit inside the masked box on purpose: the mask makes this box
                the glass's backdrop root, so the blur can only see what is in here. */}
            <motion.div
              style={{ rotateX, rotateY }}
              className="relative aspect-[210/150] [mask-image:linear-gradient(to_bottom,#000_60%,transparent)]">
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 0 }}
                animate={play ? { opacity: 1 } : undefined}
                transition={timing(PRINT.paper, 0.8)}>
                <div className="absolute left-[8%] top-[6%] size-[45%] rounded-full bg-custom-accent/10 blur-3xl" />
                <div className="absolute right-[4%] top-[35%] size-[50%] rounded-full bg-blue-500/10 blur-3xl" />
              </motion.div>
              <motion.div
                className="absolute inset-0 overflow-hidden rounded-xl border border-white/10 bg-oxford-blue/60 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
                initial={{ opacity: 0 }}
                animate={play ? { opacity: 1 } : undefined}
                transition={timing(PRINT.paper, 0.6)}>
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{ background: spotlight, opacity: spotOpacity }}
                />
                <motion.div
                  className="absolute inset-0"
                  initial={{ clipPath: "inset(0 0 100% 0)" }}
                  animate={play ? { clipPath: "inset(0 0 0% 0)" } : undefined}
                  transition={{ ...timing(PRINT.scanDelay, PRINT.scanDuration), ease: "linear" }}>
                  <ResumeSheet play={play} instant={!!reduceMotion} highlight={HIGHLIGHTS[highlightIndex] ?? null} />
                </motion.div>
              </motion.div>

              {/* Scan line that "prints" the page from top to bottom */}
              {!reduceMotion && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-[-2%] h-[2px] rounded-full bg-custom-accent shadow-[0_0_16px_4px_rgba(124,250,214,0.65)]"
                  initial={{ top: "0%", opacity: 0 }}
                  animate={play ? { top: ["0%", "100%"], opacity: [1, 1, 0] } : undefined}
                  transition={{
                    delay: PRINT.scanDelay,
                    duration: PRINT.scanDuration,
                    ease: "linear",
                    times: [0, 0.97, 1],
                  }}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Resume
