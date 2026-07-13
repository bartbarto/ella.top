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
    class="link-pill glass glass--pill"
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
  gap: 0.45rem;
  padding: 0.45rem 0.85rem;
  font-size: 0.85rem;
  color: var(--text-star);
  text-decoration: none;
  transition: color 0.25s, box-shadow 0.25s, border-color 0.25s;
}

.link-pill:hover {
  color: var(--accent-nebula);
  border-color: rgba(142, 197, 255, 0.35);
  box-shadow:
    0 4px 24px rgba(142, 197, 255, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    inset 0 -1px 0 rgba(255, 255, 255, 0.08);
}
</style>
