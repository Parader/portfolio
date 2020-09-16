import React from "react"
import gsap, { Linear } from "gsap"
import TextPlugin from "gsap/TextPlugin"

gsap.defaults({ ease: Linear.easeNone })
gsap.registerPlugin(TextPlugin)
class Material {
  constructor(vertexShader, fragmentShaderSource) {
    this.vertexShader = vertexShader
    this.fragmentShaderSource = fragmentShaderSource
    this.programs = []
    this.activeProgram = null
    this.uniforms = []
  }

  setKeywords(keywords) {
    const gl = window.fluidSimulation.gl
    let hash = 0
    for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i])

    let program = this.programs[hash]
    if (program == null) {
      let fragmentShader = compileShader(
        gl.FRAGMENT_SHADER,
        this.fragmentShaderSource,
        keywords
      )
      program = createProgram(this.vertexShader, fragmentShader)
      this.programs[hash] = program
    }

    if (program == this.activeProgram) return

    this.uniforms = getUniforms(program)
    this.activeProgram = program
  }

  bind() {
    const gl = window.fluidSimulation.gl
    gl.useProgram(this.activeProgram)
  }
}

class Program {
  constructor(vertexShader, fragmentShader) {
    this.uniforms = {}
    this.program = createProgram(vertexShader, fragmentShader)
    this.uniforms = getUniforms(this.program)
  }

  bind() {
    const gl = window.fluidSimulation.gl
    gl.useProgram(this.program)
  }
}

class FluidSimulation extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    initFluidSimulation()
  }

  componentWillUnmount() {
    delete window.fluidSimulation
  }

  render() {
    return <div className="fluid-simulation"></div>
  }
}

export default FluidSimulation

