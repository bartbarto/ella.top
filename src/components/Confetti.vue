<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
});

const canvas = ref(null);

const COLORS = ['#ff6bcb', '#ffd166', '#06d6a0', '#4cc9f0', '#c77dff', '#ff8fab', '#fff'];
const GRAVITY = 0.12;
const DRAG = 0.995;

let raf = null;
let particles = [];
let reducedMotion = false;
let ctx = null;
let width = 0;
let height = 0;

function resize() {
  const el = canvas.value;
  if (!el) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  el.width = Math.floor(width * dpr);
  el.height = Math.floor(height * dpr);
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  ctx = el.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawnBurst(count = 140) {
  const cx = width / 2;
  const cy = height * 0.28;
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 9;
    particles.push({
      x: cx + (Math.random() - 0.5) * 80,
      y: cy + (Math.random() - 0.5) * 40,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      w: 4 + Math.random() * 7,
      h: 6 + Math.random() * 10,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.25,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      life: 1,
      decay: 0.004 + Math.random() * 0.006,
    });
  }
}

function spawnDrift(count = 8) {
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: Math.random() * width,
      y: -20,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 1.5 + Math.random() * 2.5,
      w: 4 + Math.random() * 6,
      h: 6 + Math.random() * 8,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.15,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      life: 1,
      decay: 0.002 + Math.random() * 0.003,
    });
  }
}

function tick() {
  raf = null;
  if (!ctx) {
    if (props.active || particles.length) raf = requestAnimationFrame(tick);
    return;
  }

  ctx.clearRect(0, 0, width, height);

  if (props.active && !reducedMotion && Math.random() < 0.08) {
    spawnDrift(3);
  }

  particles = particles.filter((p) => {
    p.vx *= DRAG;
    p.vy = p.vy * DRAG + GRAVITY;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= p.decay;

    if (p.life <= 0 || p.y > height + 40) return false;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
    return true;
  });

  if (props.active || particles.length) {
    raf = requestAnimationFrame(tick);
  }
}

function start() {
  resize();
  if (!reducedMotion) spawnBurst();
  if (!raf) raf = requestAnimationFrame(tick);
}

function stop() {
  particles = [];
  if (raf) {
    cancelAnimationFrame(raf);
    raf = null;
  }
  if (ctx) ctx.clearRect(0, 0, width, height);
}

watch(
  () => props.active,
  (on) => {
    if (on) start();
    else stop();
  },
);

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  resize();
  window.addEventListener('resize', resize);
  if (props.active) start();
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  if (raf) cancelAnimationFrame(raf);
});
</script>

<template>
  <Teleport to="body">
    <canvas
      ref="canvas"
      class="confetti print-hide"
      aria-hidden="true"
    />
  </Teleport>
</template>

<style scoped>
.confetti {
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  width: 100vw;
  height: 100dvh;
}
</style>
