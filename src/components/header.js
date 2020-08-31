import React, { useEffect, useRef } from "react"
import Logo from "./logo"
import scrollTo from "gatsby-plugin-smoothscroll"

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
          <li>
            <a
              href="/#work"
              onClick={e => {
                e.preventDefault()
                scrollTo("#work")
              }}
            >
              Work
            </a>
          </li>
          <li>
            <a
              href="/#about"
              onClick={e => {
                e.preventDefault()
                scrollTo("#about")
              }}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="/#contact"
              onClick={e => {
                e.preventDefault()
                scrollTo("#contact")
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
