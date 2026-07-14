<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const canvas = ref(null);

/** Starfield tuning — adjust these to taste */
const STARFIELD = {
  count: 300,
  dprMax: 2,

  size: { min: 0.8, range: 2.2, scaleRef: 700 },

  opacity: { min: 0.2, range: 0.5, clampMin: 0.1 },

  twinkle: { speedMin: 0.0005, speedRange: 0.002, rate: 0.6, amount: 0.25 },

  drift: { speedMin: 0.01, speedRange: 0.04, rate: 0.00004 },

  color: { r: 0.95, g: 0.97, b: 1.0 },
  edgeSoftness: 0.12,
};

const STRIDE = 7; // x, y, size, opacity, twinkle, phase, drift

let animationId = null;
let resizeHandler = null;
let gl = null;
let program = null;
let buffer = null;
let uniforms = {};
let reducedMotion = false;

const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute float a_size;
  attribute float a_opacity;
  attribute float a_twinkle;
  attribute float a_phase;
  attribute float a_drift;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_reduced_motion;
  uniform float u_twinkle_rate;
  uniform float u_twinkle_amount;
  uniform float u_drift_rate;
  uniform float u_size_scale_ref;
  uniform float u_opacity_clamp_min;

  varying float v_opacity;

  void main() {
    vec2 pos = a_position;

    if (u_reduced_motion < 0.5) {
      pos.y = mod(pos.y + u_time * a_drift * u_drift_rate, 1.0);
    }

    vec2 clip = pos * 2.0 - 1.0;
    clip.y *= -1.0;

    gl_Position = vec4(clip, 0.0, 1.0);
    gl_PointSize = a_size * (u_resolution.y / u_size_scale_ref);

    float twinkle = u_reduced_motion > 0.5
      ? a_opacity
      : a_opacity + sin(u_time * a_twinkle * u_twinkle_rate + a_phase) * u_twinkle_amount;

    v_opacity = clamp(twinkle, u_opacity_clamp_min, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  uniform vec3 u_star_color;
  uniform float u_edge_softness;

  varying float v_opacity;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    if (dist > 0.5) {
      discard;
    }

    float alpha = smoothstep(0.5, u_edge_softness, dist) * v_opacity;
    gl_FragColor = vec4(u_star_color, alpha);
  }
`;

function createShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(vertexSource, fragmentSource) {
  const vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vertexShader);
  gl.attachShader(prog, fragmentShader);
  gl.linkProgram(prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return prog;
}

function createStarData() {
  const { count, size, opacity, twinkle, drift } = STARFIELD;
  const data = new Float32Array(count * STRIDE);

  for (let i = 0; i < count; i++) {
    const offset = i * STRIDE;
    data[offset] = Math.random();
    data[offset + 1] = Math.random();
    data[offset + 2] = Math.random() * size.range + size.min;
    data[offset + 3] = Math.random() * opacity.range + opacity.min;
    data[offset + 4] = Math.random() * twinkle.speedRange + twinkle.speedMin;
    data[offset + 5] = Math.random() * Math.PI * 2;
    data[offset + 6] = Math.random() * drift.speedRange + drift.speedMin;
  }

  return data;
}

function applyConfigUniforms() {
  const { size, opacity, twinkle, drift, color, edgeSoftness } = STARFIELD;

  gl.uniform1f(uniforms.twinkleRate, twinkle.rate);
  gl.uniform1f(uniforms.twinkleAmount, twinkle.amount);
  gl.uniform1f(uniforms.driftRate, drift.rate);
  gl.uniform1f(uniforms.sizeScaleRef, size.scaleRef);
  gl.uniform1f(uniforms.opacityClampMin, opacity.clampMin);
  gl.uniform3f(uniforms.starColor, color.r, color.g, color.b);
  gl.uniform1f(uniforms.edgeSoftness, edgeSoftness);
}

function initWebGL(el) {
  gl = el.getContext('webgl', { alpha: true, antialias: false });
  if (!gl) return false;

  program = createProgram(VERTEX_SHADER, FRAGMENT_SHADER);
  if (!program) return false;

  uniforms = {
    resolution: gl.getUniformLocation(program, 'u_resolution'),
    time: gl.getUniformLocation(program, 'u_time'),
    reducedMotion: gl.getUniformLocation(program, 'u_reduced_motion'),
    twinkleRate: gl.getUniformLocation(program, 'u_twinkle_rate'),
    twinkleAmount: gl.getUniformLocation(program, 'u_twinkle_amount'),
    driftRate: gl.getUniformLocation(program, 'u_drift_rate'),
    sizeScaleRef: gl.getUniformLocation(program, 'u_size_scale_ref'),
    opacityClampMin: gl.getUniformLocation(program, 'u_opacity_clamp_min'),
    starColor: gl.getUniformLocation(program, 'u_star_color'),
    edgeSoftness: gl.getUniformLocation(program, 'u_edge_softness'),
  };

  const attributes = {
    position: gl.getAttribLocation(program, 'a_position'),
    size: gl.getAttribLocation(program, 'a_size'),
    opacity: gl.getAttribLocation(program, 'a_opacity'),
    twinkle: gl.getAttribLocation(program, 'a_twinkle'),
    phase: gl.getAttribLocation(program, 'a_phase'),
    drift: gl.getAttribLocation(program, 'a_drift'),
  };

  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, createStarData(), gl.STATIC_DRAW);

  const byteStride = STRIDE * Float32Array.BYTES_PER_ELEMENT;

  gl.enableVertexAttribArray(attributes.position);
  gl.vertexAttribPointer(attributes.position, 2, gl.FLOAT, false, byteStride, 0);

  gl.enableVertexAttribArray(attributes.size);
  gl.vertexAttribPointer(attributes.size, 1, gl.FLOAT, false, byteStride, 2 * 4);

  gl.enableVertexAttribArray(attributes.opacity);
  gl.vertexAttribPointer(attributes.opacity, 1, gl.FLOAT, false, byteStride, 3 * 4);

  gl.enableVertexAttribArray(attributes.twinkle);
  gl.vertexAttribPointer(attributes.twinkle, 1, gl.FLOAT, false, byteStride, 4 * 4);

  gl.enableVertexAttribArray(attributes.phase);
  gl.vertexAttribPointer(attributes.phase, 1, gl.FLOAT, false, byteStride, 5 * 4);

  gl.enableVertexAttribArray(attributes.drift);
  gl.vertexAttribPointer(attributes.drift, 1, gl.FLOAT, false, byteStride, 6 * 4);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  gl.useProgram(program);
  applyConfigUniforms();

  return true;
}

function resize(el) {
  const dpr = Math.min(window.devicePixelRatio || 1, STARFIELD.dprMax);
  const width = window.innerWidth;
  const height = window.innerHeight;

  el.width = width * dpr;
  el.height = height * dpr;
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;

  if (!gl) return;

  gl.viewport(0, 0, el.width, el.height);
  gl.uniform2f(uniforms.resolution, el.width, el.height);
}

function draw(time = 0) {
  if (!gl || !program) return;

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);

  gl.uniform1f(uniforms.time, time);
  gl.uniform1f(uniforms.reducedMotion, reducedMotion ? 1 : 0);

  gl.drawArrays(gl.POINTS, 0, STARFIELD.count);

  animationId = requestAnimationFrame(draw);
}

function dispose() {
  if (!gl) return;

  if (buffer) {
    gl.deleteBuffer(buffer);
    buffer = null;
  }

  if (program) {
    gl.deleteProgram(program);
    program = null;
  }

  gl = null;
}

onMounted(() => {
  const el = canvas.value;
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!initWebGL(el)) return;

  resizeHandler = () => resize(el);
  resize(el);
  window.addEventListener('resize', resizeHandler);
  draw();
});

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
  }

  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  dispose();
});
</script>

<template>
  <canvas ref="canvas" class="starfield" aria-hidden="true" />
</template>

<style scoped>
.starfield {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: var(--chart-bg);
}
</style>