const initFluidSimulation = () => {
  if (!window.fluidSimulation) {
    window.fluidSimulation = { pointers: [] }
  }
  window.fluidSimulation.canvas = document.getElementsByTagName("canvas")[0]
  window.fluidSimulation.config = {
    SIM_RESOLUTION: 64,
    DYE_RESOLUTION: 1024,
    CAPTURE_RESOLUTION: 512,
    DENSITY_DISSIPATION: 2.5,
    VELOCITY_DISSIPATION: 12,
    PRESSURE: 0.8,
    PRESSURE_ITERATIONS: 20,
    CURL: 15,
    SPLAT_RADIUS: 0.05,
    SPLAT_FORCE: 6000,
    SHADING: true,
    COLORFUL: false,
    COLOR_UPDATE_SPEED: 1,
    PAUSED: false,
    BACK_COLOR: { r: 249, g: 249, b: 249 },
    TRANSPARENT: false,
    BLOOM: false,
    BLOOM_ITERATIONS: 2,
    BLOOM_RESOLUTION: 32,
    BLOOM_INTENSITY: 0.3,
    BLOOM_THRESHOLD: 0.2,
    BLOOM_SOFT_KNEE: 0.2,
    SUNRAYS: false,
    SUNRAYS_RESOLUTION: 196,
    SUNRAYS_WEIGHT: 1.0,
  }
  window.fluidSimulation.splatStack = []

  resizeCanvas()

  let { gl, ext } = getWebGLContext(window.fluidSimulation.canvas)
  window.fluidSimulation.gl = gl
  window.fluidSimulation.ext = ext
  gl = window.fluidSimulation.gl
  ext = window.fluidSimulation.ext
  if (isMobile()) {
    window.fluidSimulation.config.DYE_RESOLUTION = 512
  }
  if (!ext.supportLinearFiltering) {
    window.fluidSimulation.config.DYE_RESOLUTION = 512
    window.fluidSimulation.config.SHADING = false
    window.fluidSimulation.config.BLOOM = false
    window.fluidSimulation.config.SUNRAYS = false
  }

  const baseVertexShader = compileShader(
    gl.VERTEX_SHADER,
    `
      precision highp float;

      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
          vUv = aPosition * 0.5 + 0.5;
          vL = vUv - vec2(texelSize.x, 0.0);
          vR = vUv + vec2(texelSize.x, 0.0);
          vT = vUv + vec2(0.0, texelSize.y);
          vB = vUv - vec2(0.0, texelSize.y);
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }
  `
  )

  const blurVertexShader = compileShader(
    gl.VERTEX_SHADER,
    `
      precision highp float;

      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      uniform vec2 texelSize;

      void main () {
          vUv = aPosition * 0.5 + 0.5;
          float offset = 1.33333333;
          vL = vUv - texelSize * offset;
          vR = vUv + texelSize * offset;
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }
  `
  )

  const blurShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
      precision mediump float;
      precision mediump sampler2D;

      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      uniform sampler2D uTexture;

      void main () {
          vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
          sum += texture2D(uTexture, vL) * 0.35294117;
          sum += texture2D(uTexture, vR) * 0.35294117;
          gl_FragColor = sum;
      }
  `
  )

  const copyShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
      precision mediump float;
      precision mediump sampler2D;

      varying highp vec2 vUv;
      uniform sampler2D uTexture;

      void main () {
          gl_FragColor = texture2D(uTexture, vUv);
      }
  `
  )

  const clearShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
      precision mediump float;
      precision mediump sampler2D;

      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;

      void main () {
          gl_FragColor = value * texture2D(uTexture, vUv);
      }
  `
  )

  const colorShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
      precision mediump float;

      uniform vec4 color;

      void main () {
          gl_FragColor = color;
      }
  `
  )

  const checkerboardShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
      precision highp float;
      precision highp sampler2D;

      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float aspectRatio;

      #define SCALE 25.0

      void main () {
          vec2 uv = floor(vUv * SCALE * vec2(aspectRatio, 1.0));
          float v = mod(uv.x + uv.y, 2.0);
          v = v * 0.1 + 0.8;
          gl_FragColor = vec4(vec3(v), 1.0);
      }
  `
  )

  const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;

      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uBloom;
      uniform sampler2D uSunrays;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;

      #ifdef SHADING
          vec3 lc = texture2D(uTexture, vL).rgb;
          vec3 rc = texture2D(uTexture, vR).rgb;
          vec3 tc = texture2D(uTexture, vT).rgb;
          vec3 bc = texture2D(uTexture, vB).rgb;

          float dx = length(rc) - length(lc);
          float dy = length(tc) - length(bc);

          vec3 n = normalize(vec3(dx, dy, length(texelSize)));
          vec3 l = vec3(0.0, 0.0, 1.0);

          float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
          c *= diffuse;
      #endif

      #ifdef BLOOM
          vec3 bloom = texture2D(uBloom, vUv).rgb;
      #endif

      #ifdef SUNRAYS
          float sunrays = texture2D(uSunrays, vUv).r;
          c *= sunrays;
      #ifdef BLOOM
          bloom *= sunrays;
      #endif
      #endif

      #ifdef BLOOM
          float noise = texture2D(uDithering, vUv * ditherScale).r;
          noise = noise * 2.0 - 1.0;
          bloom += noise / 255.0;
          bloom = linearToGamma(bloom);
          c += bloom;
      #endif

          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
  `

  const bloomPrefilterShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
      precision mediump float;
      precision mediump sampler2D;

      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform vec3 curve;
      uniform float threshold;

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          float br = max(c.r, max(c.g, c.b));
          float rq = clamp(br - curve.x, 0.0, curve.y);
          rq = curve.z * rq * rq;
          c *= max(rq, br - threshold) / max(br, 0.0001);
          gl_FragColor = vec4(c, 0.0);
      }
  `
  )

  const bloomBlurShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
      precision mediump float;
      precision mediump sampler2D;

      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;

      void main () {
          vec4 sum = vec4(0.0);
          sum += texture2D(uTexture, vL);
          sum += texture2D(uTexture, vR);
          sum += texture2D(uTexture, vT);
          sum += texture2D(uTexture, vB);
          sum *= 0.25;
          gl_FragColor = sum;
      }
  `
  )

  const bloomFinalShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
      precision mediump float;
      precision mediump sampler2D;

      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform float intensity;

      void main () {
          vec4 sum = vec4(0.0);
          sum += texture2D(uTexture, vL);
          sum += texture2D(uTexture, vR);
          sum += texture2D(uTexture, vT);
          sum += texture2D(uTexture, vB);
          sum *= 0.25;
          gl_FragColor = sum * intensity;
      }
  `
  )

  const sunraysMaskShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
      precision highp float;
      precision highp sampler2D;

      varying vec2 vUv;
      uniform sampler2D uTexture;

      void main () {
          vec4 c = texture2D(uTexture, vUv);
          float br = max(c.r, max(c.g, c.b));
          c.a = 1.0 - min(max(br * 20.0, 0.0), 0.8);
          gl_FragColor = c;
      }
  `
  )

  const sunraysShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
      precision highp float;
      precision highp sampler2D;

      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float weight;

      #define ITERATIONS 16

      void main () {
          float Density = 0.3;
          float Decay = 0.95;
          float Exposure = 0.7;

          vec2 coord = vUv;
          vec2 dir = vUv - 0.5;

          dir *= 1.0 / float(ITERATIONS) * Density;
          float illuminationDecay = 1.0;

          float color = texture2D(uTexture, vUv).a;

          for (int i = 0; i < ITERATIONS; i++)
          {
              coord -= dir;
              float col = texture2D(uTexture, coord).a;
              color += col * illuminationDecay * weight;
              illuminationDecay *= Decay;
          }

          gl_FragColor = vec4(color * Exposure, 0.0, 0.0, 1.0);
      }
  `
  )

  const splatShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
      precision highp float;
      precision highp sampler2D;

      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;

      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
  `
  )

  const advectionShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
      precision highp float;
      precision highp sampler2D;

      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;

      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
          vec2 st = uv / tsize - 0.5;

          vec2 iuv = floor(st);
          vec2 fuv = fract(st);

          vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
          vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
          vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
          vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }

      void main () {
      #ifdef MANUAL_FILTERING
          vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
          vec4 result = bilerp(uSource, coord, dyeTexelSize);
      #else
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          vec4 result = texture2D(uSource, coord);
      #endif
          float decay = 1.0 + dissipation * dt;
          gl_FragColor = result / decay;
      }`,
    ext.supportLinearFiltering ? null : ["MANUAL_FILTERING"]
  )

  const divergenceShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
      precision mediump float;
      precision mediump sampler2D;

      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;

          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }

          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
  `
  )

  const curlShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
      precision mediump float;
      precision mediump sampler2D;

      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
  `
  )

  const vorticityShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
      precision highp float;
      precision highp sampler2D;

      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;

      void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;

          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;

          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity += force * dt;
          velocity = min(max(velocity, -1000.0), 1000.0);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
  `
  )

  const pressureShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
      precision mediump float;
      precision mediump sampler2D;

      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float C = texture2D(uPressure, vUv).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
  `
  )

  const gradientSubtractShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
      precision mediump float;
      precision mediump sampler2D;

      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
  `
  )

  window.fluidSimulation.blit = (() => {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    )
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW
    )
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)

    return (target, clear = false) => {
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      } else {
        gl.viewport(0, 0, target.width, target.height)
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo)
      }
      if (clear) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)
      }
      // CHECK_FRAMEBUFFER_STATUS();
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
    }
  })()

  window.fluidSimulation.lastUpdateTime = Date.now()
  window.fluidSimulation.colorUpdateTimer = 0.0
  window.fluidSimulation.dye = null
  window.fluidSimulation.velocity = null
  window.fluidSimulation.divergence = null
  window.fluidSimulation.curl = null
  window.fluidSimulation.pressure = null
  window.fluidSimulation.bloom = null
  window.fluidSimulation.bloomFramebuffers = []
  window.fluidSimulation.sunrays = null
  window.fluidSimulation.sunraysTemp = null

  window.fluidSimulation.ditheringTexture = null

  window.fluidSimulation.blurProgram = new Program(blurVertexShader, blurShader)
  window.fluidSimulation.copyProgram = new Program(baseVertexShader, copyShader)
  window.fluidSimulation.clearProgram = new Program(
    baseVertexShader,
    clearShader
  )
  window.fluidSimulation.colorProgram = new Program(
    baseVertexShader,
    colorShader
  )
  window.fluidSimulation.checkerboardProgram = new Program(
    baseVertexShader,
    checkerboardShader
  )
  window.fluidSimulation.bloomPrefilterProgram = new Program(
    baseVertexShader,
    bloomPrefilterShader
  )
  window.fluidSimulation.bloomBlurProgram = new Program(
    baseVertexShader,
    bloomBlurShader
  )
  window.fluidSimulation.bloomFinalProgram = new Program(
    baseVertexShader,
    bloomFinalShader
  )
  window.fluidSimulation.sunraysMaskProgram = new Program(
    baseVertexShader,
    sunraysMaskShader
  )
  window.fluidSimulation.sunraysProgram = new Program(
    baseVertexShader,
    sunraysShader
  )
  window.fluidSimulation.splatProgram = new Program(
    baseVertexShader,
    splatShader
  )
  window.fluidSimulation.advectionProgram = new Program(
    baseVertexShader,
    advectionShader
  )
  window.fluidSimulation.divergenceProgram = new Program(
    baseVertexShader,
    divergenceShader
  )
  window.fluidSimulation.curlProgram = new Program(baseVertexShader, curlShader)
  window.fluidSimulation.vorticityProgram = new Program(
    baseVertexShader,
    vorticityShader
  )
  window.fluidSimulation.pressureProgram = new Program(
    baseVertexShader,
    pressureShader
  )
  window.fluidSimulation.gradienSubtractProgram = new Program(
    baseVertexShader,
    gradientSubtractShader
  )

  window.fluidSimulation.displayMaterial = new Material(
    baseVertexShader,
    displayShaderSource
  )

  updateKeywords()
  initFramebuffers()
  update()
}

