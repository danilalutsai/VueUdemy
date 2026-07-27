<script setup lang="ts">
import { ref, computed } from 'vue';

let counter = ref<number>(0);
let message = ref<string>('Hello');
let age = ref<number | null>(null);
let canDrive = computed(() => {
  console.log('Computed');
  return counter.value! >= 18 ? 'Yes' : 'No';
})


function add() {
  counter.value++;
}

function remove() {
  counter.value--;
}

setTimeout(() => {
  console.log('Changed!');
  message.value = 'Bye!';
})
</script>

<template>
  <header>
  </header>

  <main>
    <p>{{ canDrive }}</p>
    <p>Count: {{ counter }}</p>
    <button @click="add">Add</button>
    <button @click="remove">Remove</button>
  </main>
</template>

<style scoped>
/* main.css makes #app a two-column grid above 1024px and pins it left.
   :global() is needed — #app lives in index.html, so it never gets the
   scope attribute. */
:global(#app) {
  display: grid;
  place-items: center;
  min-height: 100svh;
  max-width: none;
}

header {
  display: none;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
  font-family: system-ui, sans-serif;
}

p {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

button {
  color: #ffffff;
  min-width: 7.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #d8dce3;
  border-radius: 999px;
  background: #fff;
  font: inherit;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

button:hover {
  border-color: #10b981;
  background: #f4faf7;
}

button:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 3px;
}

@media (prefers-color-scheme: dark) {
  button {
    border-color: #333a45;
    background: #1b1f26;
  }

  button:hover {
    border-color: #10b981;
    background: #232932;
  }
}
</style>
