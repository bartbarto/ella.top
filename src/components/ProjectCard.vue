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
    <ul v-if="project.tags?.length" class="tags" :aria-label="`${project.name} technologies`">
      <li v-for="tag in project.tags" :key="tag">
        <SkillTag :label="tag" static />
      </li>
    </ul>
    <nav v-if="project.url || project.demo" class="links" :aria-label="`${project.name} links`">
      <LinkPill
        v-if="project.url"
        :href="project.url"
        icon="link"
        :aria-label="`Source code for ${project.name}`"
      >
        Source
      </LinkPill>
      <LinkPill
        v-if="project.demo"
        :href="project.demo"
        icon="link"
        :aria-label="`Live demo of ${project.name}`"
      >
        Live demo
      </LinkPill>
    </nav>
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