const resizeCanvas = () => {
  const canvas = window.fluidSimulation.canvas
  let width = scaleByPixelRatio(canvas.clientWidth)
  let height = scaleByPixelRatio(canvas.clientHeight)
  if (canvas.width != width || canvas.height != height) {
    canvas.width = width
    canvas.height = height
    return true
  }
  return false
}

const scaleByPixelRatio = input => {
  let pixelRatio = window.devicePixelRatio || 1
  return Math.floor(input * pixelRatio)
}

const updatePointerDownData = (pointer, id, posX, posY) => {
  const canvas = window.fluidSimulation.canvas
  pointer.id = id
  pointer.down = true
  pointer.moved = false
  pointer.texcoordX = posX / canvas.width
  pointer.texcoordY = 1.0 - posY / canvas.height
  pointer.prevTexcoordX = pointer.texcoordX
  pointer.prevTexcoordY = pointer.texcoordY
  pointer.deltaX = 0
  pointer.deltaY = 0
  pointer.color = generateColor()
}

const updatePointerMoveData = (pointer, posX, posY) => {
  const canvas = window.fluidSimulation.canvas
  pointer.prevTexcoordX = pointer.texcoordX
  pointer.prevTexcoordY = pointer.texcoordY
  pointer.texcoordX = posX / canvas.width
  pointer.texcoordY = 1.0 - posY / canvas.height
  pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX)
  pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY)
  pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0
}

