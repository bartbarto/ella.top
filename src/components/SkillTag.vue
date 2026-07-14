<script setup>
import { onUnmounted, ref } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  respawnDelay: {
    type: Number,
    default: 500,
  },
});

const hidden = ref(false);
const exploding = ref(false);
const returning = ref(false);
const particles = ref([]);
let respawnTimer = null;
let cleanupTimer = null;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function explode(event) {
  if (hidden.value || exploding.value) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const target = event.currentTarget;
  exploding.value = true;

  particles.value = Array.from({ length: 14 }, (_, index) => {
    const angle = randomBetween(0, Math.PI * 2);
    const distance = randomBetween(28, 72);

    return {
      id: `${props.label}-${Date.now()}-${index}`,
      style: {
        '--tx': `${Math.cos(angle) * distance}px`,
        '--ty': `${Math.sin(angle) * distance}px`,
        '--rot': `${randomBetween(-180, 180)}deg`,
        '--size': `${randomBetween(4, 9)}px`,
        '--delay': `${randomBetween(0, 0.06)}s`,
      },
    };
  });

  cleanupTimer = window.setTimeout(() => {
    particles.value = [];
    exploding.value = false;
  }, 650);

  window.setTimeout(() => {
    hidden.value = true;
    target.blur();
  }, 180);

  if (respawnTimer) window.clearTimeout(respawnTimer);

  respawnTimer = window.setTimeout(() => {
    hidden.value = false;
    returning.value = true;
    window.setTimeout(() => {
      returning.value = false;
    }, 450);
  }, props.respawnDelay);
}

onUnmounted(() => {
  if (respawnTimer) window.clearTimeout(respawnTimer);
  if (cleanupTimer) window.clearTimeout(cleanupTimer);
});
</script>

<template>
  <button
    type="button"
    class="skill-tag"
    :class="{ exploding, hidden, returning }"
    :aria-label="`Pop ${label} skill`"
    @click="explode"
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
</template>

<style scoped>
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
</style>
