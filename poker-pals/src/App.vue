<template>
  <div id="app">
    <router-view></router-view>
     <Reports :data="gridData" :columns="gridColumns" />
  </div>
</template>

<script>
///// Uncomment the following lines if you want to use them as components in this file /////
// import Login from './components/Login.vue';
// import Poker from './components/Poker.vue';
// import Profile from './components/Profile.vue';
import Reports from './components/Reports.vue';
//import Tables from './components/Tables.vue';
import io from "socket.io-client";

export default {
  name: 'App',
  components: {
    // Login,
    // Poker,
    // Profile,
     Reports,
    //Tables
    //ReportGrid
  },
  data() {
    // Retrieve reports from text file
    this.getReports();
    return {    
      // Initial data that is sent to the Reports component
      gridData: [],
      gridColumns: ["Offending User", "Submitted", "Offense", "Reported By"], 
    }
  },
  beforeCreate() {
    this.socket = io("http://localhost:3000");
    this.socket.on("connected", data => {
        console.log("client received a message: " + data);
    });

    this.socket.on('receive reports', data => {
      this.gridData = data.reports;
      this.columns = data.gridColumns;
    });
  },
  methods: {
    getReports: function() {
      this.socket.emit('request reports');
    }
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
</style>
