import { PERSONAL_INFO, RESUME_SKILLS, buildResumeSummary } from "@/lib/constants"
import {
  RESUME_COLORS,
  RESUME_LANGUAGES,
  getResumeCertifications,
  getResumeContact,
  getResumeEducation,
  getResumeProjects,
  getResumeRoles,
  stripProtocol,
} from "@/lib/resume/data"
import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { Fragment } from "react"

const COLORS = RESUME_COLORS

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

type ResumeDocumentProps = {
  // Mirrors the target posting's exact job title in the summary's opening line.
  // Omitted for the site's own download, which keeps the default title.
  title?: string
}

const ResumeDocument = ({ title }: ResumeDocumentProps) => {
  const contact = getResumeContact()

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
            <Link src={`mailto:${contact.email}`} style={[styles.contactItem, styles.contactPlain]}>
              {contact.email}
            </Link>
            <Text style={styles.contactItem}>|</Text>
            <Link src={contact.phoneHref} style={[styles.contactItem, styles.contactPlain]}>
              {contact.phone}
            </Link>
            <Text style={styles.contactItem}>|</Text>
            <Text style={styles.contactItem}>{contact.location}</Text>
          </View>
          <View style={styles.contactRow}>
            {contact.links.map((link, i) => (
              <Fragment key={link.href}>
                {i > 0 ? <Text style={styles.contactItem}>|</Text> : null}
                <Link src={link.href} style={[styles.contactItem, styles.contactLink]}>
                  {link.label}
                </Link>
              </Fragment>
            ))}
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
          {getResumeRoles().map(job => (
            <View key={job.key} style={styles.job} wrap={false}>
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
                <Text style={styles.jobPeriod}>{job.period}</Text>
              </View>
              {job.bullets.map((line, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{line}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Selected Projects */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Projects</Text>
          {getResumeProjects().map(project => (
            <View key={project.title} style={styles.project} wrap={false}>
              <Text style={styles.projectHeading}>
                <Text style={styles.projectTitle}>{project.title}</Text>
                <Text style={styles.projectTech}> — {project.tech}</Text>
                {project.external ? (
                  <Link src={project.external} style={styles.contactLink}>
                    {"  "}
                    {stripProtocol(project.external)}
                  </Link>
                ) : null}
              </Text>
              <Text style={styles.projectDesc}>{project.summary}</Text>
            </View>
          ))}
        </View>

        {/* Education — dates are inlined into the same text run rather than pushed to a
            right-hand column. A smaller right-aligned date sits on a slightly higher
            baseline, and text extractors then attach it to the line above (the section
            heading), leaving each degree looking undated. */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {getResumeEducation().map(edu => (
            <Text key={edu.degree} style={styles.eduLine}>
              <Text style={styles.eduDegree}>{edu.degree}</Text>
              <Text style={styles.eduInstitution}> — {edu.institution}</Text>
              {edu.details}
            </Text>
          ))}
        </View>

        {/* Certifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          <Text style={styles.certText}>
            {getResumeCertifications().map((cert, i) => (
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
            {RESUME_LANGUAGES.map((lang, i) => (
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
