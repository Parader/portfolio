import React, { useEffect, useRef } from "react"
import scrollTo from "gatsby-plugin-smoothscroll"
import {
  pointerPrototype,
  updatePointerMoveData,
  updatePointerDownData,
} from "../lib/glsl"
import gsap from "gsap"

const Intro = () => {
  const heroSection = useRef()
  const cta = useRef()

  useEffect(() => {
    heroSection.current.classList.remove("loading")
    let isHovering = false
    const point = {
      id: "cta_over_1",
      x: 0,
      y: 0,
      proto: new pointerPrototype(),
    }

    const onOver = e => {
      isHovering = true
      point.x = e.target.getBoundingClientRect().x
      point.y = e.target.getBoundingClientRect().y + 36
      gsap.to(point, 0.2, {
        x: "+=160",
        onUpdate: () => {
          if (isHovering) updatePointerMoveData(point.proto, point.x, point.y)
        },
      })
      window.fluidSimulation.pointers.push(point)
      updatePointerDownData(point.proto, "cta_over_1", e.pageX, e.pageY)
    }
    const onOut = e => {
      gsap.killTweensOf(point)
      isHovering = false
      window.fluidSimulation.pointers = window.fluidSimulation.pointers.filter(
        p => p.id !== "cta_over_1"
      )
    }
    cta.current.addEventListener("mouseover", onOver)
    cta.current.addEventListener("mouseout", onOut)

    return () => {
      cta.current.removeEventListener("mouseover", onOver)
      cta.current.removeEventListener("mouseout", onOut)
    }
  }, [])
  return (
    <div className="section hero-section loading" ref={heroSection}>
      <div className="container">
        <div className="grid">
          <div className="content">
            <h1>
              <span className="line line1">
                Remotely doing full&nbsp;stack&nbsp;design
              </span>
              <span className="line line2"> as&nbsp;a&nbsp;freelancer</span>
            </h1>
            <p>
              I believe the best user experiences are created with meaningful
              designs and wide accessibility.
            </p>
            <div className="cta">
              <a
                ref={cta}
                href="/#work"
                onClick={e => {
                  e.preventDefault()
                  scrollTo("#work")
                }}
              >
                <button>Take a look at my work</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Intro
