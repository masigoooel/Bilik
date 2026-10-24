type Ctx = CanvasRenderingContext2D

/** roundRect manual (ctx.roundRect belum ada di Safari lama) */
export function roundRectPath(ctx: Ctx, x: number, y: number, w: number, h: number, r = 0) {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2))
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.lineTo(x + w - rr, y)
  ctx.arcTo(x + w, y, x + w, y + rr, rr)
  ctx.lineTo(x + w, y + h - rr)
  ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr)
  ctx.lineTo(x + rr, y + h)
  ctx.arcTo(x, y + h, x, y + h - rr, rr)
  ctx.lineTo(x, y + rr)
  ctx.arcTo(x, y, x + rr, y, rr)
  ctx.closePath()
}

export function sparklePath(ctx: Ctx, cx: number, cy: number, r: number) {
  const k = r * 0.14
  ctx.beginPath()
  ctx.moveTo(cx, cy - r)
  ctx.quadraticCurveTo(cx + k, cy - k, cx + r, cy)
  ctx.quadraticCurveTo(cx + k, cy + k, cx, cy + r)
  ctx.quadraticCurveTo(cx - k, cy + k, cx - r, cy)
  ctx.quadraticCurveTo(cx - k, cy - k, cx, cy - r)
  ctx.closePath()
}

export function starPath(ctx: Ctx, cx: number, cy: number, r: number, points = 5, inner = 0.5) {
  ctx.beginPath()
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : r * inner
    const a = (Math.PI * i) / points - Math.PI / 2
    const x = cx + Math.cos(a) * rad
    const y = cy + Math.sin(a) * rad
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
}

export function heartPath(ctx: Ctx, cx: number, cy: number, s: number) {
  const P = (x: number, y: number) => [cx + x * s, cy + y * s] as const
  ctx.beginPath()
  ctx.moveTo(...P(0, 0.42))
  ctx.bezierCurveTo(...P(-0.05, 0.36), ...P(-0.5, 0.08), ...P(-0.5, -0.16))
  ctx.bezierCurveTo(...P(-0.5, -0.42), ...P(-0.16, -0.52), ...P(0, -0.28))
  ctx.bezierCurveTo(...P(0.16, -0.52), ...P(0.5, -0.42), ...P(0.5, -0.16))
  ctx.bezierCurveTo(...P(0.5, 0.08), ...P(0.05, 0.36), ...P(0, 0.42))
  ctx.closePath()
}
