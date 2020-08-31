import React from "react"
import * as Glsl from "../lib/glsl"

class FluidSimulation extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {}

  componentWillUnmount() {
    delete window.fluidSimulation
  }

  render() {
    return <div className="fluid-simulation"></div>
  }
}

export default FluidSimulation
