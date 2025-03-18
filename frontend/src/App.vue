<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const movieList = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8080/movies");
    movieList.value = response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
});
</script>

<template>
  <div class="movie-list-container">
    <h2>Movie List</h2>
    <div class="movie-list">
      <ul>
        <li v-for="(movie, index) in movieList" :key="index">
          {{ movie }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.movie-list-container {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  font-family: Arial, sans-serif;
}

.movie-list {
  max-height: 400px; /* Adjust height as needed */
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.movie-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.movie-list li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.movie-list li:last-child {
  border-bottom: none;
}
</style>
