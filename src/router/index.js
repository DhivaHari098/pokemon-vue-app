// Importing the Vue Router methods to create a router instance
// 'createRouter' is used to define routes and navigation
// 'createWebHistory' enables HTML5 history mode for clean URLs without hash (#)
import { createRouter, createWebHistory } from 'vue-router'

// Importing the views (pages) for the routes
// 'Home' is the main landing page
import Home from '../views/Home.vue'
// 'PokemonDetail' is the page to display details for a selected Pokémon
import PokemonDetail from '../views/PokemonDetail.vue'

// Defining the application routes
const routes = [
  {
    path: '/', // The root path of the app (http://localhost:5173/)
    name: 'Home', // Route name (can be used in navigation)
    component: Home // The component that renders when this route is visited
  },
  {
    path: '/pokemon/:name', // Dynamic route with ':name' as a parameter
    name: 'PokemonDetail', // Route name for Pokémon details page
    component: PokemonDetail, // Component to render for this route
    props: true // Automatically passes the ':name' route parameter as a prop to the component
  }
]

// Creating the router instance
const router = createRouter({
  history: createWebHistory(), // Uses HTML5 history API for clean URLs
  routes // The routes defined above
})

// Exporting the router so it can be used in main.js
export default router
