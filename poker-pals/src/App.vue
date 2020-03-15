<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
     <ReportGrid :data="gridData" :columns="gridColumns" />
    <HelloWorld msg="Welcome to Your Vue.js App"/>
   
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import ReportGrid from './components/ReportGrid.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    ReportGrid
  },
  data() {
    return {
     gridData: [
          { "Offending User": "JohnSun333", "Submitted": "2/27/2020", "Offense": "Harassment", "Reported By": "Kimchee553"},
          { "Offending User": "Ligma420", "Submitted": "2/27/2020", "Offense": "Racism", "Reported By": "KingSimp"},
          { "Offending User": "PoppingJimbo", "Submitted": "2/27/2020", "Offense": "Swearing", "Reported By": "WeebKing123"},
          { "Offending User": "EatMyPeen", "Submitted": "2/27/2020", "Offense": "Offensive Username", "Reported By": "SonChaeyoungie"},
          { "Offending User": "xXPokerKillerXx", "Submitted": "2/27/2020", "Offense": "Harassment", "Reported By": "PotentPeter"},
          { "Offending User": "Kirito", "Submitted": "2/27/2020", "Offense": "Spamming", "Reported By": "StonkMillionaire"},
        ],
        gridColumns: ["Offending User", "Submitted", "Offense", "Reported By"], 
    }
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
  margin-top: 60px;
}
</style>
