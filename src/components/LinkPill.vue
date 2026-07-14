<script setup>
import Icon from './Icon.vue';

defineProps({
  href: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'link',
  },
});
</script>

<template>
  <a
    class="link-pill chart-panel chart-panel--link label"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon :name="icon" />
    <span><slot /></span>
  </a>
</template>

<style scoped>
.link-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.75rem;
  color: var(--chart-ink);
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
}

.link-pill:hover {
  background: rgba(238, 241, 246, 0.06);
  border-color: var(--chart-ink);
}
</style>
