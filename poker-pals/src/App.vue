<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
///// Uncomment the following lines if you want to use them as components in this file /////
// import Login from './components/Login.vue';
//import Poker from './components/Poker.vue';
// import Profile from './components/Profile.vue';
// import Reports from './components/Reports.vue';
//import Tables from './components/Tables.vue';
//import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'App',
  components: {
    // Login,
    // Poker,
    // Profile,
    // Reports,
    // Tables,
    // HelloWorld
  }
}

</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Pacifico&display=swap');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
  @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
  html, body, #app {
    width: 100%;
    height: 100%;
    margin-left: 0;
  }

  #app {
    font-family: Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .navbar-section {
    margin-bottom: 20px;
  }

</style>
