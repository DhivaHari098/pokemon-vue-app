<template>
  <div class="app-frame">
    <!-- Animated background for visual appeal -->
    <div class="animated-bg"></div>

    <!-- Main content container -->
    <div class="container py-4 content-wrap">
      <!-- Header section with title and refresh button -->
      <header class="d-flex align-items-center justify-content-between mb-4">
        <h1 class="title">Pokédex Gallery</h1>

        <!-- Pokéball refresh button triggers Pokémon list refresh -->
        <button class="pokeball-btn" @click="refresh">
          <span class="center-dot"></span>
        </button>
      </header>

      <!-- Search input to filter Pokémon by name -->
      <div class="mb-3">
        <input v-model="search" class="form-control" placeholder="Search Pokémon by name..." />
      </div>

      <!-- Loading indicator when data is being fetched -->
      <div v-if="store.loading" class="text-center py-5">
        <div class="spinner-border text-light" role="status"></div>
        <div class="mt-2 text-light">Loading Pokémon...</div>
      </div>

      <!-- Pokémon card grid (displayed after loading finishes) -->
      <div v-else class="row g-4">
        <!-- Loop through filtered Pokémon list -->
        <div
          v-for="pokemon in filteredPokemons"
          :key="pokemon.name"
          class="col-6 col-sm-6 col-md-4 col-lg-3"
        >
          <!-- Clickable Pokémon card that navigates to detail view -->
          <div class="tcg-card" @click="goToDetail(pokemon.name)" role="button">
            <!-- Card top section (Pokémon image) -->
            <div class="card-top">
              <img :src="pokemon.image" :alt="pokemon.name" class="artwork" />
            </div>

            <!-- Card body (Pokémon name and basic stats) -->
            <div class="card-body">
              <h5 class="card-title text-capitalize">{{ pokemon.name }}</h5>
              <p class="muted">Height: {{ pokemon.height }} | Weight: {{ pokemon.weight }}</p>
            </div>

            <!-- Card footer with type label and mini Pokéball icon -->
            <div class="card-footer d-flex justify-content-between align-items-center">
              <small class="type-pill">{{ pokemon.types }}</small>

              <!-- Tiny Pokéball (purely decorative in this context) -->
              <button class="mini-pokeball" aria-label="details"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import Vue Composition API utilities
import { ref, computed, onMounted } from 'vue'
// Import router for navigation
import { useRouter } from 'vue-router'
// Import Pinia store for Pokémon data management
import { usePokemonStore } from '../stores/pokemonStore' // Ensure filename matches

// Router instance for navigation
const router = useRouter()
// Store instance for Pokémon data
const store = usePokemonStore()
// Search query (reactive)
const search = ref('')

// Computed list of Pokémon filtered by search query
const filteredPokemons = computed(() => {
  if (!search.value) return store.pokemons
  return store.pokemons.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

// Navigate to Pokémon detail page
const goToDetail = (name) => {
  router.push(`/pokemon/${name}`)
}

// Refresh Pokémon list from API
const refresh = async () => {
  await store.fetchPokemons()
}

// Fetch Pokémon data when component mounts if store is empty
onMounted(() => {
  if (store.pokemons.length === 0) {
    store.fetchPokemons()
  }
})
</script>

<style scoped>
/* Layout wrapper */
.app-frame { position: relative; min-height: 100vh; overflow: hidden; }

/* Animated background gradient */
.animated-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, rgba(255,203,5,0.12), transparent 10%),
              radial-gradient(circle at 80% 80%, rgba(59,76,202,0.10), transparent 12%),
              linear-gradient(135deg, #fffbeb 0%, #fff7f2 50%, #eef7ff 100%);
  z-index: 0;
  animation: slow-pan 18s linear infinite;
  background-size: 200% 200%;
  filter: saturate(1.05);
}

/* Background animation keyframes */
@keyframes slow-pan {
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}

/* Ensure content stays above background */
.content-wrap { position: relative; z-index: 2; }

/* Page title styles */
.title {
  font-weight: 800;
  color: #2a75bb;
  letter-spacing: 1px;
  margin: 0;
}

/* Main Pokéball refresh button styles */
.pokeball-btn {
  width: 56px; height: 56px;
  border-radius: 50%;
  border: 4px solid #222;
  background: linear-gradient(#ff3b3b 0%, #d12a2a 60%, #b71c1c 100%);
  position: relative;
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  display: inline-flex; align-items:center; justify-content:center;
  cursor: pointer;
}
.pokeball-btn::after {
  content: '';
  position: absolute; left: 6px; right:6px; height: 10px; background: #111;
  top: 50%; transform: translateY(-50%);
  border-radius: 2px;
  box-shadow: 0 2px 0 rgba(255,255,255,0.06) inset;
}
.center-dot {
  width: 18px; height: 18px; background: #fff;
  border: 3px solid #111; border-radius: 50%;
}

/* Pokémon card container styles */
.tcg-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,248,250,0.9));
  border-radius: 14px;
  padding: 10px;
  border: 3px solid rgba(0,0,0,0.08);
  box-shadow: 0 8px 18px rgba(41, 50, 78, 0.08);
  transition: transform 220ms ease, box-shadow 220ms ease;
  cursor: pointer;
  display: flex; flex-direction: column; height: 100%;
}
.tcg-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 18px 40px rgba(41,50,78,0.18);
}

/* Pokémon image wrapper */
.card-top { flex: 1; display:flex; align-items:center; justify-content:center; padding-top:6px; }
.artwork { max-height: 140px; object-fit: contain; }

/* Type label styles */
.type-pill {
  display:inline-block; background: rgba(0,0,0,0.06); padding:6px 10px; border-radius:999px; font-size:0.8rem;
  color:#222;
}
.card-body { padding-top: 8px; padding-bottom: 8px; }

/* Decorative mini Pokéball icon in card footer */
.mini-pokeball {
  width: 22px; height:22px; border-radius:50%;
  border:2px solid #111; background: linear-gradient(#ff4b4b,#dd2b2b); position: relative;
}
.mini-pokeball::after {
  content:''; position:absolute; left:4px; right:4px; height:3px; background:#111; top:50%; transform:translateY(-50%);
}
.mini-pokeball::before {
  content:''; position:absolute; left:7px; top:7px; width:8px; height:8px; background:white; border-radius:50%; border:2px solid #111;
}

/* Subtle muted text for stats */
.muted { color: #444; font-size: 0.9rem; }

/* Responsive tweaks for small screens */
@media (max-width: 576px) {
  .artwork { max-height: 120px; }
  .title { font-size: 1.2rem; }
}
</style>