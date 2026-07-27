<script setup lang="ts">
import { createApp, ref } from 'vue';

const newPhotoUrl = ref('');

interface Photo {
  id: number;
  url: string;
  isFavourite: boolean;
}

const addPhoto = function(event: Event) {
  event.preventDefault();
  console.log('I was clicked');
  const photo = {
    id: photos.value.length + 1,
    url: newPhotoUrl.value,
    isFavourite: false,
  };
  
  if (newPhotoUrl.value !== "") {
    photos.value.push(photo);
    newPhotoUrl.value = '';
  }
}

const photos = ref<Photo[]>([]);
const toggleFavourite = function() {
  // Adding photo logic here
}
</script>

<template>
  <form>
    <input placeholder="Enter image URL" v-model="newPhotoUrl">
    <!-- v-on click is same as v-on:click -->
    <button type="submit" @click="addPhoto">Add Photo</button>
    <p class="no-photos" v-if="photos.length === 0">No photos added yet. Add some!</p>
    <div class="gallery" v-else>
      <div class="photo">
        <button class="favourite-button">⭐</button>
      </div>
    </div>
  </form>
</template>

<style scoped>
/* main.css makes #app a two-column grid above 1024px. :global() reaches it,
   since #app lives in index.html and never gets the scope attribute. */
:global(#app) {
  display: block;
  max-width: 56rem;
  margin: 0 auto;
  padding: clamp(1.5rem, 5vw, 3rem);
}

/* Your </form> wraps the gallery too, so this row has to wrap and let the
   non-input children span the full width. */
form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

input {
  flex: 1 1 14rem;
  padding: 0.8rem 1.1rem;
  border: 1px solid #dce0e7;
  border-radius: 12px;
  background: #fff;
  font: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input::placeholder {
  color: #9aa2b1;
}

input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 4px #10b9811f;
}

button[type='submit'] {
  padding: 0.8rem 1.6rem;
  border: none;
  border-radius: 12px;
  background: #10b981;
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 18px -10px #10b981cc;
  transition: background 0.2s, transform 0.12s, box-shadow 0.2s;
}

button[type='submit']:hover {
  background: #0ea371;
  box-shadow: 0 12px 24px -10px #10b981;
  transform: translateY(-1px);
}

button[type='submit']:active {
  transform: translateY(0);
}

.no-photos,
.gallery {
  flex-basis: 100%;
  margin-top: 1.5rem;
}

.no-photos {
  padding: 3.5rem 1rem;
  border: 1.5px dashed #dce0e7;
  border-radius: 16px;
  color: #8a92a1;
  text-align: center;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: 1rem;
}

.photo {
  position: relative;
  aspect-ratio: 1;
  border-radius: 16px;
  background: linear-gradient(135deg, #eef1f5, #e2e6ec);
  overflow: hidden;
  box-shadow: 0 1px 2px #0f172a0d, 0 12px 28px -18px;
  transition: transform 0.25s, box-shadow 0.25s;
}

.photo:hover {
  transform: translateY(-3px);
  box-shadow: 0 1px 2px #0f172a0d, 0 20px 36px -18px;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favourite-button {
  position: absolute;
  top: 0.55rem;
  right: 0.55rem;
  padding: 0.35rem 0.55rem;
  border: none;
  border-radius: 999px;
  background: #ffffffd9;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: transform 0.15s, background 0.2s;
}

.favourite-button:hover {
  background: #fff;
  transform: scale(1.12);
}

@media (prefers-color-scheme: dark) {
  input {
    border-color: #333a45;
    color: #e6e9ee;
  }

  .no-photos {
    border-color: #333a45;
    color: #8a92a1;
  }

  .photo {
    background: linear-gradient(135deg);
  }


  .favourite-button:hover {
    background: #232833;
  }
}
</style>
