/* Domain motif engine — small canvas animations that match each project's domain.
 * Shared by Home.dc.html (card header strips) and ProjectDetail.dc.html (featured panel).
 * Each draw fn: (ctx, w, h, t, hov) => void  — clears + paints one frame. hov is 0..1.
 */
export const C = {
  cyan: '#21D9D2', cyanHi: '#3EE9E2', cyanLo: 'rgba(33,217,210,', mag: '#F6479A',
  green: '#46DE8B', amber: '#FFB224', line: '#232C38', faint: '#1A212B',
  fg3: '#79838F', fg4: '#525C68', ink: '#0A0C0F', surf: '#131820',
};

function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
const cy = (a) => C.cyanLo + a + ')';

/* ── MIRA · radar / asset tracking ── */
function radar(ctx, w, h, t, hov) {
  ctx.clearRect(0, 0, w, h);
  // faint grid
  ctx.fillStyle = C.faint;
  for (let x = 8; x < w; x += 18) for (let y = 8; y < h; y += 18) { ctx.fillRect(x, y, 1.4, 1.4); }
  // sweep bar
  const sx = ((t * 0.16) % 1) * w;
  const g = ctx.createLinearGradient(sx - 40, 0, sx, 0);
  g.addColorStop(0, cy(0)); g.addColorStop(1, cy(0.18 + hov * 0.12));
  ctx.fillStyle = g; ctx.fillRect(sx - 40, 0, 40, h);
  ctx.strokeStyle = cy(0.5); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, h); ctx.stroke();
  // blips
  const blips = [[0.18, 0.4], [0.46, 0.66], [0.7, 0.32], [0.86, 0.6]];
  blips.forEach((b, i) => {
    const bx = b[0] * w, by = b[1] * h;
    const p = ((t * 0.55) + i * 0.27) % 1;
    ctx.strokeStyle = cy((1 - p) * 0.7); ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(bx, by, p * (11 + hov * 6), 0, 7); ctx.stroke();
    ctx.fillStyle = C.cyanHi; ctx.beginPath(); ctx.arc(bx, by, 2.1, 0, 7); ctx.fill();
  });
  // drifting asset
  for (let i = 0; i < 2; i++) {
    const dx = (0.22 + 0.5 * ((t * 0.07 + i * 0.5) % 1)) * w;
    const dyy = h * (0.5 + (i ? 0.22 : -0.2) * Math.sin(t * 1.2 + i));
    ctx.fillStyle = i ? C.mag : C.cyan;
    ctx.beginPath(); ctx.arc(dx, dyy, 2.4, 0, 7); ctx.fill();
  }
}

/* ── Clappit · rolling deploy ── */
function deploy(ctx, w, h, t, hov) {
  ctx.clearRect(0, 0, w, h);
  const N = 4, bw = Math.min(40, w / (N + 1.6)), gap = (w - bw * N) / (N + 1), by = h * 0.28, bh = h * 0.44;
  const wave = (t * 0.7) % (N + 1.4);
  for (let i = 0; i < N; i++) {
    const x = gap + i * (bw + gap);
    const prog = Math.max(0, Math.min(1, wave - i));
    ctx.strokeStyle = prog > 0 ? cy(0.5) : C.line; ctx.lineWidth = 1.2;
    rr(ctx, x, by, bw, bh, 4); ctx.stroke();
    if (prog > 0) {
      const done = prog >= 1;
      ctx.fillStyle = done ? 'rgba(70,222,139,0.22)' : cy(0.18);
      rr(ctx, x, by + bh * (1 - prog), bw, bh * prog, 4); ctx.fill();
      if (done) { ctx.strokeStyle = C.green; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x + bw * 0.3, by + bh * 0.52); ctx.lineTo(x + bw * 0.45, by + bh * 0.66); ctx.lineTo(x + bw * 0.72, by + bh * 0.36); ctx.stroke(); }
    }
  }
  // progress dot along top rail
  ctx.strokeStyle = C.faint; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(gap, by - 7); ctx.lineTo(w - gap, by - 7); ctx.stroke();
  const px = gap + (wave / (N + 1.4)) * (w - 2 * gap);
  ctx.fillStyle = C.cyanHi; ctx.beginPath(); ctx.arc(px, by - 7, 2.6, 0, 7); ctx.fill();
}

