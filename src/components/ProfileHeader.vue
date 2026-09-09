<script setup>
import LinkPill from './LinkPill.vue';

defineProps({
  profile: {
    type: Object,
    required: true,
  },
  links: {
    type: Array,
    required: true,
  },
});

const print = () => {
  window.print();
};
</script>

<template>
  <header class="profile">
    <div class="profile-inner">
      <img
        v-if="profile.avatar"
        class="avatar chart-panel"
        :src="profile.avatar"
        :alt="profile.name"
      />
      <div v-else class="avatar avatar--marker chart-panel" aria-hidden="true">
      </div>

      <div class="profile-body">
        <p class="eyebrow">{{ profile.location }}</p>
        <h1>{{ profile.name }}</h1>
        <p v-if="profile.pronouns" class="meta faint label">{{ profile.pronouns }}</p>
        <p class="title label">{{ profile.title }}</p>
        <p v-if="profile.languages?.length" class="meta faint label">
          {{ profile.languages.join(' · ') }}
        </p>
        <p class="bio muted pre-line body-text">{{ profile.bio }}</p>

        <nav class="links" aria-label="Social links">
          <LinkPill v-for="link in links" :key="link.url" :href="link.url" :icon="link.icon" :type="link.type">
            {{ link.label }}
          </LinkPill>          
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.profile {
  padding: 2.5rem 0;
}

.profile-inner {
  display: flex;
  gap: 1.75rem;
  /* align-items: flex-start; */

  /* flex-direction: column;
    align-items: center;
    text-align: center; */
}

.avatar {
  width: 5.5rem;
  height: 5.5rem;
  object-fit: cover;
  flex-shrink: 0;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  border: 1px solid var(--chart-line-strong);
}

.avatar--marker {
  display: grid;
  place-items: center;
  position: relative;
  color: var(--chart-ink);
}

.avatar--marker::before,
.avatar--marker::after {
  content: '';
  position: absolute;
  background: var(--chart-line-strong);
  pointer-events: none;
  z-index: 2;
}

.avatar--marker::before {
  top: 50%;
  left: 12%;
  right: 12%;
  height: 1px;
  transform: translateY(-50%);
}

.avatar--marker::after {
  left: 50%;
  top: 12%;
  bottom: 12%;
  width: 1px;
  transform: translateX(-50%);
}

.avatar__initial {
  font-size: 1.25rem;
  z-index: 1;
}

.title {
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: var(--chart-ink-dim);
}

.meta {
  margin-top: 0.35rem;
  font-size: 0.6875rem;
}

.bio {
  margin-top: 1.25rem;
  line-height: 1.65;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.35rem;
  /* justify-content: center; */
}

@media (max-width: 560px) {
  .profile-inner {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .links {
    justify-content: center;
  }
}
</style>
