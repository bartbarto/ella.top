<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <footer class="footer">
    <hr class="chart-divider" aria-hidden="true" />
    <p class="faint">&copy; {{ year }} {{ name }}</p>
  </footer>
</template>

<style scoped>
.footer {
  padding: 2rem 0;
  text-align: center;
}

.chart-divider {
  margin-bottom: 2rem;
}

p {
  font-family: var(--font-label);
  font-size: 0.6875rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
</style>
