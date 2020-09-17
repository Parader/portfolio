import React, { useEffect, useRef } from "react"
import Swiper from "swiper"

let mySwiper = null

const Values = () => {
  let currentSlide = 0
  const nextArrow = useRef(null)
  const section = useRef()
  let observer = null
  const options = {
    root: null,
    rootMargin: "0px 0px 0px 0px",
    threshold: 0.5,
  }

  const startTransition = s => {
    currentSlide = s.realIndex
    const activeEl = document.querySelector(".position.active")
    const activePos = parseInt(activeEl.getAttribute("data-pos"))
    let nextPos =
      s.swipeDirection === "next" || typeof s.swipeDirection === "undefined"
        ? activePos + 1
        : activePos - 1
    if (nextPos > 7) {
      nextPos = 1
    } else if (nextPos < 1) {
      nextPos = 7
    }
    const nextEl = document.querySelectorAll(".p" + nextPos)
    if (nextEl.length > 0) {
      nextArrow.current.querySelector(".pos").textContent = `0${
        nextPos < 7 ? nextPos + 1 : 1
      }`
      activeEl.classList.add("out")
      activeEl.classList.remove("active")
      nextEl[0].classList.add("active")
      if (nextEl.length > 1) {
        nextEl[1].classList.add("active")
      }
    }
  }

  useEffect(() => {
    //remove loading state

    //Swiper
    const slideOffset = () => {
      return typeof window !== "undefined" && window.innerWidth > 1080
        ? (window.innerWidth - 1080) / 2
        : 0
    }

    mySwiper = new Swiper(".swiper-container", {
      direction: "horizontal",
      loop: true,
      slidesPerView: 1,
      speed: 450,
      slidesOffsetBefore: slideOffset,
      threshold: 20,
      navigation: {
        nextEl: nextArrow.current,
      },
      breakpoints: {
        560: {
          slidesPerView: 1.2,
        },
        1080: {
          slidesPerView: 2,
        },
      },
      on: {
        transitionStart: s => {
          if (s.realIndex !== currentSlide) {
            if (typeof s.swipeDirection === "undefined") {
              s.params.swipeDirection = "next"
            }
            startTransition(s)
          }
        },
        transitionEnd: s => {
          const outEl = document.querySelector(".position.out")
          if (outEl) {
            outEl.classList.remove("out")
          }
        },
        resize: s => {
          s.params.slidesOffsetBefore = slideOffset()
        },
      },
    })

    // intersection observer
    if (observer) observer.disconnect()

    let timeout = null
    observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("loading")
          nextArrow.current.classList.add("show-off")
          timeout = setTimeout(() => {
            nextArrow.current.classList.remove("show-off")
          }, 1000)
          obs.unobserve(entry.target)
        }
      })
    }, options)

    observer.observe(section.current)

    return () => {
      observer.disconnect()
      mySwiper.destroy()
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [])

  return (
    <div className="section values-section loading" ref={section}>
      <div className="container">
        <div className="section-title">
          <h2 className="pre-title">Values</h2>
          <p className="title">Seven things I stand&nbsp;by</p>
        </div>
        <div className="bg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 289.01 251.99">
            <circle cx="2.84" cy="2.84" r="2.84" fill="#545454" />
            <circle cx="43.31" cy="2.84" r="2.84" fill="#545454" />
            <circle cx="83.79" cy="2.84" r="2.84" fill="#545454" />
            <circle cx="124.27" cy="2.84" r="2.84" fill="#545454" />
            <circle cx="164.74" cy="2.84" r="2.84" fill="#545454" />
            <circle cx="205.22" cy="2.84" r="2.84" fill="#545454" />
            <circle cx="245.7" cy="2.84" r="2.84" fill="#545454" />
            <circle cx="286.17" cy="2.84" r="2.84" fill="#545454" />
            <circle
              className="only"
              cx="2.84"
              cy="64.42"
              r="2.84"
              fill="#545454"
            />
            <circle cx="43.31" cy="64.42" r="2.84" fill="#545454" />
            <circle cx="83.79" cy="64.42" r="2.84" fill="#545454" />
            <circle cx="124.27" cy="64.42" r="2.84" fill="#545454" />
            <circle cx="164.74" cy="64.42" r="2.84" fill="#545454" />
            <circle cx="205.22" cy="64.42" r="2.84" fill="#545454" />
            <circle cx="245.7" cy="64.42" r="2.84" fill="#545454" />
            <circle cx="286.17" cy="64.42" r="2.84" fill="#545454" />
            <circle cx="2.84" cy="126" r="2.84" fill="#545454" />
            <circle cx="43.31" cy="126" r="2.84" fill="#545454" />
            <circle cx="83.79" cy="126" r="2.84" fill="#545454" />
            <circle cx="124.27" cy="126" r="2.84" fill="#545454" />
            <circle cx="164.74" cy="126" r="2.84" fill="#545454" />
            <circle cx="205.22" cy="126" r="2.84" fill="#545454" />
            <circle cx="245.7" cy="126" r="2.84" fill="#545454" />
            <circle cx="286.17" cy="126" r="2.84" fill="#545454" />
            <circle cx="2.84" cy="187.58" r="2.84" fill="#545454" />
            <circle cx="43.31" cy="187.58" r="2.84" fill="#545454" />
            <circle cx="83.79" cy="187.58" r="2.84" fill="#545454" />
            <circle cx="124.27" cy="187.58" r="2.84" fill="#545454" />
            <circle cx="164.74" cy="187.58" r="2.84" fill="#545454" />
            <circle cx="205.22" cy="187.58" r="2.84" fill="#545454" />
            <circle cx="245.7" cy="187.58" r="2.84" fill="#545454" />
            <circle cx="286.17" cy="187.58" r="2.84" fill="#545454" />
            <circle cx="2.84" cy="249.16" r="2.84" fill="#545454" />
            <circle cx="43.31" cy="249.16" r="2.84" fill="#545454" />
            <circle cx="83.79" cy="249.16" r="2.84" fill="#545454" />
            <circle cx="124.27" cy="249.16" r="2.84" fill="#545454" />
            <circle cx="164.74" cy="249.16" r="2.84" fill="#545454" />
            <circle cx="205.22" cy="249.16" r="2.84" fill="#545454" />
            <circle cx="245.7" cy="249.16" r="2.84" fill="#545454" />
            <circle cx="286.17" cy="249.16" r="2.84" fill="#545454" />
          </svg>
        </div>
        <div className="bg2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 289.01 251.99">
            <circle cx="2.84" cy="126" r="2.84" fill="#545454" />
            <circle cx="43.31" cy="126" r="2.84" fill="#545454" />
            <circle cx="83.79" cy="126" r="2.84" fill="#545454" />
            <circle cx="124.27" cy="126" r="2.84" fill="#545454" />
            <circle cx="164.74" cy="126" r="2.84" fill="#545454" />
            <circle
              cx="205.22"
              cy="126"
              r="2.84"
              fill="#545454"
              className="only"
            />
            <circle cx="245.7" cy="126" r="2.84" fill="#545454" />
            <circle cx="286.17" cy="126" r="2.84" fill="#545454" />
            <circle cx="2.84" cy="187.58" r="2.84" fill="#545454" />
            <circle cx="43.31" cy="187.58" r="2.84" fill="#545454" />
            <circle cx="83.79" cy="187.58" r="2.84" fill="#545454" />
            <circle cx="124.27" cy="187.58" r="2.84" fill="#545454" />
            <circle cx="164.74" cy="187.58" r="2.84" fill="#545454" />
            <circle cx="205.22" cy="187.58" r="2.84" fill="#545454" />
            <circle cx="245.7" cy="187.58" r="2.84" fill="#545454" />
            <circle cx="286.17" cy="187.58" r="2.84" fill="#545454" />
            <circle cx="2.84" cy="249.16" r="2.84" fill="#545454" />
            <circle cx="43.31" cy="249.16" r="2.84" fill="#545454" />
            <circle cx="83.79" cy="249.16" r="2.84" fill="#545454" />
            <circle cx="124.27" cy="249.16" r="2.84" fill="#545454" />
            <circle cx="164.74" cy="249.16" r="2.84" fill="#545454" />
            <circle cx="205.22" cy="249.16" r="2.84" fill="#545454" />
            <circle cx="245.7" cy="249.16" r="2.84" fill="#545454" />
            <circle cx="286.17" cy="249.16" r="2.84" fill="#545454" />
          </svg>
        </div>
      </div>
      <div className="swiper-container">
        <div className="swiper-wrapper">
          <div className="swiper-slide">
            <p className="title">I'm here to help.</p>
            <p className="description">
              Keeping a posture of service makes a better work environment and
              creates great partnerships
            </p>
          </div>
          <div className="swiper-slide">
            <p className="title">Seek purpose, not style.</p>
            <p className="description">
              Outstanding work is achieved by defining a good strategy and then
              supporting it with dope visuals, not the other way around.
            </p>
          </div>
          <div className="swiper-slide">
            <p className="title">Observe.</p>
            <p className="description">
              Taking the time to listen and being curious expands perspectives
              and ensures brands bring more value to their&nbsp;audience.
            </p>
          </div>
          <div className="swiper-slide">
            <p className="title">Communicate.</p>
            <p className="description">
              Defining actors and establishing good communication channels is
              critical for project growth and building trust.
            </p>
          </div>
          <div className="swiper-slide">
            <p className="title">Value life balance.</p>
            <p className="description">
              Work isn't everything. Having a diversified lifestyle improves
              focus and creativity.
            </p>
          </div>
          <div className="swiper-slide">
            <p className="title">Learn.</p>
            <p className="description">
              Daily commitment to practicing or learning a new skill allows us
              to grow as individuals and expand our expertise.
            </p>
          </div>
          <div className="swiper-slide">
            <p className="title">Share, be transparent.</p>
            <p className="description">
              Greatness comes from sharing, not keeping knowledge to oneself.
            </p>
          </div>
        </div>

        <div className="swiper-button-prev"></div>
        <div
          className="swiper-button-next"
          ref={nextArrow}
          onClick={e => {
            e.stopPropagation()
            if (mySwiper) {
              mySwiper.slideNext()
              mySwiper.update()
            }
          }}
        >
          <div className="wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102.9 9.23">
              <line
                id="straight"
                y1="4.62"
                x2="102"
                y2="4.62"
                fill="none"
                stroke="#000"
                strokeMiterlimit="10"
              />
              <line
                id="topArrow"
                x1="102.4"
                y1="4.62"
                x2="98.29"
                y2="0.5"
                fill="none"
                stroke="#000"
                strokeLinecap="round"
                strokeMiterlimit="10"
              />
              <line
                id="bottomArrow"
                x1="102.4"
                y1="4.62"
                x2="98.29"
                y2="8.73"
                fill="none"
                stroke="#000"
                strokeLinecap="round"
                strokeMiterlimit="10"
              />
            </svg>

            <span className="pos">02</span>
          </div>
        </div>
        <div className="position p1 active" data-pos="01">
          01
        </div>
        <div className="position p2" data-pos="02">
          02
        </div>
        <div className="position p3" data-pos="03">
          03
        </div>
        <div className="position p4" data-pos="04">
          04
        </div>
        <div className="position p5" data-pos="05">
          05
        </div>
        <div className="position p6" data-pos="06">
          06
        </div>
        <div className="position p7" data-pos="07">
          07
        </div>
      </div>
    </div>
  )
}

export default Values
