<template>
  <span class="tag glass glass--tag">
    <slot />
  </span>
</template>

<style scoped>
.tag {
  display: inline-block;
  padding: 0.3rem 0.65rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--accent-nebula);
}
</style>
