<template>
  <div class="details-frame">
    <!-- Background animation layer -->
    <div class="animated-bg"></div>

    <!-- Main content container -->
    <div class="container content-wrap py-4">

      <!-- Header row: back button, Pokémon name, spacer -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <!-- Pokéball button navigates back to the home page -->
        <button class="pokeball-btn" @click="$router.push('/')">
          <span class="center-dot"></span>
        </button>
        <!-- Pokémon name displayed with first letter capitalized -->
        <h2 class="details-title text-capitalize">{{ name }}</h2>
        <div class="spacer" />
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-5 text-white">
        <div class="spinner-border text-light" role="status"></div>
        <div class="mt-2">Loading details...</div>
      </div>

      <!-- Pokémon details card -->
      <div v-else class="details-card p-4">
        <div class="row g-4 align-items-center">
          
          <!-- Pokémon artwork -->
          <div class="col-md-5 text-center">
            <img :src="artwork" class="details-artwork" :alt="name" />
          </div>

          <!-- Pokémon info -->
          <div class="col-md-7 text-white">
            <!-- Description -->
            <p class="lead description">{{ description }}</p>

            <!-- Height and weight -->
            <div class="row">
              <div class="col-6 mb-2"><strong>Height:</strong> {{ (pokemon.height/10).toFixed(1) }} m</div>
              <div class="col-6 mb-2"><strong>Weight:</strong> {{ (pokemon.weight/10).toFixed(1) }} kg</div>
            </div>

            <!-- Base stats -->
            <h5 class="mt-3">Stats</h5>
            <ul class="stats-list">
              <li v-for="s in pokemon.stats" :key="s.stat.name">
                <span class="stat-name">{{ s.stat.name }}</span>
                <div class="stat-bar">
                  <!-- Stat bar width proportional to base_stat, capped at 200 -->
                  <div class="stat-fill" :style="{ width: Math.min(s.base_stat, 200) / 2 + '%' }"></div>
                </div>
                <span class="stat-value">{{ s.base_stat }}</span>
              </li>
            </ul>

            <!-- Pokémon types -->
            <h5 class="mt-3">Types</h5>
            <div class="mb-2">
              <span v-for="t in pokemon.types" :key="t.type.name" class="type-chip">{{ t.type.name }}</span>
            </div>

            <!-- Weaknesses (double damage from) -->
            <h5 class="mt-3">Weaknesses</h5>
            <div>
              <span v-for="w in weaknesses" :key="w" class="weak-chip">{{ w }}</span>
            </div>

            <!-- Action buttons -->
            <div class="mt-4">
              <button class="btn btn-light me-2" @click="editing = true">Edit</button>
              <button class="btn btn-outline-light" @click="$router.push('/')">Back</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit overlay for modifying height, weight, and description -->
      <div v-if="editing" class="edit-overlay">
        <div class="edit-card">
          <h5>Edit Pokémon</h5>
          <label class="form-label">Height</label>
          <input v-model.number="form.height" class="form-control mb-2" />
          <label class="form-label">Weight</label>
          <input v-model.number="form.weight" class="form-control mb-2" />
          <label class="form-label">Description</label>
          <textarea v-model="form.description" class="form-control mb-2" rows="3" />
          <div class="d-flex justify-content-end">
            <button class="btn btn-success me-2" @click="saveEdit">Save</button>
            <button class="btn btn-secondary" @click="editing=false">Cancel</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
/*
  Imports
  - ref, onMounted, watch: Vue composition API functions for reactivity and lifecycle handling
  - useRoute: access the current route parameters
  - usePokemonStore: Pinia store to access and update Pokémon data
*/
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePokemonStore } from '../stores/pokemonStore'

/* Reactive references & store setup */
const route = useRoute()
const store = usePokemonStore()
const name = route.params.name // Pokémon name from the route

const pokemon = ref(null)       // Holds fetched Pokémon data
const artwork = ref('')         // Artwork image URL
const description = ref('No description.') // Pokémon description
const weaknesses = ref([])      // List of weaknesses
const loading = ref(true)       // Loading state
const editing = ref(false)      // Edit mode toggle
const form = ref({ height: 0, weight: 0, description: '' }) // Form state for editing

