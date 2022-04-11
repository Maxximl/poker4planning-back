// нормализованная структура
// имитация БД
const usersByRoomMap = {}
// const usersByRoomMap = {
//  roomId: {
      // userId: {
      //   userName: 'fdf'
      // }
// }
// }

module.exports.usersByRoomMap = usersByRoomMap

module.exports = (io, socket) => {
  
  const getDataInRoom = () => {
    const roomData = usersByRoomMap[roomId]
    const {playersArray, taskName, shown} = roomData || {}
  }

    try {
      const {roomId} = socket
      const roomData = usersByRoomMap[roomId]
      const {usersInRoom, taskName, shown} = roomData || {}


      const getRoomData = () => {
        const roomData = usersByRoomMap[roomId]
        const {usersInRoom, taskName, shown} = roomData || {}

        const playersArray = Object.values(usersInRoom || {}) || []
        io.in(socket.roomId).emit('roomData', {playersArray, taskName, shown})
      }
    

      const addUser = ({ userName, userId }) => {
        const roomData = usersByRoomMap[roomId]
        const {usersInRoom, taskName, shown} = roomData || {}

      if(usersInRoom) {
        if (!usersInRoom[userId]) {
          usersInRoom[userId] = { userName, userId, roomId, online: true }
        } else {
          usersInRoom[userId] = {...usersInRoom[userId], userName, userId, roomId, online: true}
        }
      } else {
        const usersInRoomNew = {}
        usersInRoomNew[userId] = { userName, userId, roomId, online: true }

        usersByRoomMap[roomId] = {usersInRoom: usersInRoomNew}   
      }

        getRoomData()
      }
    
      const removeUser = (userId) => {
        const roomData = usersByRoomMap[roomId]
        const {usersInRoom, taskName, shown} = roomData || {}

       if(usersInRoom) {
        if(usersInRoom[userId]) {
          usersInRoom[userId].online = false
        }
       }
       const onlineUsers = Object.values(usersInRoom)
       if(!onlineUsers.length) {
        delete  usersByRoomMap[roomId] 
       }
        getRoomData()
      }
  
      const setVote = ({userId, value}) => {
        const roomData = usersByRoomMap[roomId]
        const {usersInRoom, taskName, shown} = roomData || {}

        if(usersInRoom) {
          if(usersInRoom[userId]) {
            usersInRoom[userId].value = value
          }
          getRoomData()
        }
      }
  
      const setShownState = (shownState) => {
        const roomData = usersByRoomMap[roomId]
        const {usersInRoom, taskName, shown} = roomData || {}

        if(usersInRoom) {
          const usersArray = Object.values(usersInRoom)
          
          if(usersArray.every(user => user.value) || !shownState) {
            roomData.shown = shownState
          }
          getRoomData()
        }
      }

      const setTaskName = (newTtaskName) => {
        const roomData = usersByRoomMap[roomId]

        if(roomData) {
          roomData.taskName = newTtaskName

          getRoomData()
        }
      }
  
      const removeVotes = () => {
        const roomData = usersByRoomMap[roomId]
        const {usersInRoom, taskName, shown} = roomData || {}

      if(usersInRoom) {
        for(const key in usersInRoom) {
          const user = usersInRoom[key]
          user.value = ''
        }

        getRoomData()
      }
      }

      const kickPlayer = (id) => {
        const roomData = usersByRoomMap[roomId]
        const {usersInRoom, taskName, shown} = roomData || {}

        console.log("kick", id, usersInRoom)
        if(usersInRoom) {
          if(usersInRoom[id]) {
            usersInRoom[id].online = false
          }
        }

        getRoomData()
      }

      const notificateAll = () => {
        io.in(socket.roomId).emit('notificate')
      }
    
      // регистрируем обработчики
      socket.on('room:get', getRoomData)
      socket.on('player:add', addUser)
      socket.on('player:leave', removeUser)
      socket.on('vote:set', setVote)
      socket.on('covered:set', setShownState)
      socket.on('votes:remove', removeVotes)
      socket.on('taskName:set', setTaskName)
      socket.on('player:kick', kickPlayer)
      socket.on('all:notification', notificateAll)
    } catch (error) {
      console.log(error)
    }
  }

  // mock 
  // const users = {
  //   'dsfds6': {
  //     userName: 'fefwe', userId: 'xCYwD3ak', roomId: '13', online: true
  //   },
  //   'dsfds5': {
  //     userName: 'fefwe', userId: 'xCYwD3ak', roomId: '13', online: true
  //   },
  //   'dsfds4': {
  //     userName: 'fefwe', userId: 'xCYwD3ak', roomId: '13', online: true
  //   },
  //   'dsfds3': {
  //     userName: 'fefwe', userId: 'xCYwD3ak', roomId: '13', online: true
  //   },
  //   'dsfds2': {
  //     userName: 'fefwe', userId: 'xCYwD3ak', roomId: '13', online: true
  //   },
  //   'dsfds1': {
  //     userName: 'fefwe', userId: 'xCYwD3ak', roomId: '13', online: true
  //   },
  //   'dsfds132': {
  //     userName: 'fefwe', userId: 'xCYwD3ak', roomId: '13', online: true
  //   },
  //   'dsfds13232': {
  //     userName: 'fefwe', userId: 'xCYwD3ak', roomId: '13', online: true
  //   },
  // }