<template>
  <div id="app">
    <UtilityNav />
    <SpotsGame />
  </div>
</template>

<script>
import SpotsGame from './components/SpotsGame.vue';
import UtilityNav from './components/UtilityNav.vue';

export default {
  name: 'App',
  components: {
    SpotsGame,
    UtilityNav
  }
}
</script>

<style>
body {
  margin: 0;
  font-size: 100%;
}
h1 {
  font-size: 2rem;
}
h1 {
  font-size: 1.5rem;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
button {
  margin: 10px 4px;
  padding: 6px 10px;
  font-size: 15px;
  border: none;
  border-radius: 3px;
  background: #ddd;
}
button:hover {
  background: #d5e2f1;
  cursor: pointer;
}
button:focus {
  background: #d5e2f1;
}
</style>