const getWebGLContext = canvas => {
  const params = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
  }

  let gl = canvas.getContext("webgl2", params)
  const isWebGL2 = !!gl
  if (!isWebGL2)
    gl =
      canvas.getContext("webgl", params) ||
      canvas.getContext("experimental-webgl", params)

  let halfFloat
  let supportLinearFiltering
  if (isWebGL2) {
    gl.getExtension("EXT_color_buffer_float")
    supportLinearFiltering = gl.getExtension("OES_texture_float_linear")
  } else {
    halfFloat = gl.getExtension("OES_texture_half_float")
    supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear")
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES
  let formatRGBA
  let formatRG
  let formatR

  if (isWebGL2) {
    formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType)
    formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType)
    formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType)
  } else {
    formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
    formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
    formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
  }

  return {
    gl,
    ext: {
      formatRGBA,
      formatRG,
      formatR,
      halfFloatTexType,
      supportLinearFiltering,
    },
  }
}

const isMobile = () => {
  return /Mobi|Android/i.test(navigator.userAgent)
}

const compileShader = (type, source, keywords) => {
  const gl = window.fluidSimulation.gl
  source = addKeywords(source, keywords)

  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    console.trace(gl.getShaderInfoLog(shader))

  return shader
}

const generateColor = (force = false) => {
  let c = HSVtoRGB(Math.random(), 1.0, 1.0)
  // c.r *= 0.15
  // c.g *= 0.15
  // c.b *= 0.15
  let randomNumber = Math.round(Math.random() * 3) + 1
  if (!force) {
    randomNumber = 4
  }
  switch (randomNumber) {
    case 1:
      c = { r: 0.43, g: 0.77, b: 0.83 }
      break
    case 2:
      c = { r: 0.5, g: 0.31, b: 0.96 }
      break
    case 3:
      c = { r: 0.9, g: 0.9, b: 0.4 }
      break
    case 4:
      c = { r: 0.2, g: 0.5, b: 0.7 }
      break
    case 5:
      c = { r: 0.3, g: 0.1, b: 0.7 }
      break
    case 6:
      c = { r: 0.5, g: 0.3, b: 0 }
      break
    case 7:
      c = { r: 0.6, g: 0.1, b: 0 }
      break
    default:
      c = { r: 0.6, g: 0.2, b: 0 }
      break
  }

  c.r *= 0.2
  c.g *= 0.2
  c.b *= 0.2

  return c
}

