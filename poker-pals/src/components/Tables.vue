<template>
<!-- Table list div --> 
  <div class = "table-list">
    <UserNavbar :userData=userData class="navbar-section"/>
    <ul>
    <!-- Loop through tables and display --> 
    <li v-for="room in rooms" :key="room.roomID">
      <!-- Join room on click --> 
      <div class="table" id = "table-click" v-on:click="joinRoom(room)">
        <!-- Display table's buyin and blinds --> 
        <div class="table-description">
            <div class = "table-stakes">
                <p>{{room.buyIn}}</p> 
                <p>{{room.bigBlind}}</p>
            </div> 
            <div class = "chips-pic">
              <img alt="Chip picture" :src="require('../images/ImageFiles').getImage('chip').src">
            </div> 
        </div> 
        <!-- Display table's name and seat availability --> 
        <div class="table-details">
            <div class = "table-name">
                <p> {{room.tableName}}</p>
            </div>
            <div class = "seats" id = "seatsId">
            <!-- TODO: Update seat availability as seats fill up.--> 
                <p> {{room.numberOfFullSeats}}/{{room.numberOfTableSeats}}</p>
            </div>
        </div>
      </div>
    </li>
    </ul>
  </div>
</template>

<script>
import UserNavbar from "./navbars/UserNavbar";

export default {
    name: 'Tables',
    components: {
        UserNavbar
    },
    props: ['authenticated', 'socket', 'userData'],
    data() {
        return {
            rooms: [],
        };
    },
    mounted() {
        if(!this.authenticated){
            this.$router.replace({ name: "Login" }); // send client back to login page
        }
        else {
            // when navigating to this component several times we need to clear the listeners
            this.socket.removeListener("receiveRoomList");
            this.socket.removeListener("dailyBonus");
            this.socket.removeListener("acountChips");
            this.socket.removeListener('joinRoom');

            this.socket.emit('serveRoomList'); // send request for the list of rooms

            //Receive the current rooms available and store into rooms array 
            this.socket.on("receiveRoomList", rooms => {
                this.rooms = rooms;
            });

            this.socket.on("dailyBonus", dailyBonusObject => {
                console.log('thanks for logging in, your bonus for today is: ' + dailyBonusObject.dailyBonus);
                // TODO: update navbar's chip count
                // first update with account chips, then upon popup exit, update with dailybonus added
                /*  daily bonus object is of the format
                    dailyBonusObject = {
                        accountChips: user.chips,
                        dailyBonus: UserUtils.getDailyBonusValue(),
                    }
                */
            });

            this.socket.on("acountChips", chips => {
                // TODO: update navbar's chip count
                console.log('your chips: ' + chips);
            });

            this.socket.on('joinRoom', msg => { // each player upon joining a room will receive the id of the seat they are to sit at
                this.$router.replace({ name: 'Poker', params: {
                    authenticated: true,
                    socket: this.socket,
                    userData: this.userData,
                    roomID: msg.roomID,
                    seatID: msg.seatID,
                    tableName: msg.tableName,
                    bigBlind: msg.bigBlind,
                }});
            });

            this.socket.on('cannotJoinRoom', response => {
                alert('cannot join room, reason: ' + response.reason);
            });
        }
    },
    methods: {
        //Function to handle room joining
        joinRoom: function (room) {
            this.socket.emit("joinRoomRequest", { // we send our assigned user id
                userID: this.userData.id,
                roomID: room.roomID, // the room the player wants to join
            });
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