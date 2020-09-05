import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

const CaseStudyRecon = ({ onClose }) => {
  const data = useStaticQuery(graphql`
    query reconCaseStudy {
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
    <div className="case-study recon-case-study">
      <div className="container">
        <div className="section-title">
          <p className="pre-title">Case Study</p>
          <h3 className="title">Qostodian Recon</h3>
        </div>
        <div className="description">
          <p>
            Qohash asked me to help them design a data
            recognition&nbsp;platform.
          </p>
          <p>
            <strong>The challenge:</strong> Demonstrate and familiarise
            customers to the main application capabilities through a portable
            software by offering a summary data analysis report that can be
            investigated&nbsp;granularly.
          </p>
          <p className="note">
            Unfortunately the software related content for this project is under
            non-disclosure agreement, so only public work is shown.
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseStudyRecon
