import { defineStore } from 'pinia'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [],
    loading: false
  }),

  actions: {
    async fetchPokemons() {
      this.loading = true
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100')
        const data = await res.json()
        const list = data.results

        const detailedList = await Promise.all(
          list.map(async (p) => {
            const r = await fetch(p.url)
            const d = await r.json()

            // Fetch species data (for description)
            const speciesRes = await fetch(d.species.url)
            const speciesData = await speciesRes.json()

            // Weaknesses from type data
            const typeRes = await Promise.all(
              d.types.map(async (t) => {
                const tr = await fetch(t.type.url)
                return await tr.json()
              })
            )
            const weaknesses = [
              ...new Set(
                typeRes.flatMap(t =>
                  t.damage_relations.double_damage_from.map(dd => dd.name)
                )
              )
            ]

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

        this.pokemons = detailedList
      } catch (err) {
        console.error('Error fetching Pokémon:', err)
      } finally {
        this.loading = false
      }
    },

    setPokemons(list) {
      this.pokemons = list
    },

    updatePokemon(name, updated) {
      const idx = this.pokemons.findIndex(p => p.name === name)
      if (idx !== -1) {
        this.pokemons[idx] = { ...this.pokemons[idx], ...updated }
      }
    }
  }
})