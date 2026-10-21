import {
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCES,
  PERSONAL_INFO,
  PROJECTS,
  RESUME_SKILLS,
  SOCIAL_LINKS,
  buildResumeSummary,
} from "@/lib/constants"
import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

// Print-friendly palette (the site's mint accent is too light on white paper)
const COLORS = {
  ink: "#0A192F",
  body: "#334155",
  muted: "#64748B",
  accent: "#0F766E",
  heading: "#2079c7",
  line: "#E2E8F0",
}

const styles = StyleSheet.create({
  page: {
    paddingVertical: 32,
    paddingHorizontal: 32,
    fontSize: 8.8,
    fontFamily: "Helvetica",
    color: COLORS.body,
    lineHeight: 1.25,
  },
  // Own lineHeight: react-pdf v4 inherits the page's line height as a fixed size,
  // which is too short for 20pt and made the name overlap the contact row.
  name: { fontSize: 20, lineHeight: 1.2, fontFamily: "Helvetica-Bold", color: COLORS.ink, letterSpacing: 0.5 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 4, fontSize: 8.5, color: COLORS.muted },
  contactItem: { marginRight: 6 },
  contactLink: { color: COLORS.heading, textDecoration: "none" },
  contactPlain: { color: COLORS.body, textDecoration: "none" },
  // Breathing room between sections. Trimming the resume to four roles freed vertical
  // space, and spending it on whitespace makes the page scan faster for a human without
  // costing anything an ATS reads.
  //
  // These two are the page's slack, so they are where a one-page overflow shows up first.
  // Measured 2026-08-21 against the current content: 18/14 still fits, 20/16 spills onto a
  // second page. Left at 16/12 to keep a margin for content growth — if a bullet is added
  // later and the PDF turns two pages, trim here before cutting anything real.
  section: { marginTop: 16 },
  // Extra separation between the contact block and the first real section, so the
  // identity details read as a header rather than as part of the summary.
  header: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.heading,
    // NO letterSpacing. Tracking splits headings into "E D U C AT I O N" in the PDF text
    // layer, and ATS parsers then fail to match the section against their heading
    // dictionary — Jobscan reported the education section as missing entirely.
    textTransform: "uppercase",
    borderBottom: `1px solid ${COLORS.line}`,
    // paddingBottom is the gap between the heading text and its underline; marginBottom
    // is the gap between that underline and the section's content.
    paddingBottom: 2,
    // 6 is the ceiling — measured 2026-08-21, 7 spills onto a second page. There is no
    // slack left here, so buy it back from `section.marginTop` above before adding
    // content.
    marginBottom: 6,
  },
  summary: { color: COLORS.body },
  // Skills render as plain "Label: a, b, c" text lines. Pill chips laid out in a wrapping
  // flex row extract in an unpredictable order and detach labels from their values.
  skillGroup: { marginBottom: 2 },
  skillLabel: { fontFamily: "Helvetica-Bold", color: COLORS.ink, fontSize: 9 },
  skillItems: { color: COLORS.body, marginTop: 1 },
  job: { marginBottom: 3.5 },
  jobHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  jobRole: { flex: 1, paddingRight: 8, fontSize: 9.5, fontFamily: "Helvetica-Bold", color: COLORS.muted },
  jobCompany: { fontSize: 9.5, color: COLORS.ink, fontFamily: "Helvetica-Bold", textDecoration: "none" },
  jobPeriod: { fontSize: 8, color: COLORS.muted, textAlign: "right" },
  bulletRow: { flexDirection: "row", marginTop: 1.5 },
  bulletDot: { width: 9, color: COLORS.accent },
  bulletText: { flex: 1, color: COLORS.body },
  project: { marginBottom: 3 },
  projectHeading: { fontSize: 9, color: COLORS.ink },
  projectTitle: { fontFamily: "Helvetica-Bold", color: COLORS.ink },
  projectTech: { color: COLORS.accent },
  projectDesc: { marginTop: 1, color: COLORS.body },
  certText: { color: COLORS.body },
  certName: { fontFamily: "Helvetica-Bold", color: COLORS.heading, textDecoration: "none" },
  eduLine: { marginBottom: 2, fontSize: 9 },
  eduDegree: { fontFamily: "Helvetica-Bold", color: COLORS.ink, fontSize: 9.5 },
  eduInstitution: { fontFamily: "Helvetica", color: COLORS.body },
})

// Recent roles carry the detail; older roles are condensed.
const MAX_ROLES = 7
const ROLES_WITH_FULL_BULLETS = 4
const FULL_BULLETS = 3
const CONDENSED_BULLETS = 1

const MAX_PROJECTS = 4

const firstSentence = (text: string) => {
  const idx = text.indexOf(". ")
  return idx === -1 ? text : text.slice(0, idx + 1)
}

// Resume-only sections
const LANGUAGES = ["English (Fluent)", "Bangla (Native)", "Spanish (Basic)", "Hindi (Fluent)"]

const getSocial = (name: string) => SOCIAL_LINKS.find(link => link.name === name)?.url ?? ""
const stripProtocol = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "")

type ResumeDocumentProps = {
  // Mirrors the target posting's exact job title in the summary's opening line.
  // Omitted for the site's own download, which keeps the default title.
  title?: string
}

