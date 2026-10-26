import { CERTIFICATIONS, EDUCATION, EXPERIENCES, PERSONAL_INFO, PROJECTS, SOCIAL_LINKS } from "@/lib/constants"

// What goes on the resume, shared by the PDF (lib/resume/ResumeDocument.tsx) and the
// on-site preview (components/shared/ResumePreview.tsx) so the two can never drift apart.

// Recent roles carry the detail; older roles are condensed.
const MAX_ROLES = 7
const ROLES_WITH_FULL_BULLETS = 4
const FULL_BULLETS = 3
const CONDENSED_BULLETS = 1

const MAX_PROJECTS = 4

// Print-friendly palette (the site's mint accent is too light on white paper)
export const RESUME_COLORS = {
  ink: "#0A192F",
  body: "#334155",
  muted: "#64748B",
  accent: "#0F766E",
  heading: "#2079c7",
  line: "#E2E8F0",
}

// Resume-only section
export const RESUME_LANGUAGES = ["English (Fluent)", "Bangla (Native)", "Spanish (Basic)", "Hindi (Fluent)"]

export const stripProtocol = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "")

const firstSentence = (text: string) => {
  const idx = text.indexOf(". ")
  return idx === -1 ? text : text.slice(0, idx + 1)
}

const getSocial = (name: string) => SOCIAL_LINKS.find(link => link.name === name)?.url ?? ""

export const getResumeContact = () => {
  const links = [PERSONAL_INFO.website, getSocial("LinkedIn"), getSocial("GitHub")].filter(Boolean)

  return {
    email: PERSONAL_INFO.email,
    phone: PERSONAL_INFO.phone,
    phoneHref: `tel:${PERSONAL_INFO.phone.replace(/[\s-]/g, "")}`,
    location: PERSONAL_INFO.location,
    links: links.map(href => ({ href, label: stripProtocol(href) })),
  }
}

export const getResumeRoles = () =>
  EXPERIENCES.filter(job => !(job as { hideFromResume?: boolean }).hideFromResume)
    .slice(0, MAX_ROLES)
    .map((job, index) => {
      // A role may also override how many bullets it gets (e.g. to fit an extra line)
      const bulletLimit =
        (job as { resumeBulletLimit?: number }).resumeBulletLimit ??
        (index < ROLES_WITH_FULL_BULLETS ? FULL_BULLETS : CONDENSED_BULLETS)
      // A role may override which bullets the resume shows (e.g. lead with React work)
      const bullets = (job as { resumeBullets?: string[] }).resumeBullets ?? job.description

      return {
        key: `${job.company}-${job.period}`,
        role: job.role,
        company: job.company,
        url: job.url,
        period: (job as { resumePeriod?: string }).resumePeriod ?? job.period,
        bullets: bullets.slice(0, bulletLimit),
      }
    })

export const getResumeProjects = () =>
  PROJECTS.featured
    .filter(project => !(project as { hideFromResume?: boolean }).hideFromResume)
    .slice(0, MAX_PROJECTS)
    .map(project => ({
      title: project.title,
      tech: project.tech.join(", "),
      external: project.external,
      summary: firstSentence(project.description),
    }))

export const getResumeEducation = () =>
  EDUCATION.map(edu => ({
    degree: edu.degree,
    institution: edu.shortName,
    details: ` (${edu.resumePeriod ?? edu.period})${edu.note ? `, ${edu.note}` : ""}`,
  }))

export const getResumeCertifications = () =>
  CERTIFICATIONS.filter(cert => (cert as { resumeFeatured?: boolean }).resumeFeatured).map(cert => ({
    title: cert.title,
    url: cert.url,
  }))
