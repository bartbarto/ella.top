<script setup>
import { computed } from 'vue';
import Icon from './Icon.vue';

const props = defineProps({
  href: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'link',
  },
  type: {
    type: String,
    default: 'url',
    validator: (value) => ['url', 'javascript'].includes(value),
  },
  ariaLabel: {
    type: String,
    default: '',
  },
});

const isAction = computed(() => props.type === 'javascript');
const opensInNewTab = computed(
  () => !isAction.value && /^https?:/i.test(props.href),
);

const accessibleName = computed(() => {
  if (!props.ariaLabel) return undefined;
  return opensInNewTab.value
    ? `${props.ariaLabel} (opens in a new tab)`
    : props.ariaLabel;
});

function linkText(href) {
  return href.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:(\/\/)?/, '');
}

function onAction() {
  window.print();
}
</script>

<template>
  <button
    v-if="isAction"
    type="button"
    class="link-pill chart-panel chart-panel--link label print-hide"
    :aria-label="accessibleName"
    @click="onAction"
  >
    <Icon :name="icon" />
    <span><slot /></span>
  </button>

  <a
    v-else
    class="link-pill chart-panel chart-panel--link label"
    :href="href"
    :target="opensInNewTab ? '_blank' : undefined"
    :rel="opensInNewTab ? 'noopener noreferrer' : undefined"
    :data-link="linkText(href)"
    :aria-label="accessibleName"
  >
    <Icon :name="icon" />
    <span><slot /></span>
    <span v-if="opensInNewTab && !ariaLabel" class="visually-hidden"> (opens in a new tab)</span>
  </a>
</template>

<style scoped>
.link-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.75rem;
  color: var(--chart-ink);
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
}

button.link-pill {
  cursor: pointer;
  font: inherit;
  font-size: 0.75rem;
  background: var(--chart-bg-transparent);
}

.link-pill:hover {
  background: rgba(238, 241, 246, 0.06);
  border-color: var(--chart-ink);
}
</style>
