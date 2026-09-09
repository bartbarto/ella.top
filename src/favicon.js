const SIZE = 64;
const FRAME_MS = 200; // 5 fps
const ANGLE_STEPS = 36;
const ANIM_CYCLE = 6; // lcm of jitter (2) and flame (3)

const C = {
  bg: '#212121',
  ink: '#000000',
  body: '#cfd8dc',
  shade: '#90a4ae',
  window: '#03a9f4',
  windowHi: '#e1f5fe',
  orange: '#ff6e00',
  orangeDeep: '#e65100',
  band: '#5d4037',
  flameRed: '#dd2c00',
  flameOrange: '#ff6e40',
  flameYellow: '#ffd740',
  flameWhite: '#fff8e1',
  star: '#ffffff',
};

const STARS = [
  { x: 10, y: 14 },
  { x: 50, y: 48 },
];

const TWO_PI = Math.PI * 2;
const ANGLE_STEP = TWO_PI / ANGLE_STEPS;

export function startFaviconAnimation() {
  let link = document.querySelector("link[rel='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/png';

  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  /** @type {(string | undefined)[]} */
  const cache = new Array(ANGLE_STEPS * ANIM_CYCLE);
  let pointerX = window.innerWidth / 2;
  let pointerY = 0;
  let tick = 0;
  let lastKey = -1;

  window.addEventListener(
    'pointermove',
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    },
    { passive: true },
  );

  const render = () => {
    const raw = Math.atan2(
      pointerY - window.innerHeight / 2,
      pointerX - window.innerWidth / 2,
    );
    const angleIdx = angleIndex(raw);
    const anim = tick % ANIM_CYCLE;
    const key = angleIdx * ANIM_CYCLE + anim;

    if (key !== lastKey) {
      let href = cache[key];
      if (!href) {
        paint(ctx, tick, angleIdx * ANGLE_STEP);
        href = canvas.toDataURL('image/png');
        cache[key] = href;
      }
      link.href = href;
      lastKey = key;
    }

    tick += 1;
  };

  render();
  setInterval(render, FRAME_MS);
}

function angleIndex(angle) {
  let normalized = angle % TWO_PI;
  if (normalized < 0) normalized += TWO_PI;
  return Math.round(normalized / ANGLE_STEP) % ANGLE_STEPS;
}

function paint(ctx, tick, angle) {
  const mid = SIZE / 2;
  const jitter = tick % 2 === 0 ? -1 : 1;
  const flame = tick % 3;

  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  for (let i = 0; i < STARS.length; i += 1) {
    if ((tick + i) % 2 === 0) {
      drawStar(ctx, STARS[i].x, STARS[i].y);
    }
  }

  ctx.save();
  ctx.translate(mid, mid);
  ctx.rotate(angle + Math.PI / 2);
  ctx.translate(0, jitter);
  drawFlame(ctx, flame);
  drawRocket(ctx);
  ctx.restore();
}

function drawStar(ctx, x, y) {
  ctx.fillStyle = C.star;
  ctx.fillRect(x, y - 3, 2, 8);
  ctx.fillRect(x - 3, y, 8, 2);
}

function drawRocket(ctx) {
  drawFin(ctx, -1);
  drawFin(ctx, 1);

  // Fuselage outline
  fillPoly(ctx, C.ink, [
    [0, -26],
    [8, -16],
    [8, 12],
    [5, 15],
    [-5, 15],
    [-8, 12],
    [-8, -16],
  ]);

  // Fuselage fill
  fillPoly(ctx, C.body, [
    [0, -23],
    [6, -15],
    [6, 11],
    [3, 13],
    [-3, 13],
    [-6, 11],
    [-6, -15],
  ]);

  // Shade on the right
  fillPoly(ctx, C.shade, [
    [1, -18],
    [6, -14],
    [6, 10],
    [1, 10],
  ]);

  // Collar band
  ctx.fillStyle = C.band;
  ctx.fillRect(-6, 1, 12, 3);

  // Window
  fillCircle(ctx, C.ink, 0, -8, 5.5);
  fillCircle(ctx, C.window, 0, -8, 4);
  ctx.fillStyle = C.windowHi;
  ctx.fillRect(-2, -11, 2, 2);

  // Center fin
  fillPoly(ctx, C.ink, [
    [-2.5, 7],
    [2.5, 7],
    [0, 16],
  ]);
  fillPoly(ctx, C.band, [
    [-1.5, 8],
    [1.5, 8],
    [0, 14],
  ]);

  // Nozzle
  ctx.fillStyle = C.ink;
  ctx.fillRect(-5, 13, 10, 4);
  ctx.fillStyle = C.orangeDeep;
  ctx.fillRect(-4, 14, 8, 2);
}

function drawFin(ctx, side) {
  const s = side;
  fillPoly(ctx, C.ink, [
    [s * 5, 3],
    [s * 16, 13],
    [s * 14, 18],
    [s * 4, 14],
  ]);
  fillPoly(ctx, C.orange, [
    [s * 6, 5],
    [s * 14, 13],
    [s * 12, 16],
    [s * 5, 12],
  ]);
  fillPoly(ctx, C.orangeDeep, [
    [s * 9, 9],
    [s * 14, 13],
    [s * 12, 16],
    [s * 8, 12],
  ]);
}

function drawFlame(ctx, variant) {
  const length = [16, 12, 20][variant];
  const w = [-1, 1, 0][variant];

  fillPoly(ctx, C.flameRed, [
    [-6, 15],
    [6, 15],
    [3 + w, 15 + length],
    [0 + w, 15 + length * 0.65],
    [-4 + w, 15 + length],
  ]);
  fillPoly(ctx, C.flameOrange, [
    [-4, 15],
    [4, 15],
    [1.5 + w * 0.5, 15 + length * 0.72],
    [-0.5 + w * 0.5, 15 + length * 0.5],
    [-3 + w * 0.5, 15 + length * 0.72],
  ]);
  fillPoly(ctx, C.flameYellow, [
    [-2.5, 15],
    [2.5, 15],
    [0.8 + w * 0.3, 15 + length * 0.5],
    [-1.5 + w * 0.3, 15 + length * 0.38],
  ]);
  fillPoly(ctx, C.flameWhite, [
    [-1.2, 15],
    [1.2, 15],
    [0, 15 + length * 0.3],
  ]);
}

function fillPoly(ctx, color, points) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
  ctx.fill();
}

function fillCircle(ctx, color, x, y, r) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
