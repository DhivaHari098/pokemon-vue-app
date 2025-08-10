<template>
  <div class="container mt-4">
    <div class="row align-items-center">
      <!-- Image -->
      <div class="col-12 col-md-5 text-center mb-3 mb-md-0">
        <img
          :src="pokemon?.sprites?.front_default"
          alt="Pokemon image"
          class="img-fluid"
          style="max-height: 300px;"
        />
      </div>

      <!-- Details -->
      <div class="col-12 col-md-7">
        <h2 class="text-capitalize">{{ pokemon?.name }}</h2>
        <p><strong>Height:</strong> {{ pokemon?.height }}</p>
        <p><strong>Weight:</strong> {{ pokemon?.weight }}</p>
        <p><strong>Base Experience:</strong> {{ pokemon?.base_experience }}</p>

        <!-- Back Button -->
        <button class="btn btn-primary mt-3" @click="$router.push('/')">
          ← Back to List
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const pokemon = ref(null)

onMounted(async () => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${route.params.name}`)
  pokemon.value = await res.json()
})
</script>