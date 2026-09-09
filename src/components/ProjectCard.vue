<script setup>
import Card from './Card.vue';
import SkillTag from './SkillTag.vue';
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
    <p class="muted pre-line body-text">{{ project.description }}</p>
    <div class="tags">
      <SkillTag v-for="tag in project.tags" :label="tag" :key="tag" static />
    </div>
    <div class="links">
      <LinkPill v-if="project.url" :href="project.url" icon="link">Source</LinkPill>
      <LinkPill v-if="project.demo" :href="project.demo" icon="link">Live demo</LinkPill>
    </div>
  </Card>
</template>

<style scoped>
h3 {
  margin-bottom: 0.5rem;
}

p.body-text {
  font-size: 0.9375rem;
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