const correctDeltaX = delta => {
  const canvas = window.fluidSimulation.canvas
  let aspectRatio = canvas.width / canvas.height
  if (aspectRatio < 1) delta *= aspectRatio
  return delta
}

const correctDeltaY = delta => {
  const canvas = window.fluidSimulation.canvas
  let aspectRatio = canvas.width / canvas.height
  if (aspectRatio > 1) delta /= aspectRatio
  return delta
}

const getSupportedFormat = (gl, internalFormat, format, type) => {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    switch (internalFormat) {
      case gl.R16F:
        return getSupportedFormat(gl, gl.RG16F, gl.RG, type)
      case gl.RG16F:
        return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type)
      default:
        return null
    }
  }

  return {
    internalFormat,
    format,
  }
}

const addKeywords = (source, keywords) => {
  if (keywords == null) return source
  let keywordsString = ""
  keywords.forEach(keyword => {
    keywordsString += "#define " + keyword + "\n"
  })
  return keywordsString + source
}

const HSVtoRGB = (h, s, v) => {
  let r, g, b, i, f, p, q, t
  i = Math.floor(h * 6)
  f = h * 6 - i
  p = v * (1 - s)
  q = v * (1 - f * s)
  t = v * (1 - (1 - f) * s)

  switch (i % 6) {
    case 0:
      r = v
      g = t
      b = p
      break
    case 1:
      r = q
      g = v
      b = p
      break
    case 2:
      r = p
      g = v
      b = t
      break
    case 3:
      r = p
      g = q
      b = v
      break
    case 4:
      r = t
      g = p
      b = v
      break
    case 5:
      r = v
      g = p
      b = q
      break
  }

  return {
    r,
    g,
    b,
  }
}

const supportRenderTextureFormat = (gl, internalFormat, format, type) => {
  let texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null)

  let fbo = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  )

  let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
  return status == gl.FRAMEBUFFER_COMPLETE
}

const hashCode = s => {
  if (s.length == 0) return 0
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

const createProgram = (vertexShader, fragmentShader) => {
  const gl = window.fluidSimulation.gl
  let program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    console.trace(gl.getProgramInfoLog(program))

  return program
}

const getUniforms = program => {
  const gl = window.fluidSimulation.gl
  let uniforms = []
  let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < uniformCount; i++) {
    let uniformName = gl.getActiveUniform(program, i).name
    uniforms[uniformName] = gl.getUniformLocation(program, uniformName)
  }
  return uniforms
}

export function pointerPrototype() {
  this.id = -1
  this.texcoordX = 0
  this.texcoordY = 0
  this.prevTexcoordX = 0
  this.prevTexcoordY = 0
  this.deltaX = 0
  this.deltaY = 0
  this.down = false
  this.moved = false
  this.color = [30, 0, 300]
}

const createTextureAsync = url => {
  const gl = window.fluidSimulation.gl
  let texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGB,
    1,
    1,
    0,
    gl.RGB,
    gl.UNSIGNED_BYTE,
    new Uint8Array([255, 255, 255])
  )

  let obj = {
    texture,
    width: 1,
    height: 1,
    attach(id) {
      gl.activeTexture(gl.TEXTURE0 + id)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      return id
    },
  }

  let image = new Image()
  image.onload = () => {
    obj.width = image.width
    obj.height = image.height
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
  }
  image.src = url

  return obj
}

const multipleSplats = amount => {
  for (let i = 0; i < amount; i++) {
    const color = generateColor(true)
    color.r *= 10.0
    color.g *= 10.0
    color.b *= 10.0
    const x = Math.random()
    const y = Math.random()
    const dx = 1000 * (Math.random() - 0.5)
    const dy = 1000 * (Math.random() - 0.5)
    splat(x, y, dx, dy, color)
  }
}

const correctRadius = radius => {
  const { canvas } = window.fluidSimulation
  let aspectRatio = canvas.width / canvas.height
  if (aspectRatio > 1) radius *= aspectRatio
  return radius
}

const splat = (x, y, dx, dy, color) => {
  const {
    splatProgram,
    velocity,
    canvas,
    gl,
    config,
    blit,
    dye,
  } = window.fluidSimulation
  splatProgram.bind()
  gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0))
  gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height)
  gl.uniform2f(splatProgram.uniforms.point, x, y)
  gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0)
  gl.uniform1f(
    splatProgram.uniforms.radius,
    correctRadius(config.SPLAT_RADIUS / 100.0)
  )
  blit(velocity.write)
  velocity.swap()

  gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0))
  gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b)
  blit(dye.write)
  dye.swap()
}

