<template>
<!-- Table list div --> 
  <div class = "table-list">
    <UserNavbar :socket=socket :userData=userData :hideLogOut=false class="navbar-section"/>
    <DailyBonusModal :dailyBonusAmount=dailyBonusAmount />
    <ul>
    <!-- Loop through tables and display --> 
    <li v-for="room in rooms" :key="room.roomID">
      <!-- Join room on click --> 
      <div class="table" id = "table-click" v-if="room.numberOfFullSeats !== room.numberOfTableSeats" v-on:click="joinRoom(room)">
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
                <p> {{room.numberOfFullSeats}}/{{room.numberOfTableSeats}}</p>
            </div>
        </div>
      </div>
      <!-- Display full table --> 
        <!-- Join room on click --> 
      <div class="table-full" id = "table-click" v-else v-on:click="joinRoom(room)">
        <!-- Display table's buyin and blinds --> 
        <div class="table-description-full">
            <p>FULL</p> 
        </div> 
        <!-- Display table's name and seat availability --> 
        <div class="table-details-full">
            <div class = "table-name">
                <p> {{room.tableName}}</p>
            </div>
            <div class = "seats" id = "seatsId">
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
import DailyBonusModal from "./DailyBonusModal";

export default {
    name: 'Tables',
    components: {
        UserNavbar,
        DailyBonusModal
    },
    props: ['authenticated', 'socket', 'userData'],
    data() {
        return {
            rooms: [],
            dailyBonusAmount: 0
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

            // Open the daily bonus modal
            this.socket.on("dailyBonus", dailyBonusObject => {
                this.dailyBonusAmount = dailyBonusObject.dailyBonus;
                this.$bvModal.show("daily-bonus-modal");
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

            // After use has dismissed the daily bonus modal, update the userData object with the new chips value
            this.socket.on('updateUserChips', (newChips) => {                
                this.userData.chips += newChips;
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
        },
        addDailyBonus: function() {
            this.socket.emit("addDailyBonus", this.userData.id);
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
  cursor: pointer;
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


.table-full {
    background: #666666ff;
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

.table-description-full {
    width: 100%;
    height: 50px;
    position: absolute; 
    bottom: 50%; 
}

.table-description-full p {
    position: relative; 
    text-align: center;
    font-size: 2em; 
    font-weight: bold;
    color: white; 
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


.table-details-full {
    background: white;
    border-radius: 0px 0px 5px 5px;
    border-top: 2px solid; 
    border-color: #595959;
    width: 100%;
    height: 50px;
    position: absolute; 
    bottom: 0; 
}

.table-details-full .table-name {
    position: relative; 
    height: 50px; 
    width: 50%;  
    text-align: center;
    float: left; 
    font-size: 1em; 
    font-weight: bold;
    color: #999999;
}

.table-details-full .table-name p {
    position: relative;
    top: 25%; 
}

.table-details-full .seats {
    position: relative; 
    height: 50px; 
    width: 30%;  
    text-align: center;
    float: right; 
    font-weight: bolder; 
    color: #999999;
}

.table-details-full .seats p {
   position: relative;
    top: 25%; 
}

</style>