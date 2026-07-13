<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  showDivider: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <hr v-if="showDivider" class="glass-divider" aria-hidden="true" />
  <section class="section" :aria-labelledby="id">
    <h2 :id="id">{{ title }}</h2>
    <slot />
  </section>
</template>

<style scoped>
.section {
  padding: 2.5rem 0;
}

h2 {
  margin-bottom: 1.25rem;
}
</style>
