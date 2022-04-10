const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 5000;

const router = require("./router");
const app = express();
const server = http.createServer(app);


const io = socketio(server, {
    cors: {
        origin: '*'
      }
});
const registerUserHandlers = require('./handlers/userHandlers.js') 


io.on("connection", (socket) => {
try {
    console.log("User connected: ", socket.id)

    const {roomId, userId} = socket.handshake.query
    socket.roomId = roomId
    console.log(roomId)
  
    socket.join(roomId)
  
    registerUserHandlers(io, socket)
  
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id)
        
        socket.leave(roomId)
    })
} catch (error) {
    console.log(error)
}
})

app.use(router);

server.listen(PORT, () => console.log("Sever started...."));