const updateKeywords = () => {
  const { config, displayMaterial } = window.fluidSimulation
  let displayKeywords = []
  if (config.SHADING) displayKeywords.push("SHADING")
  if (config.BLOOM) displayKeywords.push("BLOOM")
  if (config.SUNRAYS) displayKeywords.push("SUNRAYS")
  displayMaterial.setKeywords(displayKeywords)
}

const initFramebuffers = () => {
  let {
    gl,
    config,
    ext,
    dye,
    velocity,
    divergence,
    curl,
    pressure,
  } = window.fluidSimulation
  let simRes = getResolution(config.SIM_RESOLUTION)
  let dyeRes = getResolution(config.DYE_RESOLUTION)

  const texType = ext.halfFloatTexType
  const rgba = ext.formatRGBA
  const rg = ext.formatRG
  const r = ext.formatR
  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST

  gl.disable(gl.BLEND)

  if (dye == null)
    window.fluidSimulation.dye = createDoubleFBO(
      dyeRes.width,
      dyeRes.height,
      rgba.internalFormat,
      rgba.format,
      texType,
      filtering
    )
  else
    window.fluidSimulation.dye = resizeDoubleFBO(
      dye,
      dyeRes.width,
      dyeRes.height,
      rgba.internalFormat,
      rgba.format,
      texType,
      filtering
    )

  if (velocity == null)
    window.fluidSimulation.velocity = createDoubleFBO(
      simRes.width,
      simRes.height,
      rg.internalFormat,
      rg.format,
      texType,
      filtering
    )
  else
    window.fluidSimulation.velocity = resizeDoubleFBO(
      velocity,
      simRes.width,
      simRes.height,
      rg.internalFormat,
      rg.format,
      texType,
      filtering
    )

  window.fluidSimulation.divergence = createFBO(
    simRes.width,
    simRes.height,
    r.internalFormat,
    r.format,
    texType,
    gl.NEAREST
  )
  window.fluidSimulation.curl = createFBO(
    simRes.width,
    simRes.height,
    r.internalFormat,
    r.format,
    texType,
    gl.NEAREST
  )
  window.fluidSimulation.pressure = createDoubleFBO(
    simRes.width,
    simRes.height,
    r.internalFormat,
    r.format,
    texType,
    gl.NEAREST
  )

  initBloomFramebuffers()
  initSunraysFramebuffers()
}

const getResolution = resolution => {
  const { gl } = window.fluidSimulation
  let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight
  if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio

  let min = Math.round(resolution)
  let max = Math.round(resolution * aspectRatio)

  if (gl.drawingBufferWidth > gl.drawingBufferHeight)
    return { width: max, height: min }
  else return { width: min, height: max }
}

const createDoubleFBO = (w, h, internalFormat, format, type, param) => {
  let fbo1 = createFBO(w, h, internalFormat, format, type, param)
  let fbo2 = createFBO(w, h, internalFormat, format, type, param)

  return {
    width: w,
    height: h,
    texelSizeX: fbo1.texelSizeX,
    texelSizeY: fbo1.texelSizeY,
    get read() {
      return fbo1
    },
    set read(value) {
      fbo1 = value
    },
    get write() {
      return fbo2
    },
    set write(value) {
      fbo2 = value
    },
    swap() {
      let temp = fbo1
      fbo1 = fbo2
      fbo2 = temp
    },
  }
}

const resizeDoubleFBO = (target, w, h, internalFormat, format, type, param) => {
  if (target.width == w && target.height == h) return target
  target.read = resizeFBO(
    target.read,
    w,
    h,
    internalFormat,
    format,
    type,
    param
  )
  target.write = createFBO(w, h, internalFormat, format, type, param)
  target.width = w
  target.height = h
  target.texelSizeX = 1.0 / w
  target.texelSizeY = 1.0 / h
  return target
}

const createFBO = (w, h, internalFormat, format, type, param) => {
  const { gl } = window.fluidSimulation
  gl.activeTexture(gl.TEXTURE0)
  let texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)

  let fbo = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  )
  gl.viewport(0, 0, w, h)
  gl.clear(gl.COLOR_BUFFER_BIT)

  let texelSizeX = 1.0 / w
  let texelSizeY = 1.0 / h

  return {
    texture,
    fbo,
    width: w,
    height: h,
    texelSizeX,
    texelSizeY,
    attach(id) {
      gl.activeTexture(gl.TEXTURE0 + id)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      return id
    },
  }
}

