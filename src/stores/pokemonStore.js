// Import Pinia's defineStore function to create a store
import { defineStore } from 'pinia'

// Define and export the Pokémon store
export const usePokemonStore = defineStore('pokemon', {
  // --- STATE ---
  state: () => ({
    pokemons: [],   // Holds the array of Pokémon data
    loading: false  // Tracks loading state for API requests
  }),

  // --- ACTIONS ---
  actions: {
    /**
     * Fetches Pokémon data from the PokéAPI.
     * 1. Gets the list of Pokémon with basic info (name + URL).
     * 2. For each Pokémon, fetches detailed data including:
     *    - Image
     *    - Height & weight
     *    - Types and abilities
     *    - Base experience
     *    - Special attack & defense stats
     *    - Weaknesses (from type damage relations)
     *    - Description (from species data)
     * 3. Stores the processed Pokémon objects in `pokemons`.
     */
    async fetchPokemons() {
      this.loading = true
      try {
        // Step 1: Fetch Pokémon list
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100')
        const data = await res.json()
        const list = data.results

        // Step 2: Fetch details for each Pokémon in parallel
        const detailedList = await Promise.all(
          list.map(async (p) => {
            const r = await fetch(p.url)
            const d = await r.json()

            // Fetch species data (for description)
            const speciesRes = await fetch(d.species.url)
            const speciesData = await speciesRes.json()

            // Fetch type data to determine weaknesses
            const typeRes = await Promise.all(
              d.types.map(async (t) => {
                const tr = await fetch(t.type.url)
                return await tr.json()
              })
            )

            // Extract weaknesses from type damage relations
            const weaknesses = [
              ...new Set(
                typeRes.flatMap(t =>
                  t.damage_relations.double_damage_from.map(dd => dd.name)
                )
              )
            ]

            // Return the complete Pokémon object
            return {
              name: d.name,
              image: d.sprites.other['official-artwork'].front_default,
              height: d.height,
              weight: d.weight,
              types: d.types.map(t => t.type.name).join(', '),
              abilities: d.abilities.map(a => a.ability.name).join(', '),
              baseExperience: d.base_experience,
              specialAttack:
                d.stats.find(s => s.stat.name === 'special-attack')?.base_stat,
              tanking:
                d.stats.find(s => s.stat.name === 'defense')?.base_stat,
              weaknesses: weaknesses.join(', '),
              description:
                speciesData.flavor_text_entries.find(
                  entry => entry.language.name === 'en'
                )?.flavor_text.replace(/\f/g, ' ') || 'No description available'
            }
          })
        )

        // Step 3: Save results to the store
        this.pokemons = detailedList
      } catch (err) {
        console.error('Error fetching Pokémon:', err)
      } finally {
        // Reset loading state
        this.loading = false
      }
    },

    /**
     * Replaces the current Pokémon list with a new one.
     * @param {Array} list - The new array of Pokémon objects.
     */
    setPokemons(list) {
      this.pokemons = list
    },

    /**
     * Updates a single Pokémon in the list by name.
     * @param {String} name - The Pokémon's name to update.
     * @param {Object} updated - The updated fields and values.
     */
    updatePokemon(name, updated) {
      const idx = this.pokemons.findIndex(p => p.name === name)
      if (idx !== -1) {
        this.pokemons[idx] = { ...this.pokemons[idx], ...updated }
      }
    }
  }
})