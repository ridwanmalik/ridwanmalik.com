import About from "@/components/pages/About"
import Certification from "@/components/pages/Certification"
import Contact from "@/components/pages/Contact"
import Education from "@/components/pages/Education"
import Experience from "@/components/pages/Experience"
import HomeSection from "@/components/pages/Home"
import Projects from "@/components/pages/Projects"
import Resume from "@/components/pages/Resume"
import Technologies from "@/components/pages/Technologies"

const Home = () => {
  return (
    <>
      <HomeSection />
      <About />
      <Resume />
      <Technologies />
      <Experience />
      <Education />
      <Certification />
      <Projects />
      <Contact />
    </>
  )
}
export default Home