/* ── GSK Expense · approval flow ── */
function approve(ctx, w, h, t, hov) {
  ctx.clearRect(0, 0, w, h);
  const xs = [0.22, 0.5, 0.78], yy = h * 0.5, R = Math.min(9, h * 0.2);
  // connectors
  ctx.strokeStyle = C.line; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(xs[0] * w + R, yy); ctx.lineTo(xs[2] * w - R, yy); ctx.stroke();
  const tok = (t * 0.5) % 2.4; // 0..2 travels, pause to 2.4
  const seg = Math.min(2, tok);
  const tx = (xs[0] + (xs[2] - xs[0]) * (seg / 2)) * w;
  // progress fill on connector
  ctx.strokeStyle = cy(0.7); ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(xs[0] * w + R, yy); ctx.lineTo(tx, yy); ctx.stroke();
  xs.forEach((xp, i) => {
    const x = xp * w; const passed = seg / 2 >= i / 2 - 0.02;
    const done = seg / 2 > i / 2 + 0.02 || (i < 2 && seg / 2 >= (i + 1) / 2);
    ctx.fillStyle = C.ink; ctx.strokeStyle = passed ? (i === 2 && tok > 1.9 ? C.green : C.cyan) : C.line; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, yy, R, 0, 7); ctx.fill(); ctx.stroke();
    if (passed) {
      ctx.strokeStyle = (i === 2 && tok > 1.9) ? C.green : C.cyan; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x - R * 0.42, yy + R * 0.05); ctx.lineTo(x - R * 0.12, yy + R * 0.36); ctx.lineTo(x + R * 0.45, yy - R * 0.34); ctx.stroke();
    }
  });
  // traveling token
  ctx.fillStyle = C.cyanHi; ctx.beginPath(); ctx.arc(tx, yy, 2.4, 0, 7); ctx.fill();
}

/* ── GSK Order · Kafka event stream ── */
function kafka(ctx, w, h, t, hov) {
  ctx.clearRect(0, 0, w, h);
  const lanes = [h * 0.36, h * 0.64];
  lanes.forEach((ly) => { ctx.strokeStyle = C.faint; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(w, ly); ctx.stroke(); });
  // event ticks streaming
  const n = 16, sp = 0.22;
  for (let k = 0; k < n; k++) {
    const u = ((t * sp) + k / n) % 1; const x = u * (w + 20) - 10;
    const ly = lanes[k % 2];
    const a = Math.sin(u * Math.PI) * 0.8;
    ctx.strokeStyle = cy(a); ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(x, ly - 4); ctx.lineTo(x, ly + 4); ctx.stroke();
  }
  // order packets
  for (let i = 0; i < 3; i++) {
    const u = ((t * (0.14 + i * 0.03)) + i * 0.3) % 1; const x = u * (w + 24) - 12;
    const ly = lanes[i % 2]; const s = 6;
    ctx.fillStyle = i === 1 ? 'rgba(246,71,154,0.85)' : cy(0.85);
    rr(ctx, x - s / 2, ly - s / 2, s, s, 1.6); ctx.fill();
  }
}

