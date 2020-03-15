<template>
  <div id="app">
<<<<<<< HEAD
    <Header/>
    
    <Table/>
    <Table/>
    <Table/>
=======
    <router-view></router-view>
>>>>>>> master
  </div>
</template>

<script>
<<<<<<< HEAD
import Table from './components/Table.vue'
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Table,
    Header
  },

=======
///// Uncomment the following lines if you want to use them as components in this file /////
// import Login from './components/Login.vue';
// import Poker from './components/Poker.vue';
// import Profile from './components/Profile.vue';
// import Reports from './components/Reports.vue';
// import Tables from './components/Tables.vue';
export default {
  name: 'App',
  components: {
    // Login,
    // Poker,
    // Profile,
    // Reports,
    // Tables
  }
>>>>>>> master
}

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');

#app {
  font-family: Roboto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
