const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 4200;

const router = require("./router");
const app = express();
const server = http.createServer(app);
const {usersByRoomMap} = require('./handlers/userHandlers')

const userBySoketMap = {}

const io = socketio(server, {
    cors: {
        origin: '*'
      }
});
const registerUserHandlers = require('./handlers/userHandlers.js') 


io.on("connection", (socket) => {
try {
    
    const {roomId} = socket.handshake.query
    userBySoketMap[socket.id] = roomId
    socket.roomId = roomId
   
    socket.join(roomId)
  
    registerUserHandlers(io, socket)
  
    socket.on('disconnect', () => {
        const roomId = userBySoketMap[socket.id]
        if(roomId) {
            socket.leave(roomId)
        }
    })
} catch (error) {
    console.log(error)
}
})

app.use(router);

server.listen(PORT, () => console.log("Sever started...."));