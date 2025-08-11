// Import the 'createApp' function from Vue to initialize the application
import { createApp } from 'vue'

// Import the root component of the application
import App from './App.vue'

// Import Bootstrap CSS for styling
import 'bootstrap/dist/css/bootstrap.min.css'

// Import the function to create Pinia store (state management)
import { createPinia } from 'pinia'

// Import the router instance for page navigation
import router from './router'

// Create a new Vue application instance using the root component
const app = createApp(App)

// Install the Pinia store plugin into the app
app.use(createPinia())

// Install the router plugin into the app
app.use(router)

// Mount the app to the DOM element with the ID 'app'
app.mount('#app')

