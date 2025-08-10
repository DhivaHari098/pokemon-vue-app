import { createRouter, createWebHistory } from 'vue-router'

// Import views
import Home from '../views/Home.vue'
import PokemonDetail from '../views/PokemonDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/pokemon/:name',
    name: 'PokemonDetail',
    component: PokemonDetail,
    props: true // passes :name as a prop if needed
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router