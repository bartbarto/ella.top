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
        <p class="company">{{ item.company }}</p>
        <p v-if="item.type" class="type faint">{{ item.type }}</p>
      </div>
      <time class="faint">{{ item.period }}</time>
    </div>
    <p class="muted">{{ item.description }}</p>
  </Card>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.company {
  margin-top: 0.2rem;
  font-size: 0.9rem;
  color: var(--accent-orbit);
}

time {
  flex-shrink: 0;
  font-size: 0.875rem;
}

p {
  font-size: 0.9rem;
}

@media (max-width: 560px) {
  .header {
    flex-direction: column;
  }
}
</style>
