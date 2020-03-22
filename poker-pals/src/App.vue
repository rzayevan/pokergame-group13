<template>
  <div id="app">
    <router-view></router-view>
     <ReportGrid :data="gridData" :columns="gridColumns" />
  </div>
</template>

<script>
///// Uncomment the following lines if you want to use them as components in this file /////
// import Login from './components/Login.vue';
// import Poker from './components/Poker.vue';
// import Profile from './components/Profile.vue';
// import Reports from './components/Reports.vue';
//import Tables from './components/Tables.vue';
import ReportGrid from './components/ReportGrid.vue'

export default {
  name: 'App',
  components: {
    // Login,
    // Poker,
    // Profile,
    // Reports,
    //Tables
    ReportGrid
  },
  data() {
    return {
     gridData: [
          { 
            "id": 0, 
            "Offending User": "JohnSun333", 
            "Submitted": "2/27/2020", 
            "Offense": "Harassment", 
            "Reported By": "Kimchee553", 
            "Description": "This user threatened to DOX another player for winning the pot. They put the last 4 digits of the victim’s phone number in the chat and proceeded to send threats during the game.",
            chatLogs: [
              {
                username: "JohnSun333",
                message: "I have your phone number"
              },
              {
                username: "SadBoyLyfe3",
                message: "No you dont"
              },
              {
                username: "JohnSun333",
                message: "The last 4 numbers are 1337"
              },
              {
                username: "JohnSun333",
                message: "you sure>"
              },
              {
                username: "SadBoyLyfe3",
                message: "stop or i will get you banned"
              },
              {
                username: "JohnSun333",
                message: "No u. uwu"
              },
            ]
          },
          { "id": 1, "Offending User": "Ligma420", "Submitted": "2/27/2020", "Offense": "Racism", "Reported By": "KingSimp"},
          { "id": 2, "Offending User": "PoppingJimbo", "Submitted": "2/27/2020", "Offense": "Swearing", "Reported By": "WeebKing123"},
          { "id": 3, "Offending User": "EatMyPeen", "Submitted": "2/27/2020", "Offense": "Offensive Username", "Reported By": "SonChaeyoungie"},
          { "id": 4, "Offending User": "xXPokerKillerXx", "Submitted": "2/27/2020", "Offense": "Harassment", "Reported By": "PotentPeter"},
          { "id": 5, "Offending User": "Kirito", "Submitted": "2/27/2020", "Offense": "Spamming", "Reported By": "StonkMillionaire"},
        ],
        gridColumns: ["Offending User", "Submitted", "Offense", "Reported By"], 
    }
  }
}

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');

#app {
  font-family: Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
