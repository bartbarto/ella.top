<script setup>
import Card from './Card.vue';

defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <Card class="experience">
    <div class="header">
      <div>
        <h3>{{ item.role }}</h3>
        <p class="company label">{{ item.company }}</p>
        <p v-if="item.type" class="type faint label">{{ item.type }}</p>
      </div>
      <time class="faint label">{{ item.period }}</time>
    </div>
    <p class="muted pre-line body-text">{{ item.description }}</p>
  </Card>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.85rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed var(--chart-line);
}

.company {
  margin-top: 0.35rem;
  font-size: 0.75rem;
  color: var(--chart-ink-dim);
}

.type {
  margin-top: 0.25rem;
  font-size: 0.6875rem;
}

time {
  flex-shrink: 0;
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
}

p.body-text {
  font-size: 0.9375rem;
}

@media (max-width: 560px) {
  .header {
    flex-direction: column;
  }
}
</style>
