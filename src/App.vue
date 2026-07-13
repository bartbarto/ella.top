<script setup>
import { onMounted } from 'vue';
import portfolio from './data/portfolio.json';
import Icon from './components/Icon.vue';

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
  <header class="hero">
    <div class="hero-inner">
      <img v-if="profile.avatar" class="avatar" :src="profile.avatar" alt="" />
      <div v-else class="avatar avatar--placeholder" aria-hidden="true">
        {{ profile.name.charAt(0) }}
      </div>

      <div class="hero-text">
        <p class="eyebrow">{{ profile.location }}</p>
        <h1>{{ profile.name }}</h1>
        <p v-if="profile.pronouns" class="pronouns">{{ profile.pronouns }}</p>
        <p class="title">{{ profile.title }}</p>
        <p v-if="profile.languages?.length" class="languages">
          {{ profile.languages.join(' · ') }}
        </p>
        <p class="bio">{{ profile.bio }}</p>

        <nav class="links" aria-label="Social links">
          <a
            v-for="link in links"
            :key="link.url"
            class="link"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon :name="link.icon" />
            <span>{{ link.label }}</span>
          </a>
        </nav>
      </div>
    </div>
  </header>

  <main>
    <section class="section" aria-labelledby="skills-heading">
      <h2 id="skills-heading">Skills</h2>
      <ul class="skills">
        <li v-for="skill in skills" :key="skill">{{ skill }}</li>
      </ul>
    </section>

    <section class="section" aria-labelledby="projects-heading">
      <h2 id="projects-heading">Projects</h2>
      <div class="grid">
        <article v-for="project in projects" :key="project.url" class="card project">
          <h3>{{ project.name }}</h3>
          <p>{{ project.description }}</p>
          <div class="tags">
            <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="project-links">
            <a
              class="project-link"
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source <Icon name="link" />
            </a>
            <a
              v-if="project.demo"
              class="project-link"
              :href="project.demo"
              target="_blank"
              rel="noopener noreferrer"
            >
              Live demo <Icon name="link" />
            </a>
          </div>
        </article>
      </div>
    </section>

    <section class="section" aria-labelledby="experience-heading">
      <h2 id="experience-heading">Experience</h2>
      <div class="stack">
        <article v-for="item in experience" :key="item.company + item.period" class="card experience">
          <div class="experience-header">
            <div>
              <h3>{{ item.role }}</h3>
              <p class="company">{{ item.company }}</p>
            </div>
            <time>{{ item.period }}</time>
          </div>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>
  </main>

  <footer>
    <p>&copy; {{ year }} {{ profile.name }}</p>
  </footer>
</template>
