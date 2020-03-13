let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

// app.use(express.static(__dirname + '/public'));

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html')
// });


http.listen(3000, () => {
    console.log('Listening on port *: 3000');
});

io.on('connection', (socket) => {
    socket.emit("connected", "Hello from server");
    console.log("test");          
});