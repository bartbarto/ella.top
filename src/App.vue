<script setup>
import { onMounted } from 'vue';
import portfolio from './data/portfolio.json';
import Starfield from './components/Starfield.vue';
import ChartFrame from './components/ChartFrame.vue';
import ProfileHeader from './components/ProfileHeader.vue';
import Section from './components/Section.vue';
import SkillTag from './components/SkillTag.vue';
import ProjectCard from './components/ProjectCard.vue';
import ExperienceCard from './components/ExperienceCard.vue';
import SiteFooter from './components/SiteFooter.vue';
import { useFavicon } from './composables/useFavicon.js';

const { meta, profile, links, skills, projects, experience, education } = portfolio;
const year = new Date().getFullYear();
useFavicon();

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
  <Starfield class="print-hide" />
  <ChartFrame class="print-hide" />

  <div class="page">
    <a class="skip-link" href="#main-content">Skip to content</a>

    <main id="main-content" class="container" tabindex="-1">
      <ProfileHeader :profile="profile" :links="links" />
      <Section id="skills-heading" title="Skills">
        <ul class="skills">
          <li v-for="skill in skills" :key="skill.name">
            <SkillTag :label="skill.name" :context="skill.context" />
          </li>
        </ul>
      </Section>

      <Section id="experience-heading" class="print-break-before" title="Experience" show-divider>
        <div class="stack">
          <ExperienceCard
            v-for="item in experience"
            :key="item.company + item.period"
            :item="item"
          />
        </div>
      </Section>

      <Section
        v-if="education?.length"
        id="education-heading"
        title="Education"
        show-divider
      >
        <div class="stack">
          <ExperienceCard
            v-for="item in education"
            :key="item.role + (item.period || '')"
            :item="item"
          />
        </div>
      </Section>

      <Section id="projects-heading" class="print-break-before" title="Recent Projects" show-divider>
        <div class="grid">
          <ProjectCard v-for="project in projects" :key="project.url || project.demo" :project="project" />
        </div>
      </Section>
    </main>

    <div class="container">
      <SiteFooter :name="profile.name" :year="year" />
    </div>
  </div>
</template>

<style scoped>
.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@media print {
  .skills {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.65rem 1.25rem;
  }

  .skills > li {
    /* Inner block so break-inside works even when the parent is a grid (Safari) */
    display: block;
    break-inside: avoid;
    page-break-inside: avoid;
    -webkit-column-break-inside: avoid;
  }
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
