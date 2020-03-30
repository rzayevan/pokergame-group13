<template>
  <div class="hello">
    <Tables v-bind:tables="tables" v-bind:socket="socket"/>
  </div>
</template>

<script>
  import io from "socket.io-client"

  import Tables from '../components/Tables.vue';

  export default {
    name: 'HelloWorld',
    components: {
    Tables
    },
    data() {
      return {
        socket: {},
        tables: []
      }
    },
    // gets called before the view is rendered
    created() {
      this.socket = io("http://localhost:3000"); // connect to our server
    },

    // gets called after the view is rendered
    mounted() {
      this.socket.on("connected", data => {
        console.log("client received a message: " + data);
      });
      //Retrieve the current tables available
      this.socket.on("serve-tables", rooms => {
          this.tables = Object.values(rooms); 
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
