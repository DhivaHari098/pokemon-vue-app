<template>
  <div class="app-frame">
    <!-- animated background -->
    <div class="animated-bg"></div>

    <div class="container py-4 content-wrap">
      <header class="d-flex align-items-center justify-content-between mb-4">
        <h1 class="title">Pokédex Gallery</h1>

        <!-- Pokéball refresh button -->
        <button class="pokeball-btn" @click="refresh">
          <span class="center-dot"></span>
        </button>
      </header>

      <div class="mb-3">
        <input v-model="search" class="form-control" placeholder="Search Pokémon by name..." />
      </div>

      <div v-if="store.loading" class="text-center py-5">
        <div class="spinner-border text-light" role="status"></div>
        <div class="mt-2 text-light">Loading Pokémon...</div>
      </div>

      <div v-else class="row g-4">
        <div
          v-for="pokemon in filteredPokemons"
          :key="pokemon.name"
          class="col-6 col-sm-6 col-md-4 col-lg-3"
        >
          <div class="tcg-card" @click="goToDetail(pokemon.name)" role="button">
            <div class="card-top">
              <img :src="pokemon.image" :alt="pokemon.name" class="artwork" />
            </div>

            <div class="card-body">
              <h5 class="card-title text-capitalize">{{ pokemon.name }}</h5>
              <p class="muted">Height: {{ pokemon.height }} | Weight: {{ pokemon.weight }}</p>
            </div>

            <div class="card-footer d-flex justify-content-between align-items-center">
              <small class="type-pill">{{ pokemon.types }}</small>

              <!-- tiny pokeball action -->
              <button class="mini-pokeball" aria-label="details"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePokemonStore } from '../stores/pokemonStore' // make sure store filename matches

const router = useRouter()
const store = usePokemonStore()
const search = ref('')

const filteredPokemons = computed(() => {
  if (!search.value) return store.pokemons
  return store.pokemons.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const goToDetail = (name) => {
  router.push(`/pokemon/${name}`)
}

const refresh = async () => {
  await store.fetchPokemons()
}

onMounted(() => {
  if (store.pokemons.length === 0) {
    store.fetchPokemons()
  }
})
</script>

<style scoped>
/* layout */
.app-frame { position: relative; min-height: 100vh; overflow: hidden; }
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

/* gentle pan */
@keyframes slow-pan {
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}

/* container sits above background */
.content-wrap { position: relative; z-index: 2; }

/* title */
.title {
  font-weight: 800;
  color: #2a75bb;
  letter-spacing: 1px;
  margin: 0;
}

/* Pokéball button */
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

/* card style (flashy) */
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

/* artwork */
.card-top { flex: 1; display:flex; align-items:center; justify-content:center; padding-top:6px; }
.artwork { max-height: 140px; object-fit: contain; }

/* footer / pill */
.type-pill {
  display:inline-block; background: rgba(0,0,0,0.06); padding:6px 10px; border-radius:999px; font-size:0.8rem;
  color:#222;
}
.card-body { padding-top: 8px; padding-bottom: 8px; }

/* mini pokeball at corner */
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

/* muted text */
.muted { color: #444; font-size: 0.9rem; }

/* responsive tweaks */
@media (max-width: 576px) {
  .artwork { max-height: 120px; }
  .title { font-size: 1.2rem; }
}
</style>