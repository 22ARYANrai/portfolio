import { CaseStudy } from './components/CaseStudy'
import { Contact, Credentials, Experience, Footer, Skills } from './components/Sections'
import { About, Hero, Impact, Nav } from './components/Top'
import { Work } from './components/Work'
import { useCaseRoute, useLens, useTheme } from './lib/hooks'

export default function App() {
  const { theme, toggle } = useTheme()
  const { lens, setLens } = useLens()
  const { slug, close } = useCaseRoute()

  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <Nav theme={theme} onToggleTheme={toggle} />
      <main id="main">
        <Hero lens={lens} />
        <Impact />
        <About />
        <Work lens={lens} setLens={setLens} />
        <Experience lens={lens} />
        <Skills lens={lens} />
        <Credentials lens={lens} />
        <Contact />
      </main>
      <Footer />
      <CaseStudy slug={slug} onClose={close} />
    </>
  )
}
