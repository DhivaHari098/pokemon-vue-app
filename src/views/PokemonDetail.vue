<template>
  <div class="details-frame">
    <div class="animated-bg"></div>

    <div class="container content-wrap py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <button class="pokeball-btn" @click="$router.push('/')"><span class="center-dot"></span></button>
        <h2 class="details-title text-capitalize">{{ name }}</h2>
        <div class="spacer" />
      </div>

      <div v-if="loading" class="text-center py-5 text-white">
        <div class="spinner-border text-light" role="status"></div>
        <div class="mt-2">Loading details...</div>
      </div>

      <div v-else class="details-card p-4">
        <div class="row g-4 align-items-center">
          <div class="col-md-5 text-center">
            <img :src="artwork" class="details-artwork" :alt="name" />
          </div>

          <div class="col-md-7 text-white">
            <p class="lead description">{{ description }}</p>

            <div class="row">
              <div class="col-6 mb-2"><strong>Height:</strong> {{ (pokemon.height/10).toFixed(1) }} m</div>
              <div class="col-6 mb-2"><strong>Weight:</strong> {{ (pokemon.weight/10).toFixed(1) }} kg</div>
            </div>

            <h5 class="mt-3">Stats</h5>
            <ul class="stats-list">
              <li v-for="s in pokemon.stats" :key="s.stat.name">
                <span class="stat-name">{{ s.stat.name }}</span>
                <div class="stat-bar">
                  <div class="stat-fill" :style="{ width: Math.min(s.base_stat, 200) / 2 + '%' }"></div>
                </div>
                <span class="stat-value">{{ s.base_stat }}</span>
              </li>
            </ul>

            <h5 class="mt-3">Types</h5>
            <div class="mb-2">
              <span v-for="t in pokemon.types" :key="t.type.name" class="type-chip">{{ t.type.name }}</span>
            </div>

            <h5 class="mt-3">Weaknesses</h5>
            <div>
              <span v-for="w in weaknesses" :key="w" class="weak-chip">{{ w }}</span>
            </div>

            <div class="mt-4">
              <button class="btn btn-light me-2" @click="editing = true">Edit</button>
              <button class="btn btn-outline-light" @click="$router.push('/')">Back</button>
            </div>
          </div>
        </div>
      </div>

      <!-- edit overlay -->
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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePokemonStore } from '../stores/pokemonStore' // ensure file path

const route = useRoute()
const store = usePokemonStore()
const name = route.params.name

const pokemon = ref(null)
const artwork = ref('')
const description = ref('No description.')
const weaknesses = ref([])
const loading = ref(true)
const editing = ref(false)
const form = ref({ height: 0, weight: 0, description: '' })

async function fetchAll(n) {
  loading.value = true
  // if store already has base info, use it as seed
  const base = store.pokemons.find(p => p.name === n)
  if (base) {
    // minimal mapping to pokemon-like shape if not full
    pokemon.value = { ...base, stats: base.stats || [] }
    artwork.value = base.image
  }

  // get fresh complete pokemon data
  try {
    const [pRes, speciesRes] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${n}`),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${n}`)
    ])
    const p = await pRes.json()
    const s = await speciesRes.json()

    pokemon.value = p
    artwork.value = (p.sprites?.other?.['official-artwork']?.front_default) || p.sprites?.front_default
    const en = s.flavor_text_entries.find(e=> e.language.name==='en')
    description.value = en ? en.flavor_text.replace(/\s+/g,' ') : 'No description.'

    // compute weaknesses from types
    const typeUrls = p.types.map(t=>t.type.url)
    const typeData = await Promise.all(typeUrls.map(url => fetch(url).then(r=>r.json())))
    const weakSet = new Set()
    typeData.forEach(tinfo => tinfo.damage_relations.double_damage_from.forEach(x => weakSet.add(x.name)))
    weaknesses.value = [...weakSet]
  } catch (err) {
    console.error(err)
  } finally {
    // prepare edit form values
    form.value.height = pokemon.value?.height || 0
    form.value.weight = pokemon.value?.weight || 0
    form.value.description = description.value
    loading.value = false
  }
}

onMounted(() => fetchAll(name))

// watch route changes (if clicking through without full reload)
watch(() => route.params.name, (newName) => {
  fetchAll(newName)
})

// Save edit updates store (and local view)
function saveEdit() {
  // update the Pinia store (only the fields we track)
  store.updatePokemon(name, {
    height: form.value.height,
    weight: form.value.weight,
    description: form.value.description
  })
  // also update local values
  pokemon.value.height = form.value.height
  pokemon.value.weight = form.value.weight
  description.value = form.value.description
  editing.value = false
}
</script>

<style scoped>
.details-frame { position: relative; min-height: 100vh; overflow: hidden; }
.animated-bg {
  position:absolute; inset:0; z-index:0;
  background: radial-gradient(circle at 10% 10%, rgba(255,203,5,0.10), transparent 8%),
              radial-gradient(circle at 90% 90%, rgba(59,76,202,0.08), transparent 10%),
              linear-gradient(180deg, #2a75bb, #ffffff 55%, #ffd54f 100%);
  animation: slow-shift 16s linear infinite;
  background-size: 200% 200%;
}
@keyframes slow-shift { 0% { background-position: 0% 0% } 50% { background-position: 100% 100% } 100% { background-position: 0% 0% } }

.content-wrap { position: relative; z-index:2; }

/* details card */
.details-card {
  background: linear-gradient(180deg, rgba(0,0,0,0.24), rgba(0,0,0,0.12));
  border-radius: 18px;
  padding: 20px;
  color: white;
  box-shadow: 0 12px 30px rgba(0,0,0,0.35);
}

/* artwork */
.details-artwork { max-width: 320px; width: 100%; object-fit: contain; filter: drop-shadow(0 12px 24px rgba(0,0,0,0.45)); }

/* text */
.details-title { color: #fff; margin:0; font-weight:700; }
.description { color: #f5f7fb; font-style: italic; }

/* stats list */
.stats-list { list-style: none; padding: 0; margin: 0; }
.stats-list li { display:flex; align-items:center; gap:12px; margin:10px 0; }
.stat-name { width: 110px; text-transform: capitalize; color: #fff; }
.stat-bar { flex:1; height:10px; background: rgba(255,255,255,0.15); border-radius:6px; overflow:hidden; }
.stat-fill { height:100%; background: linear-gradient(90deg,#ffcc00,#ff6b6b); }

/* chips */
.type-chip { display:inline-block; padding:6px 10px; background: rgba(255,255,255,0.08); border-radius:999px; margin-right:6px; text-transform:capitalize; }
.weak-chip { display:inline-block; padding:6px 10px; background: rgba(0,0,0,0.12); border-radius:999px; margin-right:6px; text-transform:capitalize; }

/* edit overlay */
.edit-overlay { position:fixed; inset:0; background: rgba(0,0,0,0.6); z-index: 40; display:flex; align-items:center; justify-content:center; }
.edit-card { background:white; color:#222; padding:20px; border-radius:10px; width:420px; }

/* pokeball btn (reuse) */
.pokeball-btn { width:44px; height:44px; border-radius:50%; border:3px solid #111; background:linear-gradient(#ff4b4b,#d92a2a); display:flex; align-items:center; justify-content:center; }
.pokeball-btn .center-dot { width:14px; height:14px; background:white; border-radius:50%; border:2px solid #111; }

/* responsive tweaks */
@media (max-width: 768px) {
  .details-card { padding: 14px; }
  .details-artwork { max-width: 240px; }
}
</style>