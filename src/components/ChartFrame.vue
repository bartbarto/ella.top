<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

/** Chart frame tuning */
const FRAME = {
  inset: 14,
  band: 11,
  minorStep: 12,
  majorInterval: 60,
  stroke: 'rgba(238, 241, 246, 0.55)',
  strokeInner: 'rgba(238, 241, 246, 0.22)',
  tickMinor: 'rgba(238, 241, 246, 0.28)',
  tickMajor: 'rgba(238, 241, 246, 0.52)',
};

const frame = ref(null);
let resizeHandler = null;

function addEdgeTicks(ticks, start, end, edge, horizontal, outward) {
  const { band, minorStep, majorInterval } = FRAME;
  const span = end - start;
  const count = Math.floor(span / minorStep);

  for (let i = 1; i < count; i++) {
    const offset = i * minorStep;
    const isMajor = offset % majorInterval === 0;
    const tickLen = isMajor ? band : band * 0.55;
    const color = isMajor ? FRAME.tickMajor : FRAME.tickMinor;

    if (horizontal) {
      const x = start + offset;
      const y1 = outward ? edge + 1 : edge - 1;
      const y2 = outward ? edge + tickLen : edge - tickLen;
      ticks.push({ x1: x, y1, x2: x, y2, color });
    } else {
      const y = start + offset;
      const x1 = outward ? edge + 1 : edge - 1;
      const x2 = outward ? edge + tickLen : edge - tickLen;
      ticks.push({ x1, y1: y, x2, y2: y, color });
    }
  }
}

function buildFrame() {
  const { inset, band } = FRAME;
  const width = window.innerWidth;
  const height = window.innerHeight;

  const outer = {
    x: inset,
    y: inset,
    w: width - inset * 2,
    h: height - inset * 2,
  };

  const inner = {
    x: inset + band,
    y: inset + band,
    w: outer.w - band * 2,
    h: outer.h - band * 2,
  };

  const ticks = [];

  addEdgeTicks(ticks, outer.x, outer.x + outer.w, outer.y, true, true);
  addEdgeTicks(ticks, outer.x, outer.x + outer.w, outer.y + outer.h, true, false);
  addEdgeTicks(ticks, outer.y, outer.y + outer.h, outer.x, false, true);
  addEdgeTicks(ticks, outer.y, outer.y + outer.h, outer.x + outer.w, false, false);

  frame.value = { outer, inner, ticks, width, height };
}

onMounted(() => {
  buildFrame();
  resizeHandler = () => buildFrame();
  window.addEventListener('resize', resizeHandler);
});

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
  }
});
</script>

<template>
  <svg
    class="chart-frame"
    :viewBox="`0 0 ${frame?.width ?? 0} ${frame?.height ?? 0}`"
    aria-hidden="true"
  >
    <template v-if="frame">
      <rect
        :x="frame.outer.x"
        :y="frame.outer.y"
        :width="frame.outer.w"
        :height="frame.outer.h"
        fill="none"
        :stroke="FRAME.stroke"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
        shape-rendering="crispEdges"
      />
      <rect
        :x="frame.inner.x"
        :y="frame.inner.y"
        :width="frame.inner.w"
        :height="frame.inner.h"
        fill="none"
        :stroke="FRAME.strokeInner"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
        shape-rendering="crispEdges"
      />
      <line
        v-for="(tick, index) in frame.ticks"
        :key="index"
        :x1="tick.x1"
        :y1="tick.y1"
        :x2="tick.x2"
        :y2="tick.y2"
        :stroke="tick.color"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
        shape-rendering="crispEdges"
      />
    </template>
  </svg>
</template>

<style scoped>
.chart-frame {
  position: fixed;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
