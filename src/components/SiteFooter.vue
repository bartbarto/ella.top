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
    <hr class="glass-divider" aria-hidden="true" />
    <p class="faint">&copy; {{ year }} {{ name }}</p>
  </footer>
</template>

<style scoped>
.footer {
  padding: 2rem 1.25rem;
  text-align: center;
}

.glass-divider {
  margin-bottom: 2rem;
}

p {
  font-size: 0.75rem;
}
</style>
