import { CaseStudy } from './components/CaseStudy'
import { Playground } from './components/V2'
import { Mascot } from './components/Mascot'
import { Bands, Contact, Credentials, Experience, Hero, HowIWork, Nav, NowBuilding, Projects, Recommendations, ScrollProgress, Skills, StackBand } from './components/Site'
import { useCaseRoute, useTheme } from './lib/hooks'

export default function App() {
  const { theme, toggle } = useTheme()
  const { slug, close } = useCaseRoute()

  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <ScrollProgress />
      <Nav theme={theme} onToggleTheme={toggle} />
      <main id="main">
        <Hero />
        <Bands />
        <NowBuilding />
        <StackBand />
        <Experience />
        <Recommendations />
        <Projects />
        <Playground />
        <Skills />
        <Credentials />
        <HowIWork />
      </main>
      <Contact />
      <CaseStudy slug={slug} onClose={close} />
      <Mascot />
    </>
  )
}
