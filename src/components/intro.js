import React, { useEffect, useRef } from "react"
import scrollTo from "gatsby-plugin-smoothscroll"
import {
  pointerPrototype,
  updatePointerMoveData,
  updatePointerDownData,
  scaleByPixelRatio,
} from "../lib/glsl"
import gsap from "gsap"

const Intro = () => {
  const heroSection = useRef()
  const cta = useRef()

  useEffect(() => {
    //ball
    // })
    let p1 = window.fluidSimulation.pointers.find(p => p.id == 5)
    if (p1 == null) p1 = new pointerPrototype()
    const ball1 = {
      id: 5,
      proto: p1,
      x: scaleByPixelRatio(window.innerWidth * 0.7),
      y: scaleByPixelRatio(window.innerHeight * 0.4),
    }
    window.fluidSimulation.pointers.push(ball1)
    updatePointerDownData(ball1.proto, 5, ball1.x, ball1.y)

    const tl = gsap.timeline({
      repeat: -1,
      onUpdate: () => {
        updatePointerMoveData(p1, ball1.x, ball1.y)
        // updatePointerMoveData(p2, p2.pos.x, p2.pos.y)
      },
    })

    //
    tl.add("start")
      .to(
        ball1,
        3.5,
        {
          x: "+=40",
          // y: "+=20",
        },
        "start+=0"
      )
      .to(
        ball1,
        2.5,
        {
          x: "-=40",
          // y: "-=20",
        },
        "start+=3.5"
      )

    // loading useState
    heroSection.current.classList.remove("loading")

    // CTA HOVER EFFECT
    let isHovering = false
    const point = {
      id: "cta_over_1",
      x: 0,
      y: 0,
      proto: new pointerPrototype(),
    }

    const onOver = e => {
      isHovering = true
      point.x = scaleByPixelRatio(e.target.getBoundingClientRect().x)
      point.y = scaleByPixelRatio(e.target.getBoundingClientRect().y + 26)
      gsap.to(point, 0.2, {
        x: "+=160",
        onUpdate: () => {
          if (isHovering) updatePointerMoveData(point.proto, point.x, point.y)
        },
      })
      window.fluidSimulation.pointers.push(point)
      updatePointerDownData(point.proto, "cta_over_1", point.x, point.y)
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
