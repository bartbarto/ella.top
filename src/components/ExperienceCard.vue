<script setup>
import Card from './Card.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

/** Map display periods like "2015 — Present" to an ISO 8601 interval. */
function periodDatetime(period) {
  if (!period) return undefined;
  const parts = period.split(/\s*[—–-]\s*/).map((part) => part.trim());
  if (parts.length !== 2) return undefined;

  const [start, end] = parts;
  if (!/^\d{4}$/.test(start)) return undefined;
  if (/present/i.test(end)) return `${start}/..`;
  if (/^\d{4}$/.test(end)) return `${start}/${end}`;
  return undefined;
}

const datetime = periodDatetime(props.item.period);
</script>

<template>
  <Card class="experience">
    <div class="header">
      <div>
        <h3>{{ item.role }}</h3>
        <p class="company label">{{ item.company }}</p>
        <p v-if="item.type" class="type faint label">
          <span class="visually-hidden">Employment type: </span>{{ item.type }}
        </p>
      </div>
      <time class="faint label" :datetime="datetime">{{ item.period }}</time>
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
