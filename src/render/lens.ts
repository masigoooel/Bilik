// Efek lensa sebagai data + satu fragment shader WebGL.
// Dipakai untuk preview real-time dan render akhir (resolusi penuh) supaya hasilnya identik.

export type LensType =
  | 'fisheye'
  | 'bulge'
  | 'pinch'
  | 'swirl'
  | 'mirror'
  | 'kaleido'
  | 'quad'
  | 'wide'
  | 'wave'
  | 'ripple'
  | 'mirrorY'
  | 'nine'
  | 'glass'
  | 'tunnel'
  | 'tall'
  | 'squash'

export type LensPreset = {
  id: string
  name: string
  type: LensType
  /** kekuatan pada slider 100% */
  strength: number
  /** radius efek, relatif setengah sisi terpendek (1 = sampai tepi) */
  radius?: number
  /** pusat efek bisa mengikuti wajah */
  follow?: boolean
}

export const NO_LENS = 'tanpa'

export const LENSES: LensPreset[] = [
  { id: 'fisheye', name: 'fisheye', type: 'fisheye', strength: 1, radius: 1 },
  { id: 'gembung', name: 'gembung', type: 'bulge', strength: 0.75, radius: 0.85, follow: true },
  { id: 'kempis', name: 'kempis', type: 'pinch', strength: 0.7, radius: 0.85, follow: true },
  { id: 'pusaran', name: 'pusaran', type: 'swirl', strength: 1, radius: 0.9, follow: true },
  { id: 'cermin', name: 'cermin', type: 'mirror', strength: 1 },
  { id: 'kaleidoskop', name: 'kaleidoskop', type: 'kaleido', strength: 0.6 },
  { id: 'empat', name: 'empat', type: 'quad', strength: 1 },
  { id: 'lebar', name: 'lebar', type: 'wide', strength: 1 },
  { id: 'ombak', name: 'ombak', type: 'wave', strength: 1 },
  { id: 'riak', name: 'riak', type: 'ripple', strength: 1, radius: 1, follow: true },
  { id: 'pantul', name: 'pantul', type: 'mirrorY', strength: 1 },
  { id: 'sembilan', name: 'sembilan', type: 'nine', strength: 1 },
  { id: 'kaca', name: 'kaca', type: 'glass', strength: 1 },
  { id: 'terowongan', name: 'terowongan', type: 'tunnel', strength: 1 },
  { id: 'jangkung', name: 'jangkung', type: 'tall', strength: 1, follow: true },
  { id: 'gepeng', name: 'gepeng', type: 'squash', strength: 1, follow: true },
]

const TYPE_INDEX: Record<LensType, number> = {
  fisheye: 0,
  bulge: 1,
  pinch: 2,
  swirl: 3,
  mirror: 4,
  kaleido: 5,
  quad: 6,
  wide: 7,
  wave: 8,
  ripple: 9,
  mirrorY: 10,
  nine: 11,
  glass: 12,
  tunnel: 13,
  tall: 14,
  squash: 15,
}

export function lensById(id: string | null | undefined): LensPreset | null {
  return LENSES.find((l) => l.id === id) ?? null
}

