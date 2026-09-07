<script setup>
import { nextTick, onUnmounted, ref } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  context: {
    type: String,
    default: '',
  },
  respawnDelay: {
    type: Number,
    default: 500,
  },
});

const rootEl = ref(null);
const popoverEl = ref(null);
const hidden = ref(false);
const exploding = ref(false);
const returning = ref(false);
const open = ref(false);
const closing = ref(false);
const positioned = ref(false);
const particles = ref([]);
const placement = ref('below');
const offsetX = ref(0);
const originX = ref(0);

let respawnTimer = null;
let cleanupTimer = null;
let closeTimer = null;
let openTimer = null;

// Clear of the fixed 25px page frame
const VIEWPORT_MARGIN = 32;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function clearTimers() {
  if (respawnTimer) window.clearTimeout(respawnTimer);
  if (cleanupTimer) window.clearTimeout(cleanupTimer);
  if (closeTimer) window.clearTimeout(closeTimer);
  if (openTimer) window.clearTimeout(openTimer);
  respawnTimer = null;
  cleanupTimer = null;
  closeTimer = null;
  openTimer = null;
}

function makeParticles(prefix, count = 14) {
  return Array.from({ length: count }, (_, index) => {
    const angle = randomBetween(0, Math.PI * 2);
    const distance = randomBetween(28, 72);

    return {
      id: `${prefix}-${Date.now()}-${index}`,
      style: {
        '--tx': `${Math.cos(angle) * distance}px`,
        '--ty': `${Math.sin(angle) * distance}px`,
        '--rot': `${randomBetween(-180, 180)}deg`,
        '--size': `${randomBetween(4, 9)}px`,
        '--delay': `${randomBetween(0, 0.06)}s`,
      },
    };
  });
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function scheduleRespawn(delay = props.respawnDelay) {
  if (respawnTimer) window.clearTimeout(respawnTimer);

  respawnTimer = window.setTimeout(() => {
    hidden.value = false;
    returning.value = true;
    window.setTimeout(() => {
      returning.value = false;
    }, 450);
  }, delay);
}

function detachOutsideListeners() {
  document.removeEventListener('pointerdown', onOutsidePointer);
  document.removeEventListener('keydown', onKeydown);
}

function onKeydown(event) {
  if (event.key === 'Escape') closePopover();
}

function onOutsidePointer(event) {
  if (!open.value || closing.value) return;
  if (rootEl.value?.contains(event.target)) return;
  closePopover();
}

function positionPopover() {
  const popover = popoverEl.value;
  const root = rootEl.value;
  if (!popover || !root) return;

  const viewportWidth = document.documentElement.clientWidth;
  const availableWidth = Math.max(0, viewportWidth - VIEWPORT_MARGIN * 2);
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  popover.style.maxWidth = `${Math.min(18 * rem, availableWidth)}px`;

  const rootRect = root.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rootRect.bottom - VIEWPORT_MARGIN;
  placement.value = spaceBelow < popover.offsetHeight + 16 ? 'above' : 'below';

  const popoverWidth = popover.getBoundingClientRect().width;
  const anchorX = rootRect.left + rootRect.width / 2;
  const minLeft = VIEWPORT_MARGIN;
  const maxLeft = viewportWidth - VIEWPORT_MARGIN - popoverWidth;
  const left = Math.min(Math.max(anchorX - popoverWidth / 2, minLeft), Math.max(minLeft, maxLeft));

  offsetX.value = left - rootRect.left;
  originX.value = anchorX - left;
}

async function showPopover() {
  open.value = true;
  closing.value = false;
  positioned.value = false;
  offsetX.value = 0;
  originX.value = 0;
  document.addEventListener('pointerdown', onOutsidePointer);
  document.addEventListener('keydown', onKeydown);

  await nextTick();
  positionPopover();
  await nextTick();
  positioned.value = true;
  popoverEl.value?.focus({ preventScroll: true });
}

function explodeTag(event) {
  if (hidden.value || exploding.value || open.value || closing.value) return;

  const target = event.currentTarget;

  if (prefersReducedMotion()) {
    if (props.context) {
      hidden.value = true;
      showPopover();
    }
    return;
  }

  exploding.value = true;
  particles.value = makeParticles(props.label);

  cleanupTimer = window.setTimeout(() => {
    particles.value = [];
    exploding.value = false;
  }, 650);

  window.setTimeout(() => {
    hidden.value = true;
    target.blur();
  }, 180);

  if (props.context) {
    openTimer = window.setTimeout(() => {
      showPopover();
    }, 220);
  } else {
    scheduleRespawn();
  }
}

function closePopover() {
  if (!open.value || closing.value) return;

  detachOutsideListeners();

  if (prefersReducedMotion()) {
    open.value = false;
    positioned.value = false;
    if (hidden.value) scheduleRespawn(120);
    return;
  }

  closing.value = true;

  closeTimer = window.setTimeout(() => {
    open.value = false;
    closing.value = false;
    positioned.value = false;
    if (hidden.value) scheduleRespawn(80);
  }, 280);
}

onUnmounted(() => {
  clearTimers();
  detachOutsideListeners();
});
</script>

<template>
  <span ref="rootEl" class="skill-root">
    <button
      type="button"
      class="skill-tag"
      :class="{ exploding, hidden, returning }"
      :aria-expanded="context ? open : undefined"
      :aria-haspopup="context ? 'dialog' : undefined"
      :aria-label="context ? `About ${label}` : `Pop ${label} skill`"
      @click="explodeTag"
    >
      <span class="tag chart-panel chart-panel--tag label">{{ label }}</span>

      <span
        v-for="particle in particles"
        :key="particle.id"
        class="particle"
        :style="particle.style"
        aria-hidden="true"
      />
    </button>

    <button
      v-if="open"
      ref="popoverEl"
      type="button"
      class="skill-popover chart-panel"
      :class="[placement, { closing, positioned }]"
      :style="{
        '--offset-x': `${offsetX}px`,
        '--origin-x': `${originX}px`,
      }"
      :aria-label="`${label}: ${context}. Click to dismiss`"
      @click="closePopover"
    >
      <span class="popover-title label">{{ label }}</span>
      <span class="popover-body">{{ context }}</span>
    </button>
  </span>