/* ── eKYC · ID scan + face match ── */
function scan(ctx, w, h, t, hov) {
  ctx.clearRect(0, 0, w, h);
  const cw = Math.min(w * 0.66, 150), ch = h * 0.6, cx = (w - cw) / 2, cyy = (h - ch) / 2;
  ctx.fillStyle = C.surf; ctx.strokeStyle = C.line; ctx.lineWidth = 1.2;
  rr(ctx, cx, cyy, cw, ch, 6); ctx.fill(); ctx.stroke();
  // photo box
  const pw = ch * 0.62, px = cx + 8, py = cyy + (ch - pw) / 2;
  ctx.strokeStyle = C.fg4; ctx.lineWidth = 1; rr(ctx, px, py, pw, pw, 3); ctx.stroke();
  // face dot
  ctx.fillStyle = C.fg3; ctx.beginPath(); ctx.arc(px + pw / 2, py + pw * 0.4, pw * 0.16, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(px + pw / 2, py + pw * 0.95, pw * 0.32, Math.PI, 0); ctx.fill();
  // text lines
  ctx.fillStyle = C.faint;
  for (let i = 0; i < 3; i++) ctx.fillRect(px + pw + 8, py + 3 + i * (pw / 3.2), cw - pw - 22, 2.4);
  // scan line
  const sy = cyy + (Math.sin(t * 1.6) * 0.5 + 0.5) * ch;
  const near = Math.abs(sy - (py + pw / 2)) < pw * 0.5;
  const gg = ctx.createLinearGradient(cx, sy - 8, cx, sy + 8);
  gg.addColorStop(0, cy(0)); gg.addColorStop(0.5, cy(0.5 + hov * 0.2)); gg.addColorStop(1, cy(0));
  ctx.fillStyle = gg; ctx.fillRect(cx, sy - 8, cw, 16);
  ctx.strokeStyle = cy(0.8); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx, sy); ctx.lineTo(cx + cw, sy); ctx.stroke();
  // face brackets (lock green when scan passes)
  const col = near ? C.green : C.cyan; const bl = pw * 0.28;
  ctx.strokeStyle = col; ctx.lineWidth = 1.6;
  const corners = [[px, py, 1, 1], [px + pw, py, -1, 1], [px, py + pw, 1, -1], [px + pw, py + pw, -1, -1]];
  corners.forEach(([qx, qy, sx, sy2]) => { ctx.beginPath(); ctx.moveTo(qx + sx * bl, qy); ctx.lineTo(qx, qy); ctx.lineTo(qx, qy + sy2 * bl); ctx.stroke(); });
}