/*
  Fetch Pokémon data from API and prepare details.
  - Checks local store first for cached data
  - Fetches complete details and species info
  - Extracts description, stats, types, and weaknesses
*/
async function fetchAll(n) {
  loading.value = true

  // Use cached data from store if available
  const base = store.pokemons.find(p => p.name === n)
  if (base) {
    pokemon.value = { ...base, stats: base.stats || [] }
    artwork.value = base.image
  }

  try {
    // Fetch Pokémon data and species info in parallel
    const [pRes, speciesRes] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${n}`),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${n}`)
    ])
    const p = await pRes.json()
    const s = await speciesRes.json()

    pokemon.value = p
    artwork.value = (p.sprites?.other?.['official-artwork']?.front_default) || p.sprites?.front_default

    // Get English flavor text, clean whitespace
    const en = s.flavor_text_entries.find(e => e.language.name === 'en')
    description.value = en ? en.flavor_text.replace(/\s+/g, ' ') : 'No description.'

    // Calculate weaknesses based on types
    const typeUrls = p.types.map(t => t.type.url)
    const typeData = await Promise.all(typeUrls.map(url => fetch(url).then(r => r.json())))
    const weakSet = new Set()
    typeData.forEach(tinfo =>
      tinfo.damage_relations.double_damage_from.forEach(x => weakSet.add(x.name))
    )
    weaknesses.value = [...weakSet]
  } catch (err) {
    console.error(err)
  } finally {
    // Pre-fill edit form with current values
    form.value.height = pokemon.value?.height || 0
    form.value.weight = pokemon.value?.weight || 0
    form.value.description = description.value
    loading.value = false
  }
}

/* On mount, fetch Pokémon details based on initial route name */
onMounted(() => fetchAll(name))

/* Watch for route name changes and refetch data without full reload */
watch(() => route.params.name, (newName) => {
  fetchAll(newName)
})

/*
  Save edits made in the edit overlay:
  - Updates store with new height, weight, and description
  - Updates local component state
*/
function saveEdit() {
  store.updatePokemon(name, {
    height: form.value.height,
    weight: form.value.weight,
    description: form.value.description
  })
  pokemon.value.height = form.value.height
  pokemon.value.weight = form.value.weight
  description.value = form.value.description
  editing.value = false
}
</script>

<style scoped>
/* Main layout & background */
.details-frame { position: relative; min-height: 100vh; overflow: hidden; }
.animated-bg {
  position:absolute; inset:0; z-index:0;
  background: radial-gradient(circle at 10% 10%, rgba(255,203,5,0.10), transparent 8%),
              radial-gradient(circle at 90% 90%, rgba(59,76,202,0.08), transparent 10%),
              linear-gradient(180deg, #2a75bb, #ffffff 55%, #ffd54f 100%);
  animation: slow-shift 16s linear infinite;
  background-size: 200% 200%;
}
@keyframes slow-shift { 
  0% { background-position: 0% 0% } 
  50% { background-position: 100% 100% } 
  100% { background-position: 0% 0% } 
}

.content-wrap { position: relative; z-index:2; }

/* Details card styling */
.details-card {
  background: linear-gradient(180deg, rgba(0,0,0,0.24), rgba(0,0,0,0.12));
  border-radius: 18px;
  padding: 20px;
  color: white;
  box-shadow: 0 12px 30px rgba(0,0,0,0.35);
}

/* Pokémon artwork image */
.details-artwork { 
  max-width: 320px; 
  width: 100%; 
  object-fit: contain; 
  filter: drop-shadow(0 12px 24px rgba(0,0,0,0.45)); 
}

/* Text styles */
.details-title { color: #fff; margin:0; font-weight:700; }
.description { color: #f5f7fb; font-style: italic; }

/* Stats list styling */
.stats-list { list-style: none; padding: 0; margin: 0; }
.stats-list li { display:flex; align-items:center; gap:12px; margin:10px 0; }
.stat-name { width: 110px; text-transform: capitalize; color: #fff; }
.stat-bar { flex:1; height:10px; background: rgba(255,255,255,0.15); border-radius:6px; overflow:hidden; }
.stat-fill { height:100%; background: linear-gradient(90deg,#ffcc00,#ff6b6b); }

/* Chips for types and weaknesses */
.type-chip { display:inline-block; padding:6px 10px; background: rgba(255,255,255,0.08); border-radius:999px; margin-right:6px; text-transform:capitalize; }
.weak-chip { display:inline-block; padding:6px 10px; background: rgba(0,0,0,0.12); border-radius:999px; margin-right:6px; text-transform:capitalize; }

/* Edit overlay modal */
.edit-overlay { position:fixed; inset:0; background: rgba(0,0,0,0.6); z-index: 40; display:flex; align-items:center; justify-content:center; }
.edit-card { background:white; color:#222; padding:20px; border-radius:10px; width:420px; }

/* Pokéball button */
.pokeball-btn { width:44px; height:44px; border-radius:50%; border:3px solid #111; background:linear-gradient(#ff4b4b,#d92a2a); display:flex; align-items:center; justify-content:center; }
.pokeball-btn .center-dot { width:14px; height:14px; background:white; border-radius:50%; border:2px solid #111; }

/* Responsive tweaks for mobile */
@media (max-width: 768px) {
  .details-card { padding: 14px; }
  .details-artwork { max-width: 240px; }
}
</style>