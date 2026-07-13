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
</script>

<template>
  <header class="profile">
    <div class="profile-inner container">
      <img v-if="profile.avatar" class="avatar" :src="profile.avatar" :alt="profile.name" />
      <div v-else class="avatar avatar--placeholder glass glass--round" aria-hidden="true">
        {{ profile.name.charAt(0) }}
      </div>

      <div class="profile-body">
        <p class="eyebrow">{{ profile.location }}</p>
        <h1>{{ profile.name }}</h1>
        <p v-if="profile.pronouns" class="meta faint">{{ profile.pronouns }}</p>
        <p class="title">{{ profile.title }}</p>
        <p v-if="profile.languages?.length" class="meta faint">
          {{ profile.languages.join(' · ') }}
        </p>
        <p class="bio muted">{{ profile.bio }}</p>

        <nav class="links" aria-label="Social links">
          <LinkPill v-for="link in links" :key="link.url" :href="link.url" :icon="link.icon">
            {{ link.label }}
          </LinkPill>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.profile {
  padding: 4rem 0 2.5rem;
}

.profile::after {
  content: '';
  display: block;
  height: 1px;
  margin-top: 2.5rem;
  background: linear-gradient(
    90deg,
    transparent,
    var(--glass-edge-bright),
    transparent
  );
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.04);
}

.profile-inner {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.avatar {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.avatar:not(.avatar--placeholder) {
  border: 1px solid var(--glass-edge);
  box-shadow: var(--glass-shadow), var(--glass-inset-top);
}

.avatar--placeholder {
  display: grid;
  place-items: center;
  color: var(--accent-violet);
  font-size: 1.5rem;
}

.title {
  margin-top: 0.35rem;
  color: var(--accent-violet);
  font-weight: 500;
}

.meta {
  margin-top: 0.25rem;
  font-size: 0.9375rem;
}

.bio {
  margin-top: 1rem;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.25rem;
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