const ResumeDocument = ({ title }: ResumeDocumentProps) => {
  const github = getSocial("GitHub")
  const linkedin = getSocial("LinkedIn")

  return (
    <Document
      author={PERSONAL_INFO.name}
      title={`${PERSONAL_INFO.name} — Resume`}
      subject="Full Stack Web Developer Resume">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{PERSONAL_INFO.name}</Text>
          <View style={styles.contactRow}>
            <Link src={`mailto:${PERSONAL_INFO.email}`} style={[styles.contactItem, styles.contactPlain]}>
              {PERSONAL_INFO.email}
            </Link>
            <Text style={styles.contactItem}>|</Text>
            <Link
              src={`tel:${PERSONAL_INFO.phone.replace(/[\s-]/g, "")}`}
              style={[styles.contactItem, styles.contactPlain]}>
              {PERSONAL_INFO.phone}
            </Link>
            <Text style={styles.contactItem}>|</Text>
            <Text style={styles.contactItem}>{PERSONAL_INFO.location}</Text>
          </View>
          <View style={styles.contactRow}>
            {PERSONAL_INFO.website ? (
              <Link src={PERSONAL_INFO.website} style={[styles.contactItem, styles.contactLink]}>
                {stripProtocol(PERSONAL_INFO.website)}
              </Link>
            ) : null}
            {linkedin ? (
              <>
                <Text style={styles.contactItem}>|</Text>
                <Link src={linkedin} style={[styles.contactItem, styles.contactLink]}>
                  {stripProtocol(linkedin)}
                </Link>
              </>
            ) : null}
            {github ? (
              <>
                <Text style={styles.contactItem}>|</Text>
                <Link src={github} style={[styles.contactItem, styles.contactLink]}>
                  {stripProtocol(github)}
                </Link>
              </>
            ) : null}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summary}>{buildResumeSummary(title)}</Text>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Skills</Text>
          {RESUME_SKILLS.map(group => (
            <View key={group.label} style={styles.skillGroup}>
              <Text style={styles.skillLabel}>{group.label}</Text>
              <Text style={styles.skillItems}>{group.items.join(", ")}</Text>
            </View>
          ))}
        </View>

        {/* Experience */}
        <View style={styles.section}>
          {/* ATS heading dictionaries match "Professional Experience" / "Work History"
              more reliably than a bare "Experience". */}
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {EXPERIENCES.filter(job => !(job as { hideFromResume?: boolean }).hideFromResume)
            .slice(0, MAX_ROLES)
            .map((job, index) => {
              // A role may also override how many bullets it gets (e.g. to fit an extra line)
              const bulletLimit =
                (job as { resumeBulletLimit?: number }).resumeBulletLimit ??
                (index < ROLES_WITH_FULL_BULLETS ? FULL_BULLETS : CONDENSED_BULLETS)
              // A role may override which bullets the resume shows (e.g. lead with React work)
              const bullets = (job as { resumeBullets?: string[] }).resumeBullets ?? job.description
              return (
                <View key={`${job.company}-${job.period}`} style={styles.job} wrap={false}>
                  <View style={styles.jobHeader}>
                    <Text style={styles.jobRole}>
                      {job.role} @{" "}
                      {job.url ? (
                        <Link src={job.url} style={styles.jobCompany}>
                          {job.company}
                        </Link>
                      ) : (
                        <Text style={styles.jobCompany}>{job.company}</Text>
                      )}
                    </Text>
                    <Text style={styles.jobPeriod}>
                      {(job as { resumePeriod?: string }).resumePeriod ?? job.period}
                    </Text>
                  </View>
                  {bullets.slice(0, bulletLimit).map((line, i) => (
                    <View key={i} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{line}</Text>
                    </View>
                  ))}
                </View>
              )
            })}
        </View>

        {/* Selected Projects */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Projects</Text>
          {PROJECTS.featured
            .filter(project => !(project as { hideFromResume?: boolean }).hideFromResume)
            .slice(0, MAX_PROJECTS)
            .map(project => (
              <View key={project.title} style={styles.project} wrap={false}>
                <Text style={styles.projectHeading}>
                  <Text style={styles.projectTitle}>{project.title}</Text>
                  <Text style={styles.projectTech}> — {project.tech.join(", ")}</Text>
                  {project.external ? (
                    <Link src={project.external} style={styles.contactLink}>
                      {"  "}
                      {stripProtocol(project.external)}
                    </Link>
                  ) : null}
                </Text>
                <Text style={styles.projectDesc}>{firstSentence(project.description)}</Text>
              </View>
            ))}
        </View>

        {/* Education — dates are inlined into the same text run rather than pushed to a
            right-hand column. A smaller right-aligned date sits on a slightly higher
            baseline, and text extractors then attach it to the line above (the section
            heading), leaving each degree looking undated. */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {EDUCATION.map(edu => (
            <Text key={edu.degree} style={styles.eduLine}>
              <Text style={styles.eduDegree}>{edu.degree}</Text>
              <Text style={styles.eduInstitution}> — {edu.shortName}</Text>
              {` (${edu.resumePeriod ?? edu.period})${edu.note ? `, ${edu.note}` : ""}`}
            </Text>
          ))}
        </View>

        {/* Certifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          <Text style={styles.certText}>
            {CERTIFICATIONS.filter(cert => (cert as { resumeFeatured?: boolean }).resumeFeatured).map((cert, i) => (
              <Text key={cert.title}>
                {i > 0 ? "   •   " : ""}
                <Link src={cert.url} style={styles.certName}>
                  {cert.title}
                </Link>
              </Text>
            ))}
          </Text>
        </View>

        {/* Languages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <Text style={styles.certText}>
            {LANGUAGES.map((lang, i) => (
              <Text key={lang}>
                {i > 0 ? "   •   " : ""}
                {lang}
              </Text>
            ))}
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default ResumeDocument
