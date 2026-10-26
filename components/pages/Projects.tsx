"use client"

import { Reveal } from "@/components/shared"
import TechWithHoverCard from "@/components/shared/TechWithHoverCard"
import { SECTION_TITLES, PROJECTS } from "@/lib/constants"
import { AppStoreIcon, GooglePlayIcon } from "@/lib/icons"
import { ExternalLink, FolderOpen, Github } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

// Local constants - only used in this component (outside component to avoid recreation)
const PROJECTS_CONTENT = {
  ...PROJECTS,
  ui: {
    showMoreText: "Show More",
    showLessText: "Show Less",
    initialDisplayCount: 6,
  },
}

const Projects = () => {
  const [showMore, setShowMore] = useState(false)
  // Show 3 initially on mobile, 6 on larger screens
  const [initialCount, setInitialCount] = useState(PROJECTS_CONTENT.ui.initialDisplayCount)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)")
    const update = () => setInitialCount(mq.matches ? PROJECTS_CONTENT.ui.initialDisplayCount : 3)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const visibleProjects = showMore ? PROJECTS_CONTENT.other : PROJECTS_CONTENT.other.slice(0, initialCount)

  return (
    <section id="work" className="w-full pt-10 pb-20 sm:pt-20">
      <div className="container mx-auto">
        {/* Featured Projects */}
        <div className="mb-20">
          <div className="flex items-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-custom-accent">{SECTION_TITLES.projects}</h2>
            <div className="flex-1 h-px bg-custom-secondary/40 ml-4 sm:ml-8"></div>
          </div>

          <div className="space-y-24">
            {PROJECTS_CONTENT.featured.map((project, index) => (
              <Reveal key={index} from={index % 2 === 1 ? "right" : "left"}>
                <div
                  className={`flex flex-col lg:flex-row items-center gap-8 ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}>
                  {/* Project title above the image — mobile only */}
                  <div className="w-full lg:hidden">
                    <p className="text-custom-accent text-sm font-mono mb-2">Featured Project</p>
                    <h3 className="text-2xl font-semibold text-custom-foreground">
                      <Link
                        href={project.external}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-custom-accent transition-colors">
                        {project.title}
                      </Link>
                    </h3>
                  </div>

                  {/* Project Image */}
                  <div className="w-full lg:w-3/5">
                    <Link href={project.external} target="_blank" rel="noopener noreferrer">
                      <div className="relative group">
                        <div className="bg-accent/20 rounded-lg overflow-hidden">
                          <div className="aspect-video relative">
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className="object-cover contrast-100 transition-all duration-300 lg:grayscale lg:brightness-90 lg:group-hover:grayscale-0 lg:group-hover:brightness-100"
                            />
                          </div>
                        </div>
                        <div className="absolute inset-0 rounded-lg bg-transparent transition-colors duration-300 lg:bg-oxford-blue/40 lg:group-hover:bg-transparent"></div>
                      </div>
                    </Link>
                  </div>

                  {/* Project Info */}
                  <div className={`w-full lg:w-2/5 ${index % 2 === 1 ? "lg:text-left" : "lg:text-right"}`}>
                    <p className="hidden lg:block text-custom-accent text-sm font-mono mb-2">Featured Project</p>
                    <h3 className="hidden lg:block text-2xl font-semibold text-custom-foreground mb-4">
                      <Link
                        href={project.external}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-custom-accent transition-colors">
                        {project.title}
                      </Link>
                    </h3>

                    <div className="relative z-10 -mt-12 mx-4 shadow-xl lg:mt-0 lg:mx-0 lg:shadow-none bg-slate-800 lg:bg-slate-800/50 p-6 rounded-lg mb-4 lg:backdrop-blur-sm">
                      <div className="text-custom-secondary text-sm md:text-base">
                        <TechWithHoverCard text={project.description} />
                      </div>
                    </div>

                    <div
                      className={`flex flex-wrap gap-2 mb-4 font-mono text-xs text-custom-secondary ${
                        index % 2 === 1 ? "lg:justify-start" : "lg:justify-end"
                      }`}>
                      {project.tech.map((tech, techIndex) => (
                        <span key={techIndex}>
                          <TechWithHoverCard text={tech} />
                        </span>
                      ))}
                    </div>

                    <div className={`flex gap-4 ${index % 2 === 1 ? "lg:justify-start" : "lg:justify-end"}`}>
                      {(project as { github?: string }).github && (
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={(project as { github?: string }).github as string}
                          className="text-custom-secondary hover:text-custom-accent transition-colors">
                          <Github className="w-6 h-6" />
                        </Link>
                      )}
                      {"appStore" in project && project.appStore && (
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={project.appStore as string}
                          className="text-custom-secondary hover:text-custom-accent transition-colors">
                          <AppStoreIcon className="w-6 h-6" />
                        </Link>
                      )}
                      {"playStore" in project && project.playStore && (
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={project.playStore as string}
                          className="text-custom-secondary hover:text-custom-accent transition-colors">
                          <GooglePlayIcon className="w-6 h-6" />
                        </Link>
                      )}
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={project.external}
                        className="text-custom-secondary hover:text-custom-accent transition-colors">
                        <ExternalLink className="w-6 h-6" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Other Projects */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-16">Other Noteworthy Projects</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map((project, index) => (
              <Reveal key={index} delay={index * 0.05}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full relative overflow-hidden bg-slate-800/50 p-6 rounded-lg hover:bg-slate-800/70 transition-colors group">
                  {/* Folder watermark overlay */}
                  <FolderOpen className="pointer-events-none absolute bottom-1 right-3 h-28 w-28 text-custom-accent opacity-5" />

                  <div className="relative">
                    <h3 className="text-xl font-semibold text-custom-foreground mb-3 group-hover:text-custom-accent transition-colors">
                      {project.external || project.github ? (
                        // Stretched link: its ::after covers the whole card (-inset-6 undoes the
                        // card's p-6), so clicking anywhere on the card opens the project
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={(project.external || project.github) as string}
                          className="focus:outline-none after:absolute after:-inset-6 after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-custom-accent">
                          {project.title}
                        </Link>
                      ) : (
                        project.title
                      )}
                    </h3>
                    {/* Above the stretched link, but click-through except on the tech words,
                        which keep their hover cards */}
                    <div className="relative z-10 pointer-events-none [&_.cursor-pointer]:pointer-events-auto text-custom-secondary mb-4 text-sm md:text-base">
                      <TechWithHoverCard text={project.description} />
                    </div>

                    <div className="relative z-10 pointer-events-none [&_.cursor-pointer]:pointer-events-auto flex flex-wrap gap-2 font-mono text-sm text-custom-secondary mb-4">
                      {project.tech.map((tech, techIndex) => (
                        <span key={techIndex}>
                          <TechWithHoverCard text={tech} />
                        </span>
                      ))}
                    </div>

                    <div className="relative z-10 flex gap-3 w-fit">
                      {project.github && (
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={project.github}
                          className="text-custom-secondary hover:text-custom-accent transition-colors">
                          <Github className="w-5 h-5" />
                        </Link>
                      )}
                      {project.external && (
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={project.external}
                          className="text-custom-secondary hover:text-custom-accent transition-colors">
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {PROJECTS_CONTENT.other.length > initialCount && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowMore(!showMore)}
                className="btn-pop inline-block border border-accent text-custom-accent px-6 py-3 rounded hover:bg-accent/10 transition-colors">
                {showMore ? PROJECTS_CONTENT.ui.showLessText : PROJECTS_CONTENT.ui.showMoreText}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Projects
