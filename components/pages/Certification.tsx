import { SECTION_TITLES, CERTIFICATIONS } from "@/lib/constants"
import { Award, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Reveal } from "@/components/shared"

// Local constants - only used in this component (outside component to avoid recreation)
const CERTIFICATION_CONTENT = {
  certifications: CERTIFICATIONS,
}

const Certification = () => {
  return (
    <section id="certification" className="w-full pt-10 pb-20 sm:pt-20">
      <div className="container mx-auto">
        <div className="flex items-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-custom-accent">{SECTION_TITLES.certification}</h2>
          <div className="flex-1 h-px bg-custom-secondary/40 ml-4 sm:ml-8"></div>
        </div>

        {/* Phones: compact one-line rows (icon, title + issuer, link icon). sm and up: cards. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {CERTIFICATION_CONTENT.certifications.map((cert, index) => (
            <Reveal
              key={index}
              delay={index * 0.05}
              className={(cert as { hideOnMobile?: boolean }).hideOnMobile ? "hidden sm:block" : undefined}
            >
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={cert.url}
                className="h-full relative overflow-hidden flex items-center gap-3 sm:block bg-slate-800/50 px-4 py-3 sm:p-6 rounded-lg hover:bg-slate-800/70 transition-all duration-300 group border border-slate-700/50 hover:border-custom-accent/30 cursor-pointer">
                {/* Leading icon — mobile only */}
                <Award className="w-5 h-5 shrink-0 text-custom-accent sm:hidden" />

                <div className="relative flex-1 min-w-0">
                  {/* Top row (icon + external link) — desktop only */}
                  <div className="hidden sm:flex justify-between items-start mb-4">
                    <Award className="w-8 h-8 text-custom-accent group-hover:scale-110 transition-transform duration-300" />
                    <ExternalLink className="w-5 h-5 text-custom-secondary group-hover:text-custom-accent transition-colors" />
                  </div>

                  <h3 className="text-sm sm:text-lg font-semibold text-custom-foreground sm:mb-2 group-hover:text-custom-accent transition-colors">
                    {cert.title}
                  </h3>

                  <p className="text-custom-secondary text-xs sm:text-sm sm:mb-4">{cert.issuer}</p>

                  <div className="hidden sm:inline-flex items-center text-custom-accent text-sm">
                    View Certificate
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </div>
                </div>

                {/* Trailing link icon — mobile only */}
                <ExternalLink className="w-4 h-4 shrink-0 text-custom-secondary group-hover:text-custom-accent transition-colors sm:hidden" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Certification
