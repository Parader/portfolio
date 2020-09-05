import React from "react"
import classNames from "classnames"
import scrollTo from "gatsby-plugin-smoothscroll"

const ProjectBlock = ({ bg, prefix, suffix, name, id, cta, screen }) => {
  const classes = classNames("project", id)
  return (
    <div className={classes}>
      <div className="container">
        <div className="title">
          <div className="wrap">
            <div className="bg"></div>
            <p className="pre-title">
              <span className="text"> {prefix}</span>
            </p>
            <p className="name">
              <span className="text">{name}</span>
              <span className="bg">
                <span className="c1"></span>
                <span className="c2"></span>
                <span className="c3"></span>
              </span>
            </p>
            <p className="post-title">
              <span className="text">{suffix}</span>
            </p>
            <div className="cta">{cta}</div>
          </div>
        </div>
        <div className="preview">{bg}</div>
        <div
          className="arrow"
          onClick={e => {
            e.preventDefault()
            scrollTo(`#${id}`)
          }}
        >
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="down-square"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M505.5 658.7c3.2 4.4 9.7 4.4 12.9 0l178-246c3.8-5.3 0-12.7-6.5-12.7H643c-10.2 0-19.9 4.9-25.9 13.2L512 558.6 406.8 413.2c-6-8.3-15.6-13.2-25.9-13.2H334c-6.5 0-10.3 7.4-6.5 12.7l178 246z"></path>
            <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"></path>
          </svg>
        </div>
        <div className="anchor" id={id}></div>
      </div>
    </div>
  )
}

export default ProjectBlock
