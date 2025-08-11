# Pokémon Web App

A responsive Pokémon web application built using **Vue 3**, **JavaScript**, **Bootstrap 5.3.x**, **Pinia**, and **Vue Router**.  
This app allows users to browse Pokémon, search by name, and view detailed information using dynamic routing.

---

## 🚀 Features
- View a list of Pokémon fetched from the [PokéAPI](https://pokeapi.co/)
- Search for Pokémon by name
- Responsive layout using **Bootstrap 5.3.x**
- Dynamic detail page for each Pokémon
- State management with **Pinia**
- Client-side routing with **Vue Router**

---

## 📂 Project Structure
src/
├── assets/ # Images, icons, and static files
├── components/ # Reusable Vue components
├── store/ # Pinia store files
├── views/ # Main page views (Home.vue, PokemonDetail.vue)
├── router/ # Application routing (index.js)
├── App.vue # Root Vue component
└── main.js # App entry point


---

## 🛠️ Technologies Used
- [Vue 3](https://vuejs.org/)
- [Bootstrap 5.3.x](https://getbootstrap.com/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [PokéAPI](https://pokeapi.co/)


---

## 📦 Installation & Local Setup

Follow these steps to run the app locally:

### 1️⃣ Clone the repository

git clone https://github.com/DhivaHari098/pokemon-vue-app.git

2️⃣ Navigate into the project folder

cd pokemon-vue-app

3️⃣ Install dependencies
Make sure you have Node.js (v16+) and npm installed, then run:

npm install

4️⃣ Start the development server

npm run dev

5️⃣ Open the app
Once the server is running, open the link shown in your terminal (e.g.):

http://localhost:5173/

🔧 Build for Production
To build the app for production:

npm run build
The compiled files will be in the dist/ folder.

📝 Usage
On the home page, browse through the list of Pokémon.

Use the search bar to find a specific Pokémon.

Click on a Pokémon to view its details (name, type, image, and stats).

👨‍💻 Author
Dhivaakar Harisankara Rao