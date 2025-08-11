<template>
  <div class="container mt-4">
    <div class="row align-items-center">
      <!-- Image Section -->
      <!-- Displays the Pokémon's front image, centered in the column -->
      <div class="col-12 col-md-5 text-center mb-3 mb-md-0">
        <img
          :src="pokemon?.sprites?.front_default" <!-- Dynamically binds the Pokémon image source -->
          alt="Pokemon image" <!-- Alternative text if image fails -->
          class="img-fluid" <!-- Bootstrap responsive image -->
          style="max-height: 300px;" <!-- Limit max height -->
        />
      </div>

      <!-- Details Section -->
      <!-- Shows name, height, weight, and base experience -->
      <div class="col-12 col-md-7">
        <h2 class="text-capitalize">{{ pokemon?.name }}</h2> <!-- Pokémon name -->
        <p><strong>Height:</strong> {{ pokemon?.height }}</p> <!-- Pokémon height -->
        <p><strong>Weight:</strong> {{ pokemon?.weight }}</p> <!-- Pokémon weight -->
        <p><strong>Base Experience:</strong> {{ pokemon?.base_experience }}</p> <!-- Pokémon base experience -->

        <!-- Back Button -->
        <!-- Navigates back to the Pokémon list page when clicked -->
        <button class="btn btn-primary mt-3" @click="$router.push('/')">
          ← Back to List
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import Vue Composition API features
import { ref, onMounted } from 'vue'
// Import Vue Router's useRoute to access route parameters
import { useRoute } from 'vue-router'

// Get current route object
const route = useRoute()
// Reactive reference to store Pokémon data
const pokemon = ref(null)

// Fetch Pokémon details when component mounts
onMounted(async () => {
  // Fetch from PokéAPI using the Pokémon name from the URL parameter
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${route.params.name}`)
  // Store the JSON response in 'pokemon'
  pokemon.value = await res.json()
})
</script>