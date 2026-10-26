import { SECTION_TITLES } from "@/lib/constants"
import TechWithHoverCard from "@/components/shared/TechWithHoverCard"
import { Reveal } from "@/components/shared"
import ResumePreview from "@/components/shared/ResumePreview"
import { ridwanHeadshot } from "@/lib/assets"
import Image from "next/image"

// Local constants - only used in this component (outside component to avoid recreation)
const ABOUT_CONTENT = {
  paragraphs: [
    "Hello! I'm Ridwan, and I enjoy creating things that live on the internet. My interest in web development started back in 2017 when I decided to try building my first website — turns out learning HTML & CSS taught me a lot about frontend development!",
    "Fast-forward to today, and I've had the privilege of working at various companies, from startups to established businesses. My main focus these days is building accessible, inclusive products and digital experiences for a variety of clients.",
    "I'm studying Computer Science and Engineering at Bangladesh University of Business and Technology, while continuing to work as a Software Developer. I'm passionate about learning new technologies and solving complex problems.",
    "I specialize in building applications with React, Next.js, React Native, and Laravel, creating everything from frontend interfaces and cross-platform mobile apps to robust backend systems. My experience spans from JavaScript and PHP development to Node.js server applications and MySQL database design.",
  ],
  headshot: {
    alt: "Ridwan Malik headshot",
    size: 300,
  },
}

const About = () => {
  return (
    <section id="about" className="w-full pt-20 pb-20 sm:pt-40">
      <div className="container mx-auto">
        <div className="flex items-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-custom-accent">{SECTION_TITLES.about}</h2>
          <div className="flex-1 h-px bg-custom-secondary/40 ml-4 sm:ml-8"></div>
        </div>

        {/* Text on the left, the glass resume on the right (desktop only; phones get the headshot) */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:items-center lg:gap-14">
          <Reveal className="space-y-6 text-custom-secondary text-sm md:text-base leading-relaxed">
            {ABOUT_CONTENT.paragraphs.map((paragraph, index) => (
              <div key={index}>
                <TechWithHoverCard text={paragraph} />
              </div>
            ))}
          </Reveal>
          <Reveal className="hidden lg:block" from="right" delay={0.1}>
            <ResumePreview />
          </Reveal>
        </div>

        {/* Mobile only: desktop already shows the full-length photo in the hero */}
        <Reveal className="lg:hidden mx-auto mt-14 w-[70%] max-w-[300px]">
          <div className="group relative isolate">
            <div className="relative isolate overflow-hidden rounded bg-custom-accent transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
              <Image
                src={ridwanHeadshot}
                alt={ABOUT_CONTENT.headshot.alt}
                width={ABOUT_CONTENT.headshot.size}
                height={ABOUT_CONTENT.headshot.size}
                className="aspect-square w-full object-cover grayscale mix-blend-multiply transition duration-300 group-hover:grayscale-0 group-hover:mix-blend-normal"
              />
              <div className="pointer-events-none absolute inset-0 bg-oxford-blue mix-blend-screen transition-opacity duration-300 group-hover:opacity-0" />
            </div>
            <div className="absolute inset-0 -z-10 translate-x-3.5 translate-y-3.5 rounded border-2 border-custom-accent transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
export default About
