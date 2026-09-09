import { onMounted, onUnmounted, ref } from 'vue';

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

/**
 * Toggles when the classic Konami sequence is entered.
 * @returns {{ active: import('vue').Ref<boolean> }}
 */
export function useKonami() {
  const active = ref(false);
  let index = 0;

  function onKeydown(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    const expected = SEQUENCE[index];

    if (key === expected) {
      index += 1;
      if (index === SEQUENCE.length) {
        active.value = !active.value;
        index = 0;
      }
      return;
    }

    index = key === SEQUENCE[0] ? 1 : 0;
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown);
  });

  return { active };
}
