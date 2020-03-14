<template>
  <div id="app">
    <Header/>
    
    <Table/>
    <Table/>
    <Table/>
  </div>
</template>

<script>
import Table from './components/Table.vue'
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Table,
    Header
  },

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