/** lensa susunan (cermin, empat, pantul, sembilan) & terowongan tidak punya kekuatan yang bisa diatur */
const FIXED: LensType[] = ['mirror', 'quad', 'mirrorY', 'nine', 'tunnel']
export const lensHasStrength = (l: LensPreset) => !FIXED.includes(l.type)

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = vec2((a_pos.x + 1.0) * 0.5, (1.0 - a_pos.y) * 0.5);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`

const FRAG = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform vec4 u_crop;      // area crop di tekstur: x, y, w, h (0–1)
uniform float u_aspect;   // lebar/tinggi output
uniform int u_type;       // -1 = tanpa lensa
uniform float u_strength; // 0–1+
uniform float u_radius;
uniform float u_preFlip;  // 1 = cerminkan sumber sebelum lensa
uniform float u_postFlip; // 1 = cerminkan hasil lensa
uniform vec2 u_center;    // pusat efek (lensa yang mengikuti wajah), default 0.5,0.5

const float PI = 3.14159265;

vec4 sampleSrc(vec2 uv) {
  // uv relatif area crop (0–1). di luar frame kamera dipantulkan (bukan hitam / garis melar)
  if (u_preFlip > 0.5) uv.x = 1.0 - uv.x;
  vec2 t = u_crop.xy + uv * u_crop.zw;
  t = 1.0 - abs(1.0 - mod(t, 2.0));
  return texture2D(u_tex, t);
}

// ruang "p": pusat di tengah, sumbu x dikali rasio supaya lingkaran tetap bulat
vec2 toP(vec2 uv) { return (uv - u_center) * vec2(u_aspect, 1.0); }
vec2 fromP(vec2 p) { return p / vec2(u_aspect, 1.0) + u_center; }

float hash(vec2 c) { return fract(sin(dot(c, vec2(127.1, 311.7))) * 43758.5453); }

vec2 hexCell(vec2 uv) {
  vec2 s = vec2(1.0, 1.7320508);
  vec4 hc = floor(vec4(uv, uv - vec2(0.5, 1.0)) / s.xyxy) + 0.5;
  vec4 h = vec4(uv - hc.xy * s, uv - (hc.zw + 0.5) * s);
  return dot(h.xy, h.xy) < dot(h.zw, h.zw) ? h.xy : h.zw;
}

void main() {
  vec2 uv = v_uv;
  if (u_postFlip > 0.5) uv.x = 1.0 - uv.x;
  float s = u_strength;
  float hs = 0.5 * min(u_aspect, 1.0);
  vec2 p = toP(uv);
  float r = length(p);

  if (u_type == 0) {
    // fisheye: barrel di dalam lingkaran, luar lingkaran hitam
    float R = hs * u_radius;
    float nr = r / R;
    if (nr >= 1.0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
    float zoom = 1.0 + 0.45 * s;
    float sr = pow(nr, 1.0 + 1.1 * s) * R * zoom;
    vec2 q = r > 0.0 ? p / r * sr : p;
    vec4 c = sampleSrc(fromP(q));
    float edge = 1.0 - smoothstep(0.965, 1.0, nr);
    float inner = 1.0 - 0.45 * s * pow(nr, 4.0);
    gl_FragColor = vec4(c.rgb * edge * inner, 1.0);
    return;
  }
  if (u_type == 1 || u_type == 2) {
    // gembung (tengah membesar) / kempis (tengah mengecil), pusat di tengah frame
    float R = hs * 2.0 * u_radius;
    float nr = r / R;
    if (nr < 1.0) {
      float w = (1.0 - nr * nr);
      float f = u_type == 1 ? 1.0 - 0.75 * s * w * w : 1.0 + 0.9 * s * w;
      p *= f;
    }
    gl_FragColor = sampleSrc(fromP(p));
    return;
  }
  if (u_type == 3) {
    // pusaran
    float R = hs * 2.0 * u_radius;
    float nr = r / R;
    if (nr < 1.0) {
      float a = s * 5.0 * pow(1.0 - nr, 2.0);
      float cs = cos(a), sn = sin(a);
      p = vec2(p.x * cs - p.y * sn, p.x * sn + p.y * cs);
    }
    gl_FragColor = sampleSrc(fromP(p));
    return;
  }
  if (u_type == 4) {
    // cermin: sisi kiri dipantulkan ke kanan
    if (uv.x > 0.5) uv.x = 1.0 - uv.x;
    gl_FragColor = sampleSrc(uv);
    return;
  }
  if (u_type == 5) {
    // kaleidoskop: grid segi enam, tiap sel dilipat 6 arah
    float cells = mix(1.6, 4.5, s);
    vec2 h = hexCell(p * cells / (hs * 2.0));
    float a = atan(h.y, h.x);
    float seg = PI / 3.0;
    a = mod(a, seg);
    if (a > seg * 0.5) a = seg - a;
    float hr = length(h);
    // irisan 30° diarahkan ke atas pusat (area mata) dan diperluas supaya polanya lebih kaya
    a -= PI * 0.5;
    vec2 q = vec2(cos(a), sin(a)) * hr * 1.35 * (hs * 2.0);
    gl_FragColor = sampleSrc(fromP(q));
    return;
  }
  if (u_type == 6) {
    // empat: grid 2x2 dari frame yang sama
    gl_FragColor = sampleSrc(fract(uv * 2.0));
    return;
  }
  if (u_type == 7) {
    // lebar: skala tengah tetap 1:1, makin ke tepi makin melar seperti lensa wide
    vec2 n = (uv - 0.5) * 2.0;
    float tx = tan(1.05 * s);
    float ty = tan(0.5 * s);
    vec2 q = n;
    if (tx > 0.001) q.x = atan(n.x * tx) / tx;
    if (ty > 0.001) q.y = atan(n.y * ty) / ty;
    gl_FragColor = sampleSrc(q * 0.5 + 0.5);
    return;
  }
  if (u_type == 8) {
    // ombak: baris bergeser mengikuti gelombang sinus
    uv.x += sin(uv.y * 6.2831853 * 3.0) * 0.035 * s;
    uv.y += sin(uv.x * 6.2831853 * 2.0) * 0.012 * s;
    gl_FragColor = sampleSrc(uv);
    return;
  }
  if (u_type == 9) {
    // riak: gelombang melingkar dari tengah, makin ke tepi makin pelan
    float R = hs * 2.0 * u_radius;
    float nr = r / R;
    if (nr < 1.0 && r > 0.0) {
      float amp = 0.018 * s * (1.0 - nr);
      p += p / r * sin(r / hs * 28.0) * amp;
    }
    gl_FragColor = sampleSrc(fromP(p));
    return;
  }
  if (u_type == 10) {
    // pantul: setengah atas dipantulkan ke bawah
    if (uv.y > 0.5) uv.y = 1.0 - uv.y;
    gl_FragColor = sampleSrc(uv);
    return;
  }
  if (u_type == 11) {
    // sembilan: grid 3x3 dari frame yang sama
    gl_FragColor = sampleSrc(fract(uv * 3.0));
    return;
  }
  if (u_type == 12) {
    // kaca: ubin kaca, tiap ubin membiaskan sedikit ke arah acak
    float n = 7.0;
    vec2 cell = floor(uv * n);
    vec2 off = vec2(hash(cell), hash(cell + 17.0)) - 0.5;
    vec2 local = fract(uv * n) - 0.5;
    vec2 q = uv + off * 0.06 * s - local * 0.05 * s;
    vec4 c = sampleSrc(q);
    // garis tipis antar ubin
    float edge = max(abs(local.x), abs(local.y));
    float line = smoothstep(0.47, 0.5, edge) * 0.18 * s;
    gl_FragColor = vec4(c.rgb * (1.0 - line) + line * 0.6, 1.0);
    return;
  }
  if (u_type == 13) {
    // terowongan: frame dililit melingkar; atas frame (langit) di pusat, wajah tegak di bawah, badan di tepi luar
    float R = length(vec2(0.5 * u_aspect, 0.5));
    float a = atan(p.x, p.y);
    float rr = r / R;
    vec2 q = vec2(a / (2.0 * PI) + 0.5, clamp(rr, 0.0, 1.0));
    gl_FragColor = sampleSrc(q);
    return;
  }
  if (u_type == 14 || u_type == 15) {
    // jangkung: wajah memanjang ke atas-bawah / gepeng: melebar & memendek (cermin rumah hantu)
    vec2 n = (uv - u_center) * 2.0;
    float w = exp(-n.x * n.x * 1.6) * exp(-n.y * n.y * 0.8);
    float k = (u_type == 14 ? 0.38 : -0.32) * s * w;
    vec2 q = vec2(n.x * (1.0 + k * 0.8), n.y * (1.0 - k));
    gl_FragColor = sampleSrc(q * 0.5 + u_center);
    return;
  }
  gl_FragColor = sampleSrc(uv);
}`