const initBloomFramebuffers = () => {
  let { gl, config, ext, bloom, bloomFramebuffers } = window.fluidSimulation
  let res = getResolution(config.BLOOM_RESOLUTION)

  const texType = ext.halfFloatTexType
  const rgba = ext.formatRGBA
  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST

  bloom = createFBO(
    res.width,
    res.height,
    rgba.internalFormat,
    rgba.format,
    texType,
    filtering
  )

  bloomFramebuffers.length = 0
  for (let i = 0; i < config.BLOOM_ITERATIONS; i++) {
    let width = res.width >> (i + 1)
    let height = res.height >> (i + 1)

    if (width < 2 || height < 2) break

    let fbo = createFBO(
      width,
      height,
      rgba.internalFormat,
      rgba.format,
      texType,
      filtering
    )
    bloomFramebuffers.push(fbo)
  }
}

const initSunraysFramebuffers = () => {
  let { config, ext, gl, sunrays, sunraysTemp } = window.fluidSimulation
  let res = getResolution(config.SUNRAYS_RESOLUTION)

  const texType = ext.halfFloatTexType
  const r = ext.formatR
  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST

  sunrays = createFBO(
    res.width,
    res.height,
    r.internalFormat,
    r.format,
    texType,
    filtering
  )
  sunraysTemp = createFBO(
    res.width,
    res.height,
    r.internalFormat,
    r.format,
    texType,
    filtering
  )
}

const resizeFBO = (target, w, h, internalFormat, format, type, param) => {
  let { gl, copyProgram, blit } = window.fluidSimulation
  let newFBO = createFBO(w, h, internalFormat, format, type, param)
  copyProgram.bind()
  gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0))
  blit(newFBO)
  return newFBO
}

const update = () => {
  let { config } = window.fluidSimulation
  const dt = calcDeltaTime()
  if (resizeCanvas()) initFramebuffers()
  updateColors(dt)
  applyInputs()
  if (!config.PAUSED) step(dt)
  render(null)
  requestAnimationFrame(update)
}

const calcDeltaTime = () => {
  let now = Date.now()
  let dt = (now - window.fluidSimulation.lastUpdateTime) / 1000
  dt = Math.min(dt, 0.016666)
  window.fluidSimulation.lastUpdateTime = now
  return dt
}

const updateColors = dt => {
  let { config, colorUpdateTimer } = window.fluidSimulation
  if (!config.COLORFUL) return

  colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED
  if (colorUpdateTimer >= 1) {
    colorUpdateTimer = wrap(colorUpdateTimer, 0, 1)
    window.fluidSimulation.pointers.forEach(p => {
      p.color = generateColor()
    })
  }
}

const applyInputs = () => {
  let { splatStack } = window.fluidSimulation
  if (splatStack.length > 0) multipleSplats(splatStack.pop())

  if (window.fluidSimulation) {
    window.fluidSimulation.pointers.forEach(p => {
      if (p.proto.moved) {
        p.proto.moved = false
        splatPointer(p.proto)
      }
    })
  }
}

