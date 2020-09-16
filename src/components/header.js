import React, { useEffect, useRef } from "react"
import Logo from "./logo"
import scrollTo from "gatsby-plugin-smoothscroll"
import { navigate } from "gatsby"

const Header = () => {
  const headerRef = useRef()
  useEffect(() => {
    headerRef.current.classList.remove("loading")
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
