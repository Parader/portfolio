import React, { useRef, useEffect } from "react"
import Img from "gatsby-image"
import { graphql, useStaticQuery } from "gatsby"

import DroneShot from "../images/drone_shots_v3.mp4"
import TrickShot from "../images/trick_shots_v4.mp4"

const About = () => {
  const sectionRef = useRef()
  const video1 = useRef()
  const video2 = useRef()
  let observer = null
  const options = {
    root: null,
    rootMargin: "0px 0px 0px 0px",
    threshold: 0.2,
  }

  const { photo1, photo2, photo3, thumbnail1, thumbnail2 } = useStaticQuery(
    graphql`
      query {
        photo1: allFile(
          filter: { relativePath: { eq: "derick_bako_v2.jpg" } }
        ) {
          edges {
            node {
              childImageSharp {
                fluid(maxWidth: 500, quality: 100) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
        photo2: allFile(filter: { relativePath: { eq: "dogo.jpg" } }) {
          edges {
            node {
              childImageSharp {
                fluid(maxWidth: 500, quality: 100) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
        photo3: allFile(filter: { relativePath: { eq: "travel.jpg" } }) {
          edges {
            node {
              childImageSharp {
                fluid(maxWidth: 380, quality: 100) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
        thumbnail1: allFile(
          filter: { relativePath: { eq: "gala2.jpg" } }
        ) {
          edges {
            node {
              childImageSharp {
                fluid(maxWidth: 380, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
        thumbnail2: allFile(
          filter: { relativePath: { eq: "drone_shots_cover.jpg" } }
        ) {
          edges {
            node {
              childImageSharp {
                fluid(maxWidth: 380, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    `
  )

  useEffect(() => {
    if (observer) observer.disconnect()

    observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.value.indexOf("loading") !== -1) {
            entry.target.classList.remove("loading")
          }
          document.querySelector("header .work").classList.remove("active")
          document.querySelector("header .contact").classList.remove("active")
          document.querySelector("header .about").classList.add("active")
        }
      })
    }, options)

    observer.observe(sectionRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="section about-section loading" ref={sectionRef}>
      <div className="anchor" id="about"></div>
      <div className="container">
        <div className="section-title">
          <h2 className="pre-title">About me</h2>
          <p className="title">I say "why" a&nbsp;lot.</p>
          <p className="description">
            I dare to ask questions. There are answers to any questions.
          </p>
          <p className="description">
            When I’m not designing, I spend time outside, enjoy a wide variety
            of sports, do tricks and play video games. Here are some moments
            I’ve captured.
          </p>
        </div>
      </div>
      <div className="gallery">
        <div className="container">
          <figure className="rect rect-1">
            <div className="overlay"></div>
            <Img fluid={photo3.edges[0].node.childImageSharp.fluid} />
          </figure>
          {/* <figure className="rect rect-2">
            <div
              className="overlay video"
              onClick={() => {
                if (video1.current.paused) {
                  video1.current.play()
                  video1.current.parentElement.classList.add("active")
                } else {
                  video1.current.pause()
                  video1.current.parentElement.classList.remove("active")
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
                <polygon
                  className="play"
                  points="51.28 36 25.73 21.25 25.73 50.75 51.28 36"
                />
                <path
                  d="M61.78,2.2a8,8,0,0,1,8,8V61.61a8,8,0,0,1-8,8H10.37a8,8,0,0,1-8-8V10.2a8,8,0,0,1,8-8H61.78m0-2H10.37a10,10,0,0,0-10,10V61.61a10,10,0,0,0,10,10H61.78a10,10,0,0,0,10-10V10.2a10,10,0,0,0-10-10Z"
                  transform="translate(-0.37 -0.2)"
                />
                <g className="pause">
                  <rect x="27" y="23.25" width="6" height="25" />
                  <rect x="39" y="23.25" width="6" height="25" />
                </g>
              </svg>
            </div>
            <video
              className="video-player"
              loop
              muted
              ref={video1}
              poster={thumbnail1.edges[0].node.childImageSharp.fluid.src}
            >
              <source src={TrickShot} type="video/mp4" />
            </video>
          </figure> */}
          <figure className="rect rect-2">
            <div className="overlay"></div>
            <Img fluid={thumbnail1.edges[0].node.childImageSharp.fluid} />
          </figure>
          <figure className="rect rect-3">
            <div className="overlay"></div>
            <Img fluid={photo2.edges[0].node.childImageSharp.fluid} />
          </figure>
          <figure className="rect rect-4">
            <div className="overlay"></div>
            <Img fluid={photo1.edges[0].node.childImageSharp.fluid} />
          </figure>
          <figure className="rect rect-5">
            <div
              className="overlay video"
              onClick={() => {
                if (video2.current.paused) {
                  video2.current.play()
                  video2.current.parentElement.classList.add("active")
                } else {
                  video2.current.pause()
                  video2.current.parentElement.classList.remove("active")
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
                <polygon
                  className="play"
                  points="51.28 36 25.73 21.25 25.73 50.75 51.28 36"
                />
                <path
                  d="M61.78,2.2a8,8,0,0,1,8,8V61.61a8,8,0,0,1-8,8H10.37a8,8,0,0,1-8-8V10.2a8,8,0,0,1,8-8H61.78m0-2H10.37a10,10,0,0,0-10,10V61.61a10,10,0,0,0,10,10H61.78a10,10,0,0,0,10-10V10.2a10,10,0,0,0-10-10Z"
                  transform="translate(-0.37 -0.2)"
                />
                <g className="pause">
                  <rect x="27" y="23.25" width="6" height="25" />
                  <rect x="39" y="23.25" width="6" height="25" />
                </g>
              </svg>
            </div>
            <video
              className="video-player"
              loop
              muted
              ref={video2}
              poster={thumbnail2.edges[0].node.childImageSharp.fluid.src}
            >
              <source src={DroneShot} type="video/mp4" />
            </video>
          </figure>
        </div>
      </div>
    </div>
  )
}

export default About

          