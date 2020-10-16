<template>
  <div id="app">
    <SpotsGame />
  </div>
</template>

<script>
import SpotsGame from './components/SpotsGame.vue'

export default {
  name: 'App',
  components: {
    SpotsGame
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 25px;
}
button {
  margin: 10px 4px;
  padding: 6px 10px;
  font-size: 15px;
  border: none;
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
