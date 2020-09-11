import React, { useEffect, useRef, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import ProjectBlock from "./projectBlock"
import AdrenatripLogo from "../images/adrenatrip_logo"
import CaseStudyAdrenatrip from "./caseStudyAdrenatrip"
import CaseStudyRecon from "./caseStudyRecon"
import Modal from "./modal"
import scrollTo from "gatsby-plugin-smoothscroll"

const Work = () => {
  const data = useStaticQuery(graphql`
    query Work {
      curriculum: allFile(filter: { name: { eq: "cv_2020" } }) {
        edges {
          node {
            publicURL
            name
          }
        }
      }
      image1: allFile(filter: { name: { eq: "poster-adrenatrip-v11" } }) {
        edges {
          node {
            childImageSharp {
              fluid(maxWidth: 1064, quality: 100) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
      }
      image2: allFile(filter: { name: { eq: "poster-qohash-v6" } }) {
        edges {
          node {
            childImageSharp {
              fluid(maxWidth: 1064, quality: 100) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
      }
      image3: allFile(filter: { name: { eq: "poster-web-v4" } }) {
        edges {
          node {
            childImageSharp {
              fluid(maxWidth: 1064, quality: 100) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
      }
      screen1: allFile(filter: { name: { eq: "adrenatrip_screen" } }) {
        edges {
          node {
            publicURL
          }
        }
      }
      screen2: allFile(filter: { name: { eq: "screen-qohash-v1" } }) {
        edges {
          node {
            childImageSharp {
              fluid(maxWidth: 450, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
      client1: allFile(filter: { name: { eq: "client_lg2_v2" } }) {
        edges {
          node {
            childImageSharp {
              fluid(maxWidth: 350, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
      client2: allFile(filter: { name: { eq: "client_rseq" } }) {
        edges {
          node {
            childImageSharp {
              fluid(maxWidth: 250, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
      client3: allFile(filter: { name: { eq: "client_qohash" } }) {
        edges {
          node {
            childImageSharp {
              fluid(maxWidth: 350, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  `)

  const p1 = {
    image: data.image1.edges[0].node.childImageSharp.fluid.srcWebp,
    prefix: `Branding & Web`,
    name: `Adrenatrip`,
    suffix: `Traveling blog`,
    id: "p1",
  }
  const p2 = {
    image: data.image2.edges[0].node.childImageSharp.fluid.srcWebp,
    prefix: `UI & UX`,
    name: `Qostodian Recon`,
    suffix: `Data recognition platform`,
    id: "p2",
  }
  const p3 = {
    image: data.image3.edges[0].node.childImageSharp.fluid.srcWebp,
    prefix: `Web development`,
    name: `Collaborations`,
    suffix: `previous work`,
    id: "p3",
  }
  const p1Ref = useRef()
  const p2Ref = useRef()
  const p3Ref = useRef()

  let observer = null
  const options = {
    root: null,
    rootMargin: "0px 0px 0px 0px",
    threshold: 0.2,
  }

  useEffect(() => {
    if (observer) observer.disconnect()

    observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log(entry.target)
          entry.target.classList.add("in")
          document.querySelector("header .about").classList.remove("active")
          document.querySelector("header .contact").classList.remove("active")
          document.querySelector("header .work").classList.add("active")
        }
      })
    }, options)

    observer.observe(p1Ref.current)
    observer.observe(p2Ref.current)
    observer.observe(p3Ref.current)

    return () => observer.disconnect()
  }, [])

  const [popups, setPopups] = useState({ adrenatrip: false, recon: false })

  return (
    <div className="section work-section">
      <span ref={p1Ref}>
        <ProjectBlock
          bg={
            <>
              <div
                className="bg"
                style={{
                  backgroundImage: `url(${p1.image})`,
                }}
              ></div>
              <div className="logo">
                <AdrenatripLogo />
              </div>
              <div className="screen">
                <img src={data.screen1.edges[0].node.publicURL} />
              </div>
            </>
          }
          prefix={p1.prefix}
          suffix={p1.suffix}
          name={p1.name}
          id={p1.id}
          cta={
            <>
              <a
                href="#"
                onClick={e => {
                  e.preventDefault()
                  setPopups({ adrenatrip: true })
                  document
                    .getElementsByTagName("html")[0]
                    .classList.add("modal-open")
                }}
              >
                View project
              </a>
              <a href="https://adrenatrip.com" target="_blank">
                Visit website
              </a>
            </>
          }
        />
        {popups.adrenatrip && (
          <Modal
            onClose={(next = false) => {
              document.querySelector(".modal").classList.add("loading")
              setTimeout(() => {
                setPopups({ adrenatrip: false })
                if (next === "project.p2") {
                  scrollTo(`.scroll-target-project.project-p2`)
                }
              }, 350)
              document
                .getElementsByTagName("html")[0]
                .classList.remove("modal-open")
            }}
          >
            {onClose => {
              return <CaseStudyAdrenatrip onClose={onClose} />
            }}
          </Modal>
        )}
      </span>

      <span ref={p2Ref}>
        <ProjectBlock
          bg={
            <>
              <div
                className="bg"
                style={{
                  backgroundImage: `url(${p2.image})`,
                }}
              >
                <div className="pannel">
                  <div className="inner"></div>
                </div>
                <div className="outer-pannel"></div>
                <div className="screen">
                  <Img
                    fluid={data.screen2.edges[0].node.childImageSharp.fluid}
                  />
                </div>
              </div>
            </>
          }
          prefix={p2.prefix}
          suffix={p2.suffix}
          name={p2.name}
          id={p2.id}
          cta={
            <button
              onClick={e => {
                e.preventDefault()
                setPopups({ recon: true })
                document
                  .getElementsByTagName("html")[0]
                  .classList.add("modal-open")
              }}
            >
              View project
            </button>
          }
        />
        {popups.recon && (
          <Modal
            onClose={() => {
              setPopups({ recon: false })
              document
                .getElementsByTagName("html")[0]
                .classList.remove("modal-open")
            }}
          >
            {onClose => {
              return <CaseStudyRecon onClose={onClose} />
            }}
          </Modal>
        )}
      </span>

      <span ref={p3Ref}>
        <ProjectBlock
          bg={
            <>
              <div
                className="bg"
                style={{
                  backgroundImage: `url(${p3.image})`,
                }}
              >
                <div className="overlay"></div>
              </div>
            </>
          }
          prefix={p3.prefix}
          suffix={p3.suffix}
          name={p3.name}
          id={p3.id}
          cta={
            <a href={data.curriculum.edges[0].node.publicURL} target="_blank">
              Download my CV
            </a>
          }
        />
      </span>

      <div className="container">
        <div className="clients" title="previous clients">
          <div className="client lg2">
            <Img fluid={data.client1.edges[0].node.childImageSharp.fluid} />
          </div>
          <div className="client rseq">
            <Img fluid={data.client2.edges[0].node.childImageSharp.fluid} />
          </div>
          <div className="client qohash">
            <Img fluid={data.client3.edges[0].node.childImageSharp.fluid} />
          </div>
        </div>
      </div>

      <div className="underlay"></div>
      <div className="anchor" id="work"></div>
    </div>
  )
}

export default Work
