import React from "react"
import PropTypes from "prop-types"

export default function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        <canvas></canvas>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
            `,
          }}
        />
        {/*  <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `var script = document.createElement("script");
                    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js";
                    script.async = false;
                    var script2 = document.createElement("script");
                    script2.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TimelineMax.min.js";
                    script2.async = false;
                    var script3 = document.createElement("script");
                    script3.src = "/gsap/plugins/CSSPlugin.min.js";
                    script3.async = false;
                    var script4 = document.createElement("script");
                    script4.src = "/gsap/plugins/MorphSVGPlugin.min.js";
                    script4.async = false;
                    var script5 = document.createElement("script");
                    script5.src = "/gsap/easing/CustomEase.min.js";
                    script5.async = false;
                    var script6 = document.createElement("script");
                    script6.src = "/gsap/plugins/DrawSVGPlugin.min.js";
                    script6.async = false;
                    var script7 = document.createElement("script");
                    script7.src = "/gsap/plugins/findShapeIndex.js";
                    script7.async = false;
                    var script9 = document.createElement("script");
                    script9.src = "/gsap/utils/SplitText.min.js";
                    script9.async = false;
                    var script13 = document.createElement("script");
                    script13.src = "/gsap/plugins/BezierPlugin.min.js";
                    script13.async = false;
                    document.body.appendChild(script)
                    document.body.appendChild(script3)
                    document.body.appendChild(script4)
                    document.body.appendChild(script2)
                    document.body.appendChild(script5)
                    document.body.appendChild(script6)
                    document.body.appendChild(script7)
                    document.body.appendChild(script9)
                    document.body.appendChild(script13)

                    window.activeButtons = []`,
          }}
        /> */}
        {props.preBodyComponents}
        <noscript key="noscript" id="gatsby-noscript">
          This app works best with JavaScript enabled.
        </noscript>
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
    </html>
  )
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}
