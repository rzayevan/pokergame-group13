<template>
<!-- Table list div --> 
  <div class = "table-list">
    <UserNavbar class="navbar-section"/>
    <ul>
    <!-- Loop through tables and display --> 
    <li v-for="(tableIndex, tableNum) in tables" :key="tableIndex.id">
      <!-- Join room on click --> 
      <div class="table"  id = "table-click" v-on:click="joinRoom(table.id, tableNum)">
        <!-- Display table's buyin and blinds --> 
        <div class="table-description">
            <div class = "table-stakes">
                <p>{{tableIndex.table.buyIn}}</p> 
                <p>{{tableIndex.table.bigBlind}}</p>
            </div> 
            <div class = "chips-pic">
              <img alt="Chip picture" src="../images/chip.png">
            </div> 
        </div> 
        <!-- Display table's name and seat availability --> 
        <div class="table-details">
            <div class = "table-name">
                <p> {{tableIndex.table.tableName}}</p>
            </div>
            <div class = "seats" id = "seatsId">
            <!-- TODO: Update seat availability as seats fill up.--> 
                <p> {{tableIndex.table.numberOfTableSeats}}/{{tableIndex.table.numberOfTableSeats}}</p>
            </div>
        </div>
      </div>
    </li>
    </ul>
  </div>
</template>

<script>
import io from "socket.io-client";
import UserNavbar from "./navbars/UserNavbar";

export default {
  name: 'Tables',
  components: {
      UserNavbar
  },
  created() {
        this.socket = io("http://localhost:3000");
  },

  data() {
    return {
      socket: {},
      tables: [],
    };
  },

  mounted() {
    //Retrieve the current tables available and store into tables array 
      this.socket.on("serve-tables", rooms => {
          this.tables = rooms; 
          console.log('These are the tables');
          console.log(this.tables);

    })
  },
  
  methods: {
    //Function to handle room joining
    joinRoom: function (table, tableNum) {
      //To do: Replace alert with a navigation to the poker game page (Trello)
      alert("Joined Table " + (tableNum+1));
      this.socket.emit("'joinRoomRequest'",table);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

ul {
  overflow-x:hidden;
}

li {
  display: inline-block; 
}

.table {
    background: #348c44;
    border-radius: 25px 25px 5px 5px;
    border: 2px solid; 
    border-color: #595959;
    width: 15em;
    height: 10em;
    position: relative; 
    text-align: center;
    margin: 20px; 
}

.table-description {
    width: 100%;
    height: 50px;
    position: absolute; 
    bottom: 50%; 
}

.chips-pic{
    width: 50%;
    height: 50px;
    padding-left: 50px; 
}

.chips-pic img {
    max-width:100%;
    max-height:100%;
    float: left; 
    object-fit: cover;
    color: white; 
}
.table-stakes {
    width: 50%;
    height: 50px;
    float: right; 
}
.table-description p {
    padding: 0; 
    margin: auto; 
    text-align: left;
    font-weight: bolder;
    color: white; 
}

.table-details {
    background: white;
    border-radius: 0px 0px 5px 5px;
    border-top: 2px solid; 
    border-color: #595959;
    width: 100%;
    height: 50px;
    position: absolute; 
    bottom: 0; 
}

.table-details .table-name {
    position: relative; 
    height: 50px; 
    width: 50%;  
    text-align: center;
    float: left; 
    font-size: 1em; 
    font-weight: bold;
}

.table-details .table-name p {
    position: relative;
    top: 25%; 
}

.table-details .seats {
    position: relative; 
    height: 50px; 
    width: 30%;  
    text-align: center;
    float: right; 
    font-weight: bolder; 
}

.table-details .seats p {
   position: relative;
    top: 25%; 
}

</style>