</template>

<style scoped>
.skill-root {
  position: relative;
  display: inline-block;
}

.skill-tag {
  position: relative;
  display: inline-block;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font: inherit;
  color: inherit;
  -webkit-tap-highlight-color: transparent;
}

.tag {
  display: inline-block;
  padding: 0.35rem 0.6rem;
  font-size: 0.6875rem;
  color: var(--chart-ink);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.skill-tag.exploding .tag {
  animation: tag-burst 0.35s ease-out forwards;
}

.skill-tag.hidden .tag {
  opacity: 0;
  transform: scale(0.6);
  pointer-events: none;
}

.skill-tag.returning .tag {
  animation: tag-return 0.45s ease-out;
}

.skill-popover {
  position: absolute;
  left: var(--offset-x, 0px);
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  width: max-content;
  max-width: min(18rem, calc(100vw - 4rem));
  padding: 0.7rem 0.85rem;
  border: 1px solid var(--chart-line-strong);
  background: var(--chart-bg);
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transform-origin: var(--origin-x, 50%) top;
  opacity: 0;
  animation: none;
  -webkit-tap-highlight-color: transparent;
}

.skill-popover.positioned:not(.closing) {
  animation: popover-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.skill-popover.below {
  top: calc(100% + 0.55rem);
}

.skill-popover.above {
  bottom: calc(100% + 0.55rem);
  transform-origin: var(--origin-x, 50%) bottom;
}

.skill-popover.closing {
  animation: popover-out 0.28s ease-in forwards;
  pointer-events: none;
}

.popover-title {
  font-size: 0.6875rem;
  letter-spacing: 0.18em;
  color: var(--chart-ink);
}

.popover-body {
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--chart-ink-dim);
}

.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--size);
  height: var(--size);
  margin: calc(var(--size) / -2);
  border-radius: 50%;
  background: var(--chart-ink);
  box-shadow: 0 0 4px rgba(238, 241, 246, 0.6);
  pointer-events: none;
  animation: particle-burst 0.55s ease-out forwards;
  animation-delay: var(--delay);
}

@keyframes tag-burst {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  35% {
    transform: scale(1.12);
    opacity: 0.75;
  }

  100% {
    transform: scale(0.2);
    opacity: 0;
  }
}

@keyframes tag-return {
  0% {
    transform: scale(0.75);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes popover-in {
  0% {
    opacity: 0;
    transform: scale(0.2);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes popover-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(0.2);
  }
}

@keyframes particle-burst {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 1;
  }

  100% {
    transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skill-popover.positioned:not(.closing) {
    animation: none;
    opacity: 1;
  }

  .skill-popover.closing {
    animation: none;
    opacity: 0;
  }
}
</style>
