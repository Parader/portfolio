import React, { useEffect } from "react"

import SEO from "../components/seo"
import Work from "../components/work"
import Intro from "../components/intro"
import Values from "../components/values"
import About from "../components/about"
import FluidSimulation from "../components/fluidSimulation"
import _ from "lodash"
import { updatePointerMoveData } from "../lib/glsl"
import gsap from "gsap"

const IndexPage = () => {
  useEffect(() => {
    // window.scrollTo(0, 0)
    const getPointer = id => {
      return window.fluidSimulation.pointers.filter(p => p.id === id)[0]
    }
    let pointer1 = getPointer(5)
    let currentScroll = window.scrollY
    const onScroll = _.debounce(e => {
      if (!pointer1) {
        pointer1 = getPointer(5)
      }
      currentScroll = window.scrollY

      gsap.to(pointer1, 0.1, {
        y: -currentScroll + window.innerHeight * 0.4,
        onUpdate: () => {
          updatePointerMoveData(pointer1.proto, pointer1.x, pointer1.y)
        },
      })
    }, 10)
    window.addEventListener("scroll", onScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])
  return (
    <div className="home">
      <SEO title="Home" />

      <Intro />

      <Work />

      <Values />

      <About />

      <FluidSimulation />
    </div>
  )
}

export default IndexPage
