import React from "react"
import { Link } from "gatsby"
import { multipleSplats } from "../components/fluidSimulation"
import FluidSimulation from "../components/fluidSimulation"

import SEO from "../components/seo"

const NotFoundPage = ({ location }) => (
  <div className="page-404">
    <FluidSimulation />
    <SEO title="| Not found" location={location} />
    <div className="container">
      <h1>404 NOT FOUND</h1>
      <p>The page you are trying to access do not&nbsp;exist.</p>
      <p className="extra-margin">From here, you can either :</p>
      <div className="cta first">
        <button
          onClick={e => {
            e.preventDefault()
            multipleSplats(15)
          }}
        >
          Make a colorful splash
        </button>
      </div>
      <p>or</p>
      <div className="cta">
        <Link to="/">
          <button>Go to my portfolio</button>
        </Link>
      </div>
    </div>
  </div>
)

export default NotFoundPage
