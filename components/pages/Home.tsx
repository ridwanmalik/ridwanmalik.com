import Header from "@/components/shared/Header"
import HeroBackdrop from "@/components/shared/HeroBackdrop"
import HeroCards from "@/components/shared/HeroCards"
import SocialIconMenu from "@/components/shared/SocialIconMenu"
import { ridwan } from "@/lib/assets"
import { EXPERIENCES, PERSONAL_INFO, PROJECTS, TOTAL_YEARS_EXPERIENCE } from "@/lib/constants"
import TechWithHoverCard from "@/components/shared/TechWithHoverCard"
import Image from "next/image"
import Link from "next/link"
import { Reveal, StaggerGroup, StaggerItem } from "@/components/shared"

// Local constants - only used in this component (outside component to avoid recreation)
const HOME_CONTENT = {
  cta: {
    text: "Check out my work!",
    href: "#work",
  },
  profileImage: {
    alt: "Ridwan Malik",
    width: 455,
    height: 1106,
  },
  // Derived from the site's own data, so they stay true as experience and projects change
  stats: [
    { value: `${TOTAL_YEARS_EXPERIENCE}+`, label: "Years of experience" },
    { value: `${EXPERIENCES.length}`, label: "Companies" },
    { value: `${PROJECTS.featured.length + PROJECTS.other.length}+`, label: "Projects built" },
  ],
}

const Home = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col overflow-hidden bg-gradient-to-t from-[#020b16]/50 to-transparent">
      <HeroBackdrop />
      <Header className="relative z-30 w-full" />
      {/* Mouse events pass through the empty space so the globe behind can be hovered;
          the text column and the floating cards opt back in */}
      <div className="pointer-events-none relative flex-1 flex flex-col">
        <div className="container mx-auto flex-1 flex flex-col lg:flex-row justify-center items-center h-full gap-8">
          <StaggerGroup className="pointer-events-auto relative z-20 w-full lg:flex-1" stagger={0.12}>
            <div className="space-y-4">
              <StaggerItem from="up">
                <p className="text-custom-accent font-mono text-sm sm:text-base md:text-lg">{PERSONAL_INFO.intro}</p>
              </StaggerItem>
              <StaggerItem from="up">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-custom-foreground leading-tight">
                  {PERSONAL_INFO.name}
                </h1>
              </StaggerItem>
              <StaggerItem from="up">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-custom-secondary leading-tight">
                  {PERSONAL_INFO.title}
                </h2>
              </StaggerItem>
              <StaggerItem from="up">
                <div className="max-w-xl">
                  <div className="text-custom-secondary leading-relaxed text-sm md:text-base">
                    <TechWithHoverCard text={PERSONAL_INFO.description} />
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem from="up">
                <div className="pt-8 space-y-6">
                  <Link
                    href={HOME_CONTENT.cta.href}
                    className="btn-pop text-sm inline-block border border-accent text-custom-accent px-6 py-3 rounded hover:bg-accent/10 transition-colors font-mono">
                    {HOME_CONTENT.cta.text}
                  </Link>
                  <div className="flex justify-start lg:hidden">
                    <SocialIconMenu orientation="horizontal" size="md" className="gap-4" />
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem from="up">
                <dl className="mt-8 grid grid-cols-3 max-w-md border-y border-custom-secondary/20 py-4 divide-x divide-custom-secondary/20">
                  {HOME_CONTENT.stats.map(stat => (
                    <div key={stat.label} className="flex flex-col-reverse gap-1 px-4 first:pl-0">
                      <dt className="text-xs text-custom-secondary">{stat.label}</dt>
                      <dd className="text-2xl sm:text-3xl font-bold text-custom-foreground">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </StaggerItem>
            </div>
          </StaggerGroup>
          <Reveal className="relative hidden lg:flex justify-end items-end self-end" from="right" delay={0.15}>
            <HeroCards />
            <Image
              src={ridwan}
              alt={HOME_CONTENT.profileImage.alt}
              width={HOME_CONTENT.profileImage.width}
              height={HOME_CONTENT.profileImage.height}
              preload
              className="pointer-events-none relative z-10 h-full max-h-[90vh] object-contain pt-8"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
export default Home
