import React, { useEffect } from "react"

import SEO from "../components/seo"
import Work from "../components/work"
import Intro from "../components/intro"
import Values from "../components/values"
import About from "../components/about"
import FluidSimulation from "../components/fluidSimulation"
import _ from "lodash"
import { updatePointerMoveData, scaleByPixelRatio } from "../lib/glsl"
import gsap from "gsap"

const IndexPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
    const getPointer = id => {
      return window.fluidSimulation.pointers.filter(p => p.id === id)[0]
    }
    let pointer1 = getPointer(5)
    let pointer2 = getPointer("footer_ball")
    let currentScroll = scaleByPixelRatio(window.scrollY)
    let currentScrollBottom = scaleByPixelRatio(
      document.querySelector(".bubbleAnchor").getBoundingClientRect().top + 30
    )

    const onScroll = _.debounce(e => {
      if (!pointer1) {
        pointer1 = getPointer(5)
      }
      if (!pointer2) {
        pointer2 = getPointer("footer_ball")
      }
      currentScroll = scaleByPixelRatio(
        document.querySelector(".hero-section .line1").getBoundingClientRect()
          .top + 30
      )
      currentScrollBottom = scaleByPixelRatio(
        document.querySelector(".bubbleAnchor").getBoundingClientRect().top + 30
      )

      gsap.to(pointer1, 0.1, {
        y: currentScroll,
        onUpdate: () => {
          updatePointerMoveData(pointer1.proto, pointer1.x, pointer1.y)
        },
      })
      if (pointer2) {
        gsap.to(pointer2, 0.1, {
          y: currentScrollBottom,
          onUpdate: () => {
            if (pointer2 && !pointer2.holding) {
              updatePointerMoveData(pointer2.proto, pointer2.x, pointer2.y)
            }
          },
        })
      }
    }, 100)
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
