import React, { useEffect, useState } from "react"
import classNames from "classnames"
import { createPortal } from "react-dom"

const Modal = ({ children, onClose, ...props }) => {
  const [animation, setAnimation] = useState({ loading: true })
  useEffect(() => {
    setAnimation({ loading: false })
  }, [])
  const classes = classNames("modal", "loading", { loading: animation.loading })
  return createPortal(
    <div className={classes}>
      <div className="close" onClick={onClose}>
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="close-square"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M354 671h58.9c4.7 0 9.2-2.1 12.3-5.7L512 561.8l86.8 103.5c3 3.6 7.5 5.7 12.3 5.7H670c6.8 0 10.5-7.9 6.1-13.1L553.8 512l122.4-145.9c4.4-5.2.7-13.1-6.1-13.1h-58.9c-4.7 0-9.2 2.1-12.3 5.7L512 462.2l-86.8-103.5c-3-3.6-7.5-5.7-12.3-5.7H354c-6.8 0-10.5 7.9-6.1 13.1L470.2 512 347.9 657.9A7.95 7.95 0 00354 671z"></path>
          <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"></path>
        </svg>
      </div>
      {children(onClose)}
    </div>,
    document.getElementById("gatsby-focus-wrapper")
  )
}

export default Modal
