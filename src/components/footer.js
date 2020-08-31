import React, { useEffect, useRef } from "react"
import gsap from "gsap"

const vis = (() => {
  var stateKey,
    eventKey,
    keys = {
      hidden: "visibilitychange",
      webkitHidden: "webkitvisibilitychange",
      mozHidden: "mozvisibilitychange",
      msHidden: "msvisibilitychange",
    }
  for (stateKey in keys) {
    if (stateKey in document) {
      eventKey = keys[stateKey]
      break
    }
  }
  return c => {
    if (c) document.addEventListener(eventKey, c)
    return !document[stateKey]
  }
})()

const Foot = () => {
  const footerRef = useRef()
  const writingTextRef = useRef()
  const cursorRef = useRef()
  let observer = null
  const options = {
    root: null,
    rootMargin: "0px 0px 0px 0px",
    threshold: 0.5,
  }

  useEffect(() => {
    let lastNumbers = [2, 9, 11, 8]
    const getRandomSentence = () => {
      let sentence = ""
      let i = Math.floor(Math.random() * 11) + 1

      if (lastNumbers.indexOf(i) !== -1) {
        return getRandomSentence()
      } else {
        lastNumbers = [lastNumbers[1], lastNumbers[2], i]
        switch (i) {
          case 1:
            sentence = "start a project"
            break
          case 2:
            sentence = "an amazing website"
            break
          case 3:
            sentence = "talk about the meaning of life"
            break
          case 4:
            sentence = "better your online presence"
            break
          case 5:
            sentence = "create a brand"
            break
          case 6:
            sentence = "take care of users"
            break
          case 7:
            sentence = "think big"
            break
          case 8:
            sentence = "validate our assumptions"
            break
          case 9:
            sentence = "money"
            break
          case 10:
            sentence = "share our passion"
            break
          case 11:
            sentence = "breathe for a moment"
            break
          default:
            sentence = "an amazing website"
            break
        }
        return sentence
      }
    }
    const tl = gsap.timeline({
      yoyo: true,
      repeat: -1,
      repeatRefresh: true,
      paused: true,
    })

    tl.add("start")
      .to(writingTextRef.current, 2.5, {
        text: {
          value: getRandomSentence,
        },
      })
      .to({}, 2, {})
    tl.seek("start+=2.5")
    const cursorTl = gsap.timeline({
      repeat: -1,
      paused: true,
      repeatDelay: 0.1,
    })
    cursorTl
      .add("start")
      .to(cursorRef.current, 0, { autoAlpha: 1 }, "start+=0")
      .to(cursorRef.current, 0, { autoAlpha: 0 }, "start+=0.6")

    const startWritingAnimation = () => {
      tl.resume()
      cursorTl.resume()
    }

    const pauseWritingAnimation = () => {
      tl.pause()
      cursorTl.pause()
    }

    // intersection observer
    if (observer) observer.disconnect()

    observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("loading")
          obs.unobserve(entry.target)
          setTimeout(() => {
            startWritingAnimation()
          }, 1500)
        }
      })
    }, options)

    observer.observe(footerRef.current)

    vis(() => {
      if (vis()) {
        setTimeout(() => {
          startWritingAnimation()
        }, 300)
      } else {
        tl.pause()
      }
    })
    var notIE = document.documentMode === undefined,
      isChromium = window.chrome

    if (notIE && !isChromium) {
      window
        .addEventListener("focusin", () => {
          setTimeout(() => {
            startWritingAnimation()
          }, 300)
        })
        .addEventListener("focusout", () => {
          pauseWritingAnimation()
        })
    } else {
      if (window.addEventListener) {
        window.addEventListener(
          "focus",
          event => {
            setTimeout(() => {
              startWritingAnimation()
            }, 300)
          },
          false
        )

        window.addEventListener(
          "blur",
          event => {
            pauseWritingAnimation()
          },
          false
        )
      } else {
        window.attachEvent("focus", event => {
          setTimeout(() => {
            startWritingAnimation()
          }, 300)
        })

        window.attachEvent("blur", event => {
          pauseWritingAnimation()
        })
      }
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <footer className="footer loading" id="contact" ref={footerRef}>
      <div className="container">
        <div className="section-title">
          <p className="pre-title ">Twenty eight things we could do together</p>
          <div className="group">
            <p className="title changing-text" ref={writingTextRef}></p>
            <span ref={cursorRef}>|</span>
          </div>
        </div>

        <div className="section-title off" style={{ display: "flex" }}>
          <p className="title">seven way to contact&nbsp;me</p>
          <p className="post-title">For any inquiries or just to say hello.</p>

          <div className="wrap">
            <div className="cta">
              <button>Start a conversation</button>
            </div>
            <div className="social-media">
              <div className="media insta">
                <svg viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12.5 5.99111C9.06399 5.99111 6.29094 8.6747 6.29094 11.9999C6.29094 15.3251 9.06399 18.0087 12.5 18.0087C15.9361 18.0087 18.7091 15.3251 18.7091 11.9999C18.7091 8.6747 15.9361 5.99111 12.5 5.99111ZM12.5 15.9052C10.278 15.9052 8.46457 14.1503 8.46457 11.9999C8.46457 9.8495 10.278 8.09462 12.5 8.09462C14.7221 8.09462 16.5355 9.8495 16.5355 11.9999C16.5355 14.1503 14.7221 15.9052 12.5 15.9052ZM18.9634 4.34462C18.1612 4.34462 17.5133 4.97157 17.5133 5.74794C17.5133 6.52431 18.1612 7.15126 18.9634 7.15126C19.7656 7.15126 20.4135 6.52724 20.4135 5.74794C20.4137 5.56359 20.3764 5.381 20.3036 5.21064C20.2308 5.04028 20.124 4.88548 19.9893 4.75513C19.8546 4.62477 19.6947 4.52141 19.5186 4.45097C19.3426 4.38053 19.1539 4.34439 18.9634 4.34462V4.34462ZM24.6033 11.9999C24.6033 10.3827 24.6185 8.78017 24.5246 7.16591C24.4308 5.29091 23.9888 3.62685 22.572 2.25575C21.1522 0.881731 19.4357 0.456926 17.4982 0.366106C15.8271 0.275285 14.1711 0.289934 12.503 0.289934C10.832 0.289934 9.176 0.275285 7.50793 0.366106C5.57043 0.456926 3.8509 0.88466 2.4341 2.25575C1.01428 3.62978 0.575314 5.29091 0.481467 7.16591C0.387619 8.7831 0.402756 10.3856 0.402756 11.9999C0.402756 13.6142 0.387619 15.2196 0.481467 16.8339C0.575314 18.7089 1.01731 20.3729 2.4341 21.744C3.85393 23.1181 5.57043 23.5429 7.50793 23.6337C9.17903 23.7245 10.835 23.7099 12.503 23.7099C14.1741 23.7099 15.8301 23.7245 17.4982 23.6337C19.4357 23.5429 21.1552 23.1151 22.572 21.744C23.9918 20.37 24.4308 18.7089 24.5246 16.8339C24.6215 15.2196 24.6033 13.6171 24.6033 11.9999V11.9999ZM21.9393 18.9081C21.7183 19.4413 21.4519 19.8397 21.025 20.2499C20.5982 20.663 20.1895 20.9208 19.6385 21.1347C18.0461 21.747 14.265 21.6093 12.5 21.6093C10.7351 21.6093 6.9509 21.747 5.35852 21.1376C4.80754 20.9237 4.39582 20.6659 3.97199 20.2528C3.54514 19.8397 3.27873 19.4442 3.05774 18.911C2.42805 17.3671 2.57033 13.7079 2.57033 11.9999C2.57033 10.2919 2.42805 6.62978 3.05774 5.08876C3.27873 4.55556 3.54514 4.15712 3.97199 3.74697C4.39885 3.33681 4.80754 3.07607 5.35852 2.8622C6.9509 2.25282 10.7351 2.39052 12.5 2.39052C14.265 2.39052 18.0491 2.25282 19.6415 2.8622C20.1925 3.07607 20.6042 3.33388 21.028 3.74697C21.4549 4.16005 21.7213 4.55556 21.9423 5.08876C22.572 6.62978 22.4297 10.2919 22.4297 11.9999C22.4297 13.7079 22.572 17.3671 21.9393 18.9081Z"
                    fill="#8C8C8C"
                  />
                </svg>
              </div>
              <div className="media mail">
                <svg
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M27.1875 5.03125H2.8125C2.29395 5.03125 1.875 5.43623 1.875 5.9375V24.0625C1.875 24.5638 2.29395 24.9688 2.8125 24.9688H27.1875C27.7061 24.9688 28.125 24.5638 28.125 24.0625V5.9375C28.125 5.43623 27.7061 5.03125 27.1875 5.03125ZM26.0156 8.16914V22.9297H3.98438V8.16914L3.17578 7.56025L4.32715 6.13008L5.58105 7.07314H24.4219L25.6758 6.13008L26.8271 7.56025L26.0156 8.16914ZM24.4219 7.07031L15 14.1504L5.57812 7.07031L4.32422 6.12725L3.17285 7.55742L3.98145 8.16631L13.9893 15.6882C14.2771 15.9043 14.6311 16.0217 14.9956 16.0217C15.3601 16.0217 15.7141 15.9043 16.002 15.6882L26.0156 8.16914L26.8242 7.56025L25.6729 6.13008L24.4219 7.07031Z"
                    fill="#8C8C8C"
                  />
                </svg>
              </div>
              <div className="media fb">
                <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M25.7812 3.67188H4.21875C3.7002 3.67188 3.28125 4.07686 3.28125 4.57812V25.4219C3.28125 25.9231 3.7002 26.3281 4.21875 26.3281H25.7812C26.2998 26.3281 26.7188 25.9231 26.7188 25.4219V4.57812C26.7188 4.07686 26.2998 3.67188 25.7812 3.67188ZM24.8438 24.5156H19.4502V17.5545H22.4971L22.9541 14.1362H19.4502V11.9527C19.4502 10.9615 19.7344 10.2875 21.2021 10.2875H23.0742V7.22891C22.749 7.18643 21.6387 7.09297 20.3438 7.09297C17.6426 7.09297 15.7939 8.6874 15.7939 11.6129V14.1334H12.7412V17.5517H15.7969V24.5156H5.15625V5.48438H24.8438V24.5156Z"
                    fill="#8C8C8C"
                  />
                </svg>
              </div>
              <div className="media disc">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27.6 20.4">
                  <path
                    d="M14.35,4.65c.92-.06,1.82-.18,2.72-.18s1.79.12,2.7.19c.1-.31.2-.64.31-1a.59.59,0,0,1,.65-.44,12.73,12.73,0,0,1,6.05,2.07,3.23,3.23,0,0,1,1,1.24,24.7,24.7,0,0,1,1.77,4.63,29.74,29.74,0,0,1,1.28,8.05,1.44,1.44,0,0,1-.21.73,6.68,6.68,0,0,1-2.77,2.36,13.39,13.39,0,0,1-4.37,1.31.92.92,0,0,1-1-.43c-.37-.56-.78-1.09-1.16-1.64a.31.31,0,0,0-.37-.14,18.37,18.37,0,0,1-7.88,0,.31.31,0,0,0-.37.16l-1.24,1.73a.71.71,0,0,1-.69.34,11.59,11.59,0,0,1-6.4-2.57c-.14-.12-.26-.25-.39-.38a2.49,2.49,0,0,1-.77-2.1A33.81,33.81,0,0,1,6,7.17,4.86,4.86,0,0,1,8.44,4.65a14.37,14.37,0,0,1,4.84-1.38.63.63,0,0,1,.78.49C14.17,4.06,14.26,4.37,14.35,4.65ZM13,4.56a13.75,13.75,0,0,0-3.5.9A4.35,4.35,0,0,0,7,7.94,33.66,33.66,0,0,0,4.49,18.39a2,2,0,0,0,.74,1.77A9.86,9.86,0,0,0,10.5,22.4a.27.27,0,0,0,.23-.08c.32-.41.62-.83.94-1.25-.43-.17-.85-.29-1.22-.48q-1.2-.64-2.37-1.35a.59.59,0,0,1-.2-.9.62.62,0,0,1,.93-.05c.14.11.28.22.43.32a12.36,12.36,0,0,0,3.59,1.52,16.61,16.61,0,0,0,3.76.52,16.18,16.18,0,0,0,4.74-.54,11.52,11.52,0,0,0,4.05-1.87.62.62,0,0,1,.9.19.57.57,0,0,1-.18.77c-.62.4-1.24.8-1.9,1.14s-1.14.49-1.74.74c.27.37.56.72.8,1.09a.42.42,0,0,0,.53.21c.83-.22,1.67-.38,2.48-.67a6.69,6.69,0,0,0,3.17-2.16.93.93,0,0,0,.2-.64,30.36,30.36,0,0,0-1.27-7.51,20.53,20.53,0,0,0-1.69-4.35,2.68,2.68,0,0,0-.94-1A9.17,9.17,0,0,0,23.25,5c-.7-.18-1.42-.31-2.12-.47l-.1.22a1.22,1.22,0,0,0,0,.17c.05,0,.07,0,.1,0l.2.06a13.88,13.88,0,0,1,3.92,1.62.6.6,0,1,1-.62,1L24,7.27a15.21,15.21,0,0,0-7.9-1.56,14.16,14.16,0,0,0-6.57,2,.59.59,0,0,1-.84-.19.58.58,0,0,1,.25-.84c.8-.41,1.61-.81,2.43-1.16.58-.24,1.19-.39,1.81-.58Z"
                    transform="translate(-3.25 -3.26)"
                  />
                  <path
                    d="M10.45,14.88a3.25,3.25,0,0,1,1.07-2.59,2.49,2.49,0,0,1,3.58.29,3.24,3.24,0,0,1,.15,4,2.55,2.55,0,0,1-4.46-.49A6.84,6.84,0,0,1,10.45,14.88Zm4.21-.22.08,0a5.5,5.5,0,0,0-.43-1.09,1.33,1.33,0,0,0-2.29,0,2.07,2.07,0,0,0,.09,2.45,1.33,1.33,0,0,0,2.09,0A2,2,0,0,0,14.66,14.66Z"
                    transform="translate(-3.25 -3.26)"
                  />
                  <path
                    d="M23.66,14.58a3.31,3.31,0,0,1-.73,2.13,2.51,2.51,0,0,1-3.88.06,3.23,3.23,0,0,1,0-4.25,2.58,2.58,0,0,1,4.4,1.06,2.52,2.52,0,0,1,.13.49C23.63,14.26,23.65,14.46,23.66,14.58Zm-4.27.12a5.51,5.51,0,0,0,.39,1.05,1.35,1.35,0,0,0,2.38,0,2.08,2.08,0,0,0-.18-2.4,1.33,1.33,0,0,0-2.05,0A2.53,2.53,0,0,0,19.39,14.7Z"
                    transform="translate(-3.25 -3.26)"
                  />
                  <path
                    d="M14.66,14.66A2,2,0,0,1,14.2,16a1.33,1.33,0,0,1-2.09,0A2.07,2.07,0,0,1,12,13.49a1.33,1.33,0,0,1,2.29,0,5.5,5.5,0,0,1,.43,1.09Z"
                    transform="translate(-3.25 -3.26)"
                    fill="#fff"
                  />
                  <path
                    d="M19.39,14.7a2.53,2.53,0,0,1,.54-1.35,1.33,1.33,0,0,1,2.05,0,2.08,2.08,0,0,1,.18,2.4,1.35,1.35,0,0,1-2.38,0A5.51,5.51,0,0,1,19.39,14.7Z"
                    transform="translate(-3.25 -3.26)"
                    fill="#fff"
                  />
                </svg>
              </div>
              <div className="media git">
                <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14.9883 2.23535C7.74316 2.23242 1.875 8.09766 1.875 15.3369C1.875 21.0615 5.5459 25.9277 10.6582 27.7148C11.3467 27.8877 11.2412 27.3984 11.2412 27.0645V24.7939C7.26562 25.2598 7.10449 22.6289 6.83789 22.1895C6.29883 21.2695 5.02441 21.0352 5.40527 20.5957C6.31055 20.1299 7.2334 20.7129 8.30273 22.292C9.07617 23.4375 10.585 23.2441 11.3496 23.0537C11.5166 22.3652 11.874 21.75 12.3662 21.2725C8.24707 20.5342 6.53027 18.0205 6.53027 15.0322C6.53027 13.582 7.00781 12.249 7.94531 11.1738C7.34766 9.40137 8.00098 7.88379 8.08887 7.6582C9.79102 7.50586 11.5605 8.87695 11.6982 8.98535C12.665 8.72461 13.7695 8.58692 15.0059 8.58692C16.248 8.58692 17.3555 8.73047 18.3311 8.99414C18.6621 8.74219 20.3027 7.56445 21.8848 7.70801C21.9697 7.93359 22.6084 9.41602 22.0459 11.165C22.9951 12.2432 23.4785 13.5879 23.4785 15.041C23.4785 18.0352 21.75 20.5518 17.6191 21.2783C17.973 21.6263 18.2539 22.0412 18.4455 22.499C18.6372 22.9567 18.7357 23.4481 18.7353 23.9443V27.2402C18.7588 27.5039 18.7353 27.7646 19.1748 27.7646C24.3633 26.0156 28.0986 21.1143 28.0986 15.3398C28.0986 8.09766 22.2275 2.23535 14.9883 2.23535Z"
                    fill="#8C8C8C"
                  />
                </svg>
              </div>
            </div>
            <p>hello@derickparadis.ca</p>
            <p>581.235.0650</p>
          </div>
        </div>
        <p className="note">
          For those who do not aim at better design process, my dog has an{" "}
          <a
            href="https://www.instagram.com/bako_theblueheeler/"
            target="_blank"
            className="insta-btn"
          >
            instagram account
          </a>
          .
        </p>
        <p className="copyrights">© 2020 - Dérick Paradis</p>
      </div>
    </footer>
  )
}

export default Foot