const step = dt => {
  let {
    gl,
    curlProgram,
    velocity,
    blit,
    curl,
    vorticityProgram,
    config,
    divergenceProgram,
    divergence,
    clearProgram,
    pressure,
    pressureProgram,
    gradienSubtractProgram,
    advectionProgram,
    ext,
    dye,
  } = window.fluidSimulation
  gl.disable(gl.BLEND)

  curlProgram.bind()
  gl.uniform2f(
    curlProgram.uniforms.texelSize,
    velocity.texelSizeX,
    velocity.texelSizeY
  )
  gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0))
  blit(curl)

  vorticityProgram.bind()
  gl.uniform2f(
    vorticityProgram.uniforms.texelSize,
    velocity.texelSizeX,
    velocity.texelSizeY
  )
  gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0))
  gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1))
  gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL)
  gl.uniform1f(vorticityProgram.uniforms.dt, dt)
  blit(velocity.write)
  velocity.swap()

  divergenceProgram.bind()
  gl.uniform2f(
    divergenceProgram.uniforms.texelSize,
    velocity.texelSizeX,
    velocity.texelSizeY
  )
  gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0))
  blit(divergence)

  clearProgram.bind()
  gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0))
  gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE)
  blit(pressure.write)
  pressure.swap()

  pressureProgram.bind()
  gl.uniform2f(
    pressureProgram.uniforms.texelSize,
    velocity.texelSizeX,
    velocity.texelSizeY
  )
  gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0))
  for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
    gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1))
    blit(pressure.write)
    pressure.swap()
  }

  gradienSubtractProgram.bind()
  gl.uniform2f(
    gradienSubtractProgram.uniforms.texelSize,
    velocity.texelSizeX,
    velocity.texelSizeY
  )
  gl.uniform1i(
    gradienSubtractProgram.uniforms.uPressure,
    pressure.read.attach(0)
  )
  gl.uniform1i(
    gradienSubtractProgram.uniforms.uVelocity,
    velocity.read.attach(1)
  )
  blit(velocity.write)
  velocity.swap()

  advectionProgram.bind()
  gl.uniform2f(
    advectionProgram.uniforms.texelSize,
    velocity.texelSizeX,
    velocity.texelSizeY
  )
  if (!ext.supportLinearFiltering)
    gl.uniform2f(
      advectionProgram.uniforms.dyeTexelSize,
      velocity.texelSizeX,
      velocity.texelSizeY
    )
  let velocityId = velocity.read.attach(0)
  gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId)
  gl.uniform1i(advectionProgram.uniforms.uSource, velocityId)
  gl.uniform1f(advectionProgram.uniforms.dt, dt)
  gl.uniform1f(
    advectionProgram.uniforms.dissipation,
    config.VELOCITY_DISSIPATION
  )
  blit(velocity.write)
  velocity.swap()

  if (!ext.supportLinearFiltering)
    gl.uniform2f(
      advectionProgram.uniforms.dyeTexelSize,
      dye.texelSizeX,
      dye.texelSizeY
    )
  gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0))
  gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1))
  gl.uniform1f(
    advectionProgram.uniforms.dissipation,
    config.DENSITY_DISSIPATION
  )
  blit(dye.write)
  dye.swap()
}

const render = target => {
  const { config, dye, sunrays, gl } = window.fluidSimulation
  // if (config.BLOOM) applyBloom(dye.read, bloom)
  // if (config.SUNRAYS) {
  //   applySunrays(dye.read, dye.write, sunrays)
  //   blur(sunrays, sunraysTemp, 1)
  // }

  if (target == null || !config.TRANSPARENT) {
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
  } else {
    gl.disable(gl.BLEND)
  }

  if (!config.TRANSPARENT) drawColor(target, normalizeColor(config.BACK_COLOR))
  // if (target == null && config.TRANSPARENT) drawCheckerboard(target)
  drawDisplay(target)
}

const wrap = (value, min, max) => {
  let range = max - min
  if (range == 0) return min
  return ((value - min) % range) + min
}

const splatPointer = pointer => {
  const { config } = window.fluidSimulation
  let dx = pointer.deltaX * config.SPLAT_FORCE
  let dy = pointer.deltaY * config.SPLAT_FORCE
  splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color)
}

const drawColor = (target, color) => {
  const { colorProgram, gl, blit } = window.fluidSimulation
  colorProgram.bind()
  gl.uniform4f(colorProgram.uniforms.color, color.r, color.g, color.b, 1)
  blit(target)
}

const normalizeColor = input => {
  let output = {
    r: input.r / 255,
    g: input.g / 255,
    b: input.b / 255,
  }
  return output
}

const drawDisplay = target => {
  const {
    gl,
    config,
    displayMaterial,
    dye,
    bloom,
    ditheringTexture,
    blit,
  } = window.fluidSimulation
  let width = target == null ? gl.drawingBufferWidth : target.width
  let height = target == null ? gl.drawingBufferHeight : target.height

  displayMaterial.bind()
  if (config.SHADING)
    gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height)
  gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0))
  if (config.BLOOM) {
    gl.uniform1i(displayMaterial.uniforms.uBloom, bloom.attach(1))
    gl.uniform1i(
      displayMaterial.uniforms.uDithering,
      ditheringTexture.attach(2)
    )
    // let scale = getTextureScale(ditheringTexture, width, height)
    // gl.uniform2f(displayMaterial.uniforms.ditherScale, scale.x, scale.y)
  }
  // if (config.SUNRAYS)
  //   gl.uniform1i(displayMaterial.uniforms.uSunrays, sunrays.attach(3))
  blit(target)
}

export {
  updatePointerMoveData,
  updatePointerDownData,
  scaleByPixelRatio,
  multipleSplats,
}
