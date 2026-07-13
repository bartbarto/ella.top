<script setup>
import Card from './Card.vue';
import Tag from './Tag.vue';
import LinkPill from './LinkPill.vue';

defineProps({
  project: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <Card class="project">
    <h3>{{ project.name }}</h3>
    <p class="muted">{{ project.description }}</p>
    <div class="tags">
      <Tag v-for="tag in project.tags" :key="tag">{{ tag }}</Tag>
    </div>
    <div class="links">
      <LinkPill :href="project.url" icon="link">Source</LinkPill>
      <LinkPill v-if="project.demo" :href="project.demo" icon="link">Live demo</LinkPill>
    </div>
  </Card>
</template>

<style scoped>
h3 {
  margin-bottom: 0.5rem;
}

p {
  font-size: 0.9rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 1rem;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>
