<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
///// Uncomment the following lines if you want to use them as components in this file /////
// import Login from './components/Login.vue';
// import Poker from './components/Poker.vue';
// import Profile from './components/Profile.vue';
// import Reports from './components/Reports.vue';
//import Tables from './components/Tables.vue';

export default {
  name: 'App',
  components: {
    // Login,
    // Poker,
    // Profile,
    // Reports,
    //Tables
  }
}

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
@import url('https://fonts.googleapis.com/css?family=Pacifico&display=swap');

#app {
  font-family: Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
