<script setup>
import { onMounted } from 'vue';
import portfolio from './data/portfolio.json';
import Starfield from './components/Starfield.vue';
import ProfileHeader from './components/ProfileHeader.vue';
import Section from './components/Section.vue';
import Tag from './components/Tag.vue';
import ProjectCard from './components/ProjectCard.vue';
import ExperienceCard from './components/ExperienceCard.vue';
import SiteFooter from './components/SiteFooter.vue';

const { meta, profile, links, skills, projects, experience } = portfolio;
const year = new Date().getFullYear();

onMounted(() => {
  document.title = meta.title;

  let description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content = meta.description;
  } else {
    description = document.createElement('meta');
    description.name = 'description';
    description.content = meta.description;
    document.head.appendChild(description);
  }
});
</script>

<template>
  <Starfield />

  <div class="page">
    <ProfileHeader :profile="profile" :links="links" />

    <main class="container">
      <Section id="skills-heading" title="Skills">
        <ul class="skills">
          <li v-for="skill in skills" :key="skill">
            <Tag>{{ skill }}</Tag>
          </li>
        </ul>
      </Section>

      <Section id="projects-heading" title="Projects" show-divider>
        <div class="grid">
          <ProjectCard v-for="project in projects" :key="project.url" :project="project" />
        </div>
      </Section>

      <Section id="experience-heading" title="Experience" show-divider>
        <div class="stack">
          <ExperienceCard
            v-for="item in experience"
            :key="item.company + item.period"
            :item="item"
          />
        </div>
      </Section>
    </main>

    <SiteFooter :name="profile.name" :year="year" />
  </div>
</template>

<style scoped>
.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.grid {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
</style>
