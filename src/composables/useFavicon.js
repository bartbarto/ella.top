import { onMounted, onUnmounted, toValue, watch } from 'vue';

const SIZE = 64;
const FRAME_MS = 200; // 5 fps
const ANGLE_STEPS = 36;
const ANIM_CYCLE = 6; // lcm of jitter (2) and flame (3)

const COLORS = {
  default: {
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
  },
  uwu: {
    bg: '#ffe4f3',
    ink: '#1a0b14',
    body: '#fff8fc',
    shade: '#ffb8de',
    window: '#4cc9f0',
    windowHi: '#e8fbff',
    orange: '#ff6bcb',
    orangeDeep: '#c73d8a',
    band: '#c77dff',
    flameRed: '#ff6bcb',
    flameOrange: '#ffd166',
    flameYellow: '#06d6a0',
    flameWhite: '#ffffff',
    star: '#c77dff',
  },
};

const STARS = [
  { x: 10, y: 14 },
  { x: 50, y: 48 },
];

const TWO_PI = Math.PI * 2;
const ANGLE_STEP = TWO_PI / ANGLE_STEPS;

/**
 * Pointer-following rocket favicon; swaps palette when uwu is on.
 * @param {import('vue').MaybeRefOrGetter<boolean>} uwu
 */
export function useFavicon(uwu) {
  let link;
  let canvas;
  let ctx;
  /** @type {(string | undefined)[]} */
  let cache;
  let colors = COLORS.default;
  let pointerX = 0;
  let pointerY = 0;
  let tick = 0;
  let lastKey = -1;
  let intervalId = 0;

  function onPointerMove(event) {
    pointerX = event.clientX;
    pointerY = event.clientY;
  }

  function clearCache() {
    cache = new Array(ANGLE_STEPS * ANIM_CYCLE);
    lastKey = -1;
  }

  function setPalette(isUwu) {
    colors = isUwu ? COLORS.uwu : COLORS.default;
    clearCache();
  }

  function render() {
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
        paint(ctx, tick, angleIdx * ANGLE_STEP, colors);
        href = canvas.toDataURL('image/png');
        cache[key] = href;
      }
      link.href = href;
      lastKey = key;
    }

    tick += 1;
  }

  onMounted(() => {
    link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';

    canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    pointerX = window.innerWidth / 2;
    pointerY = 0;
    setPalette(toValue(uwu));

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    render();
    intervalId = window.setInterval(render, FRAME_MS);
  });

  watch(
    () => toValue(uwu),
    (on) => {
      if (!ctx) return;
      setPalette(on);
      render();
    },
  );

  onUnmounted(() => {
    window.clearInterval(intervalId);
    window.removeEventListener('pointermove', onPointerMove);
  });
}

function angleIndex(angle) {
  let normalized = angle % TWO_PI;
  if (normalized < 0) normalized += TWO_PI;
  return Math.round(normalized / ANGLE_STEP) % ANGLE_STEPS;
}

function paint(ctx, tick, angle, c) {
  const mid = SIZE / 2;
  const jitter = tick % 2 === 0 ? -1 : 1;
  const flame = tick % 3;

  ctx.fillStyle = c.bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  for (let i = 0; i < STARS.length; i += 1) {
    if ((tick + i) % 2 === 0) {
      drawStar(ctx, STARS[i].x, STARS[i].y, c);
    }
  }

  ctx.save();
  ctx.translate(mid, mid);
  ctx.rotate(angle + Math.PI / 2);
  ctx.translate(0, jitter);
  drawFlame(ctx, flame, c);
  drawRocket(ctx, c);
  ctx.restore();
}

function drawStar(ctx, x, y, c) {
  ctx.fillStyle = c.star;
  ctx.fillRect(x, y - 3, 2, 8);
  ctx.fillRect(x - 3, y, 8, 2);
}

function drawRocket(ctx, c) {
  drawFin(ctx, -1, c);
  drawFin(ctx, 1, c);

  fillPoly(ctx, c.ink, [
    [0, -26],
    [8, -16],
    [8, 12],
    [5, 15],
    [-5, 15],
    [-8, 12],
    [-8, -16],
  ]);

  fillPoly(ctx, c.body, [
    [0, -23],
    [6, -15],
    [6, 11],
    [3, 13],
    [-3, 13],
    [-6, 11],
    [-6, -15],
  ]);

  fillPoly(ctx, c.shade, [
    [1, -18],
    [6, -14],
    [6, 10],
    [1, 10],
  ]);

  ctx.fillStyle = c.band;
  ctx.fillRect(-6, 1, 12, 3);

  fillCircle(ctx, c.ink, 0, -8, 5.5);
  fillCircle(ctx, c.window, 0, -8, 4);
  ctx.fillStyle = c.windowHi;
  ctx.fillRect(-2, -11, 2, 2);

  fillPoly(ctx, c.ink, [
    [-2.5, 7],
    [2.5, 7],
    [0, 16],
  ]);
  fillPoly(ctx, c.band, [
    [-1.5, 8],
    [1.5, 8],
    [0, 14],
  ]);

  ctx.fillStyle = c.ink;
  ctx.fillRect(-5, 13, 10, 4);
  ctx.fillStyle = c.orangeDeep;
  ctx.fillRect(-4, 14, 8, 2);
}

function drawFin(ctx, side, c) {
  const s = side;
  fillPoly(ctx, c.ink, [
    [s * 5, 3],
    [s * 16, 13],
    [s * 14, 18],
    [s * 4, 14],
  ]);
  fillPoly(ctx, c.orange, [
    [s * 6, 5],
    [s * 14, 13],
    [s * 12, 16],
    [s * 5, 12],
  ]);
  fillPoly(ctx, c.orangeDeep, [
    [s * 9, 9],
    [s * 14, 13],
    [s * 12, 16],
    [s * 8, 12],
  ]);
}

function drawFlame(ctx, variant, c) {
  const length = [16, 12, 20][variant];
  const w = [-1, 1, 0][variant];

  fillPoly(ctx, c.flameRed, [
    [-6, 15],
    [6, 15],
    [3 + w, 15 + length],
    [0 + w, 15 + length * 0.65],
    [-4 + w, 15 + length],
  ]);
  fillPoly(ctx, c.flameOrange, [
    [-4, 15],
    [4, 15],
    [1.5 + w * 0.5, 15 + length * 0.72],
    [-0.5 + w * 0.5, 15 + length * 0.5],
    [-3 + w * 0.5, 15 + length * 0.72],
  ]);
  fillPoly(ctx, c.flameYellow, [
    [-2.5, 15],
    [2.5, 15],
    [0.8 + w * 0.3, 15 + length * 0.5],
    [-1.5 + w * 0.3, 15 + length * 0.38],
  ]);
  fillPoly(ctx, c.flameWhite, [
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
