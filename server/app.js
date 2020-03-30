let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let User = require("./model/User.js");
const { v4: uuidv4 } = require('uuid');

const DataAccessLayer = require('./controllers/DataAccessLayer.js')

let rooms = {};

http.listen(3000, () => {
    let users = DataAccessLayer.ReadUsersFile();
    console.log('Listening on port *: 3000');
    console.log("Creating Tables");


    //Create set number of tables on server startup

    for (let x = 1; x <= 10; x++) {
        //Create x number of rooms 
        const room = {
            id: uuidv4(),
            name: "Table " + x,
            buyin: 20000,
            blinds: "1000 / 2000",
            sockets: []
        }
        rooms[room.id] = room;
    }

    console.log(rooms);

});

io.on('connection', (socket) => {
    console.log("Client connected.");
    console.log(rooms)
    socket.emit("connected", "Hello from server");
    socket.emit("serve-tables", rooms);

    socket.on('add-new-user', function(msg) {
        let splitUserString = msg.split(';');
        let newUser = new User();
        newUser.CreateNewUser(splitUserString[0], splitUserString[1], splitUserString[2]);
        DataAccessLayer.AddUserToFile(newUser);
    });

    socket.on('join-room', (roomId, callback) => {
        const room = rooms[roomId];
        joinRoom(socket, room);
    });

    socket.on('update-tables', (roomId, callback) => {
        console.log("_________________________________");
        console.log(rooms);
    });
});

const joinRoom = (socket, room) => {
    room.sockets.push(socket);
    socket.join(room.id, () => {
        socket.roomId = room.id;
        console.log(socket.id, "Joined", room.id);

    });
};