export type LensDraw = {
  source: TexImageSource
  srcW: number
  srcH: number
  /** area crop di sumber (px) */
  crop: { x: number; y: number; w: number; h: number }
  outW: number
  outH: number
  lens: LensPreset | null
  /** 0–1 */
  strength: number
  preFlip: boolean
  postFlip: boolean
  /** pusat efek di dalam area crop (0–1, orientasi sumber mentah); null = tengah */
  center?: { x: number; y: number } | null
}

/** renderer WebGL tunggal; null kalau WebGL tidak tersedia */
export class LensRenderer {
  readonly canvas: HTMLCanvasElement
  private gl: WebGLRenderingContext
  private loc: Record<string, WebGLUniformLocation | null> = {}
  private tex: WebGLTexture
  readonly maxTexture: number

  static create(): LensRenderer | null {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, premultipliedAlpha: false, antialias: false })
      if (!gl) return null
      return new LensRenderer(canvas, gl)
    } catch {
      return null
    }
  }

  private constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
    this.canvas = canvas
    this.gl = gl
    const prog = gl.createProgram()!
    for (const [type, src] of [
      [gl.VERTEX_SHADER, VERT],
      [gl.FRAGMENT_SHADER, FRAG],
    ] as const) {
      const sh = gl.createShader(type)!
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? 'shader gagal')
      gl.attachShader(prog, sh)
    }
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'link gagal')
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    for (const n of ['u_tex', 'u_crop', 'u_aspect', 'u_type', 'u_strength', 'u_radius', 'u_preFlip', 'u_postFlip', 'u_center'])
      this.loc[n] = gl.getUniformLocation(prog, n)

    this.tex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, this.tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    gl.uniform1i(this.loc.u_tex, 0)
    this.maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number
  }

  /** gambar sumber + lensa ke this.canvas, ukuran outW x outH */
  draw(d: LensDraw): HTMLCanvasElement {
    const gl = this.gl
    if (this.canvas.width !== d.outW || this.canvas.height !== d.outH) {
      this.canvas.width = d.outW
      this.canvas.height = d.outH
    }
    gl.viewport(0, 0, d.outW, d.outH)
    gl.bindTexture(gl.TEXTURE_2D, this.tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, d.source)
    gl.uniform4f(this.loc.u_crop, d.crop.x / d.srcW, d.crop.y / d.srcH, d.crop.w / d.srcW, d.crop.h / d.srcH)
    gl.uniform1f(this.loc.u_aspect, d.outW / d.outH)
    gl.uniform1i(this.loc.u_type, d.lens ? TYPE_INDEX[d.lens.type] : -1)
    gl.uniform1f(this.loc.u_strength, d.lens ? d.lens.strength * d.strength : 0)
    gl.uniform1f(this.loc.u_radius, d.lens?.radius ?? 1)
    gl.uniform1f(this.loc.u_preFlip, d.preFlip ? 1 : 0)
    gl.uniform1f(this.loc.u_postFlip, d.postFlip ? 1 : 0)
    // efek dihitung di orientasi preview (sumber dicerminkan kalau preFlip), jadi pusat wajah ikut dicerminkan.
    // dibatasi supaya efek tidak menempel di tepi frame
    const c = d.center && d.lens?.follow ? d.center : { x: 0.5, y: 0.5 }
    const cx = Math.min(0.8, Math.max(0.2, d.preFlip ? 1 - c.x : c.x))
    const cy = Math.min(0.8, Math.max(0.2, c.y))
    gl.uniform2f(this.loc.u_center, cx, cy)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    return this.canvas
  }
}

let shared: LensRenderer | null | undefined

/** satu renderer untuk seluruh aplikasi (preview, thumbnail, render akhir) */
export function lensRenderer(): LensRenderer | null {
  if (shared === undefined) {
    try {
      shared = LensRenderer.create()
    } catch {
      shared = null
    }
  }
  return shared
}

export const webglAvailable = () => lensRenderer() !== null