/* ── E-commerce · storefront → add to cart ── */
function cart(ctx, w, h, t, hov) {
  ctx.clearRect(0, 0, w, h);
  const s = Math.min(h * 0.32, 15);                  // cart unit size
  const cartX = w - Math.max(24, s * 1.7), cartY = h * 0.54;
  const cycle = 1.3;
  const phase = (t % cycle) / cycle;
  const idx = Math.floor(t / cycle) % 3;
  const count = (Math.floor(t / cycle) % 9) + 1;
  const cols = [C.cyan, C.mag, C.green];
  // product tiles (with image + price lines)
  const tiles = 3, areaW = cartX - s - 16;
  const tileW = Math.min(38, (areaW - 8 * (tiles - 1)) / tiles), tileH = h * 0.62, ty = (h - tileH) / 2;
  for (let i = 0; i < tiles; i++) {
    const x = 6 + i * (tileW + 8);
    const active = i === idx && phase < 0.58;
    const lift = active ? Math.sin(Math.min(1, phase / 0.16) * Math.PI) * -3 : 0;
    ctx.fillStyle = C.surf; ctx.strokeStyle = active ? cy(0.65) : C.line; ctx.lineWidth = 1.2;
    rr(ctx, x, ty + lift, tileW, tileH, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = active ? cols[i % 3] : '#243040';
    rr(ctx, x + 3, ty + lift + 3, tileW - 6, tileH * 0.46, 2.5); ctx.fill();
    ctx.fillStyle = active ? cy(0.5) : C.fg4; ctx.fillRect(x + 3, ty + lift + tileH * 0.62, tileW * 0.55, 2.2);
    ctx.fillStyle = C.fg4; ctx.fillRect(x + 3, ty + lift + tileH * 0.78, tileW * 0.34, 2);
  }
  // item flying into the cart
  if (phase > 0.16 && phase < 0.82) {
    const p = (phase - 0.16) / 0.66;
    const sx = 6 + idx * (tileW + 8) + tileW / 2, sy = ty + 4;
    const ex = cartX, ey = cartY - s * 0.3;
    const x = sx + (ex - sx) * p, y = sy + (ey - sy) * p - Math.sin(p * Math.PI) * (h * 0.42);
    ctx.fillStyle = cols[idx % 3];
    rr(ctx, x - 3, y - 3, 6, 6, 1.6); ctx.fill();
  }
  // cart glyph (bounces when an item lands)
  const bs = phase > 0.82 ? 1 + Math.sin(Math.min(1, (phase - 0.82) / 0.18) * Math.PI) * 0.2 : 1;
  ctx.save(); ctx.translate(cartX, cartY); ctx.scale(bs, bs);
  ctx.strokeStyle = C.cyanHi; ctx.lineWidth = 1.7; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-s * 0.9, -s * 0.5); ctx.lineTo(-s * 0.58, -s * 0.5);
  ctx.lineTo(-s * 0.34, s * 0.32); ctx.lineTo(s * 0.62, s * 0.32); ctx.lineTo(s * 0.82, -s * 0.24); ctx.lineTo(-s * 0.42, -s * 0.24);
  ctx.stroke();
  ctx.fillStyle = C.cyanHi;
  ctx.beginPath(); ctx.arc(-s * 0.18, s * 0.56, s * 0.14, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(s * 0.44, s * 0.56, s * 0.14, 0, 7); ctx.fill();
  ctx.restore();
  // count badge
  ctx.fillStyle = C.green;
  ctx.beginPath(); ctx.arc(cartX + s * 0.74, cartY - s * 0.72, s * 0.42, 0, 7); ctx.fill();
  ctx.fillStyle = C.ink; ctx.font = `700 ${Math.round(s * 0.62)}px JetBrains Mono, monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(String(count), cartX + s * 0.74, cartY - s * 0.72 + 0.5);
  ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
}

/* ── CV Research · pose skeleton ── */
function pose(ctx, w, h, t, hov) {
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2, midY = h / 2, sc = h * 0.42;
  const sw = Math.sin(t * 1.6) * 0.5, sw2 = Math.sin(t * 1.6 + Math.PI) * 0.5;
  const J = {
    head: [cx, midY - sc],
    neck: [cx, midY - sc * 0.55],
    lsh: [cx - sc * 0.42, midY - sc * 0.42], rsh: [cx + sc * 0.42, midY - sc * 0.42],
    lel: [cx - sc * 0.55 - sw * 6, midY - sc * 0.02], rel: [cx + sc * 0.55 + sw2 * 6, midY - sc * 0.02],
    lha: [cx - sc * 0.5 - sw * 12, midY + sc * 0.4], rha: [cx + sc * 0.5 + sw2 * 12, midY + sc * 0.4],
    hip: [cx, midY + sc * 0.25],
    lkn: [cx - sc * 0.28 + sw2 * 6, midY + sc * 0.7], rkn: [cx + sc * 0.28 + sw * 6, midY + sc * 0.7],
    lfo: [cx - sc * 0.3 + sw2 * 10, midY + sc], rfo: [cx + sc * 0.3 + sw * 10, midY + sc],
  };
  const bones = [['neck', 'lsh'], ['neck', 'rsh'], ['lsh', 'lel'], ['lel', 'lha'], ['rsh', 'rel'], ['rel', 'rha'], ['neck', 'hip'], ['hip', 'lkn'], ['lkn', 'lfo'], ['hip', 'rkn'], ['rkn', 'rfo']];
  ctx.strokeStyle = cy(0.55 + hov * 0.25); ctx.lineWidth = 1.6;
  bones.forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(J[a][0], J[a][1]); ctx.lineTo(J[b][0], J[b][1]); ctx.stroke(); });
  ctx.fillStyle = C.cyanHi;
  Object.keys(J).forEach((k) => { ctx.beginPath(); ctx.arc(J[k][0], J[k][1], k === 'head' ? 3.4 : 2, 0, 7); ctx.fill(); });
}

/* ── Data Mining · k-means clustering ── */
let _clusterPts = null;
function cluster(ctx, w, h, t, hov) {
  ctx.clearRect(0, 0, w, h);
  const centers = [[0.26, 0.42, C.cyan], [0.52, 0.66, C.mag], [0.78, 0.38, C.green]];
  if (!_clusterPts || _clusterPts.w !== w) {
    _clusterPts = { w, list: [] };
    for (let i = 0; i < 27; i++) { const c = i % 3; _clusterPts.list.push({ c, a: Math.random() * 7, r: 6 + Math.random() * 14, sp: 0.4 + Math.random() * 0.6 }); }
  }
  centers.forEach((cc) => {
    ctx.strokeStyle = C.faint; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cc[0] * w, cc[1] * h, h * 0.34, 0, 7); ctx.stroke();
  });
  _clusterPts.list.forEach((p) => {
    const cc = centers[p.c]; const ang = p.a + t * p.sp * 0.5;
    const x = cc[0] * w + Math.cos(ang) * p.r * (0.7 + 0.3 * Math.sin(t + p.a));
    const y = cc[1] * h + Math.sin(ang) * p.r * (0.7 + 0.3 * Math.cos(t + p.a));
    ctx.fillStyle = cc[2]; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fill();
  });
  ctx.globalAlpha = 1;
  centers.forEach((cc) => { ctx.fillStyle = cc[2]; ctx.beginPath(); ctx.arc(cc[0] * w, cc[1] * h, 3, 0, 7); ctx.fill(); });
}

export const DRAW = { radar, deploy, approve, kafka, scan, cart, pose, cluster };

export function mountMotifs(root) {
  if (!root) return () => {};
  const items = [];
  root.querySelectorAll('canvas[data-motif]').forEach((cvEl) => {
    const type = cvEl.getAttribute('data-motif');
    if (!DRAW[type]) return;
    const ctx = cvEl.getContext('2d');
    const card = cvEl.closest('a, [data-motif-host]') || cvEl.parentElement;
    const m = { cv: cvEl, ctx, type, hover: false, hov: 0, w: 0, h: 0 };
    const resize = () => {
      const r = cvEl.getBoundingClientRect(); if (!r.width) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      m.w = r.width; m.h = r.height; cvEl.width = Math.round(r.width * dpr); cvEl.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    m.resize = resize; resize();
    if (card) { card.addEventListener('mouseenter', () => { m.hover = true; }); card.addEventListener('mouseleave', () => { m.hover = false; }); }
    items.push(m);
  });
  const onResize = () => items.forEach((m) => m.resize());
  window.addEventListener('resize', onResize);
  const nowMs = () => (window.performance && performance.now ? performance.now() : Date.now());
  // Track scrolling: while the page scrolls, cards slide under a stationary
  // cursor and would flicker their hover speed-up. Suppress hover during scroll
  // so the motion stays a constant, smooth speed.
  let lastScroll = 0;
  const onScroll = () => { lastScroll = nowMs(); };
  window.addEventListener('scroll', onScroll, { passive: true });
  let raf, t0 = null;
  const loop = (ts) => {
    if (t0 === null) t0 = ts; const t = (ts - t0) / 1000;
    const vh = window.innerHeight || 800;
    const scrolling = (nowMs() - lastScroll) < 400;
    items.forEach((m) => {
      const r = m.cv.getBoundingClientRect();
      if (r.bottom < -60 || r.top > vh + 60 || !m.w) return;
      const target = (m.hover && !scrolling) ? 1 : 0;
      m.hov += (target - m.hov) * 0.08;
      try { DRAW[m.type](m.ctx, m.w, m.h, t, m.hov); } catch (e) {}
    });
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); window.removeEventListener('scroll', onScroll); };
}
