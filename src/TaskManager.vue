<script setup lang="ts">
// We import watch to keep an eye on the element
import { onMounted, ref, watch, watchEffect, computed } from 'vue';
import type { Task, Priority } from './types.ts';

// We are going to use template refs so when we reload the page it focuses straight away whatever we need
const newTaskInput = ref<HTMLInputElement | null>(null);

const newTask = ref("");
const newPriority = ref<Priority>("");

// JSON parse converts JSON string into an actual JavaScript Object
const tasks = ref<Task[]>(JSON.parse(localStorage.getItem('tasks') ?? "[]"));

watch([newTask, newPriority], () => {
  error.value = "";
});

// This is how watch works, it looks on the element, and proceed with new and old values
watch(newTask, (newValue, oldValue) => {
  // console.log(`New value is ${newValue}, old was ${oldValue}.`)
}, { immediate: true });

// To check for changes of all the properties we have to add keyword deep
// We pass the argument as an object
watch(tasks, () => {
  // We pass the key 'tasks' and the value (it only stores as string so we have to stringify 
  // the object).
  localStorage.setItem(
    'tasks',
    JSON.stringify(tasks.value)
  );
}, { deep: true });

// WatchEffect syntax is simplier than watch so is preferred when we need to watch something use watchEffect
watchEffect(() => {
  console.log(`New task input value is ${newTask.value}`);
});

const filter = ref("");
const filteredTasks = computed<Task[]>((): Task[] => 
  tasks.value.filter((task) => 
    task.description.toLowerCase().includes(filter.value.toLowerCase())
  )
);

const error = ref("");

function addTask(): void {
  error.value = "";

  if (newTask.value.trim() === "") {
    error.value = "The description is empty";
  }

  if (newPriority.value === "") {
    error.value = "Choose the priority";
  }

  if (newTask.value !== "" && newPriority.value !== "") {
    tasks.value.push({
      id: tasks.value.length + 1,
      description: newTask.value,
      priority: newPriority.value,
      done: false,
    });
    newTask.value = "";
    newPriority.value = "";
  }
}

function removeTask(id: number): void {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}

onMounted((): void => {
  // Now we focus directly newTaskInput field whenever the page is loaded
  newTaskInput.value?.focus();
});

</script>

<template>
  <form @submit.prevent="addTask">
    <input ref="newTaskInput" placeholder="Add new task" v-model="newTask">
    <select v-model="newPriority">
      <option disabled value="">Select priority</option>
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>
    <button type="submit">Add task</button>
    <span v-if="error" class="error">{{ error }}</span>
  </form>

  <input placeholder="Filter tasks..." v-model="filter">
  <div v-if="filteredTasks.length === 0">
    <p>No tasks found. Try changing the filter or add some tasks!</p>
  </div>

  <div v-else>
    <h3>Your tasks</h3>
    <!-- This is the list of tasks -->
    <!-- To make a dynamic property in template we inclose it in [] brackets -->
    <div 
      v-for="(task, index) in filteredTasks" 
      :key="task.id" 
      :class="{ completed: task.done, [task.priority]: true }">
      <div>
        <input type="checkbox" v-model="task.done">
        <div>
          <span>{{ task.description }}</span>
        </div>
        <button class="remove-button" @click="removeTask(task.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Palette: slate neutrals + indigo accent, with priority colours carried
   through a per-card --priority variable. */
:global(#app) {
  display: block;
  max-width: 40rem;
  margin: 0 auto;
  padding: clamp(1.5rem, 5vw, 3rem);
  color: #1f2430;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
}

:global(body) {
  background: #f6f7fb;
}

/* ---------- Add-task form ---------- */

form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

/* Keep the three controls on one row: the text input absorbs all spare
   width, the select and button size to their content and never shrink.
   min-width: 0 overrides the default min-width:auto that stops flex items
   from shrinking below their content. */
form input {
  flex: 1 1 0;
  min-width: 0;
}

form select {
  flex: 0 0 auto;
}

form input,
form select,
form + input {
  padding: 0.75rem 1rem;
  border: 1px solid #dfe3ec;
  border-radius: 12px;
  background: #fff;
  color: inherit;
  font: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

form input:focus,
form select:focus,
form + input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px #6366f11f;
}

form button {
  flex: 0 0 auto;
  white-space: nowrap;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  background: #6366f1;
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 18px -10px #6366f1cc;
  transition: background 0.2s, transform 0.12s;
}

form button:hover {
  background: #4f46e5;
  transform: translateY(-1px);
}

form button:active {
  transform: translateY(0);
}

/* ---------- Validation message ---------- */

/* flex-basis: 100% pushes it onto its own row under the form controls. */
.error {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-basis: 100%;
  margin-top: 0.1rem;
  padding: 0.6rem 0.85rem;
  border: 1px solid #fbd5da;
  border-radius: 10px;
  background: #fff1f3;
  color: #be123c;
  font-size: 0.875rem;
  font-weight: 500;
  animation: error-in 0.22s ease-out;
}

/* Warning glyph without touching the markup. */
.error::before {
  content: '!';
  display: grid;
  place-items: center;
  width: 1.15rem;
  height: 1.15rem;
  flex-shrink: 0;
  border-radius: 999px;
  background: #f43f5e;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
}

@keyframes error-in {
  from {
    opacity: 0;
    transform: translateY(-3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .error {
    animation: none;
  }
}

/* The filter field — `form + input` targets only the one right after the form. */
form + input {
  display: block;
  width: 100%;
  margin-bottom: 1.75rem;
}

/* ---------- Headings & empty state ---------- */

h3 {
  margin: 0 0 0.9rem;
  color: #6b7280;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

p {
  margin: 0;
  padding: 3rem 1rem;
  border: 1.5px dashed #dfe3ec;
  border-radius: 16px;
  color: #8b93a3;
  text-align: center;
}

/* ---------- Task cards ---------- */

.low,
.medium,
.high {
  min-width: 600px;
  margin-bottom: 0.6rem;
  padding: 0.9rem 1.1rem;
  border: 1px solid #e8ebf2;
  border-left: 4px solid var(--priority);
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 2px #0f172a0a, 0 10px 22px -18px #0f172a4d;
  transition: transform 0.18s, box-shadow 0.18s;
}

.low:hover,
.medium:hover,
.high:hover {
  transform: translateX(2px);
  box-shadow: 0 1px 2px #0f172a0a, 0 14px 26px -16px #0f172a66;
}

.low    { --priority: #10b981; }  /* emerald */
.medium { --priority: #f59e0b; }  /* amber   */
.high   { --priority: #f43f5e; }  /* rose    */

/* Inner row: checkbox, label, remove button */
.low > div,
.medium > div,
.high > div {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.low > div > div,
.medium > div > div,
.high > div > div {
  flex: 1;
}

input[type='checkbox'] {
  width: 1.15rem;
  height: 1.15rem;
  accent-color: var(--priority);
  cursor: pointer;
  flex-shrink: 0;
}

span {
  font-size: 0.975rem;
}

.remove-button {
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: #b6bcc9;
  font-size: 0.9rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.remove-button:hover {
  background: #fee2e6;
  color: #f43f5e;
}

/* ---------- Completed ---------- */

.completed {
  --priority: #cbd2de;
  background: #fafbfd;
}

.completed span {
  color: #a3aab8;
  text-decoration: line-through;
}
</style>
