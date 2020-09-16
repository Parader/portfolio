import React, { useEffect, useRef } from "react"
import Logo from "./logo"
import scrollTo from "gatsby-plugin-smoothscroll"
import { navigate } from "gatsby"
import _ from "lodash"

const Header = () => {
  const headerRef = useRef()
  useEffect(() => {
    headerRef.current.classList.remove("loading")

    let lastScroll = 0
    let scrollDirection
    const onScroll = _.debounce(
      e => {
        const footer = document.querySelector("footer")
        if (
          footer &&
          (window.scrollY < 200 || window.scrollY > footer.offsetTop - 300)
        ) {
          scrollDirection = "up"
          lastScroll = window.scrollY
          headerRef.current.classList.remove("scroll-hide")
          return null
        }
        const currentScrollDirection = scrollDirection
        if (window.scrollY > lastScroll) {
          scrollDirection = "down"
        } else {
          scrollDirection = "up"
        }
        lastScroll = window.scrollY
        const scrollChanged = currentScrollDirection !== scrollDirection
        if (scrollChanged) {
          headerRef.current.classList.toggle("scroll-hide")
        }
      },
      10,
      { leading: true, trailing: false }
    )
    window.addEventListener("scroll", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])
  return (
    <header className="loading" ref={headerRef}>
      <div className="left">
        <Logo />
      </div>
      <div className="right">
        <ul>
          <li className="work">
            <a
              href="/#work"
              onClick={e => {
                e.preventDefault()
                if (document.querySelector(".page-404")) {
                  navigate("/")
                }
                scrollTo("#work")
                document.querySelector("header .work").classList.add("active")
              }}
            >
              Work
            </a>
          </li>
          <li className="about">
            <a
              href="/#about"
              onClick={e => {
                e.preventDefault()
                if (document.querySelector(".page-404")) {
                  navigate("/")
                }
                scrollTo("#about")
                document.querySelector("header .about").classList.add("active")
              }}
            >
              About
            </a>
          </li>
          <li className="contact">
            <a
              href="/#contact"
              onClick={e => {
                e.preventDefault()
                if (document.querySelector(".page-404")) {
                  navigate("/")
                }
                scrollTo("#contact")
                document
                  .querySelector("header .contact")
                  .classList.add("active")
              }}
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header
