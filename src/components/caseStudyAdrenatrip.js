import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

const CaseStudyAdrenatrip = ({ onClose }) => {
  const data = useStaticQuery(graphql`
    query adrenatripCaseStudy {
      image1: allFile(filter: { name: { eq: "case_study_1_p1" } }) {
        edges {
          node {
            childImageSharp {
              fluid(maxWidth: 1064, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
      image2: allFile(filter: { name: { eq: "case_study_1_p2" } }) {
        edges {
          node {
            childImageSharp {
              fluid(maxWidth: 1064, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
      image3: allFile(filter: { name: { eq: "case_study_1_p3" } }) {
        edges {
          node {
            childImageSharp {
              fluid(maxWidth: 1064, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
      image4: allFile(filter: { name: { eq: "case_study_1_p4" } }) {
        edges {
          node {
            childImageSharp {
              fluid(maxWidth: 1064, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
      image5: allFile(filter: { name: { eq: "case_study_1_p5" } }) {
        edges {
          node {
            childImageSharp {
              fluid(maxWidth: 1064, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
      image6: allFile(filter: { name: { eq: "case_study_1_p6" } }) {
        edges {
          node {
            childImageSharp {
              fluid(maxWidth: 648, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  `)
  return (
    <div className="case-study adrenatrip-case-study">
      <div className="container">
        <div className="section-title">
          <p className="pre-title">Client project</p>
          <h3 className="title">Adrenatrip</h3>
        </div>
        <div className="description">
          <p>
            Mélanie asked me to help her create a blog where she could share her
            previous and future traveling experiences.
          </p>
          <p>
            <strong> The challenge:</strong> Creating an excellent reliable user
            experience to encourage visitors to read articles and engage with
            the author.
          </p>
        </div>
        <div className="gallery">
          <Img
            className={`image image1`}
            fluid={data.image6.edges[0].node.childImageSharp.fluid}
          />
          <Img
            className={`image image2`}
            fluid={data.image2.edges[0].node.childImageSharp.fluid}
          />
          <Img
            className={`image image3`}
            fluid={data.image5.edges[0].node.childImageSharp.fluid}
          />
          <Img
            className={`image image4`}
            fluid={data.image1.edges[0].node.childImageSharp.fluid}
          />
          <Img
            className={`image image5`}
            fluid={data.image4.edges[0].node.childImageSharp.fluid}
          />
          <Img
            className={`image image6`}
            fluid={data.image3.edges[0].node.childImageSharp.fluid}
          />
        </div>
        <div className="footing">
          <div className="cta">
            <button onClick={onClose}>Close project</button>
            {/* <a href="https://adrenatrip.com" target="_blank" rel="noreferrer">
              <button> Visit website</button>
            </a> */}
            <button
              onClick={() => {
                onClose("project.p2")
              }}
            >
              Next project
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseStudyAdrenatrip
