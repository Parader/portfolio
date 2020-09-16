import React, { useEffect } from "react"

import SEO from "../components/seo"
import Work from "../components/work"
import Intro from "../components/intro"
import Values from "../components/values"
import About from "../components/about"
import FluidSimulation from "../components/fluidSimulation"
import Footer from "../components/footer"

const IndexPage = ({ location }) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="home">
      <SEO title="" location={location} />
      <FluidSimulation />

      <Intro />

      <Work />

      <Values />

      <About />

      <Footer />
    </div>
  )
}

export default IndexPage
