// нормализованная структура
// имитация БД
const usersByRoomMap = {}

module.exports.usersByRoomMap = usersByRoomMap

module.exports = (io, socket) => {
  

    try {
      const {roomId} = socket

      const getRoomUsers = () => {
        const users = usersByRoomMap[roomId]
        return users
      }

      const getUsers = () => {
        const users = usersByRoomMap[roomId]

        const userArray = Object.values(users || {}) || []
        io.in(socket.roomId).emit('players', userArray)
      }
    

      const addUser = ({ userName, userId }) => {
        const users = usersByRoomMap[roomId]
      if(users) {
        if (!users[userId]) {
          users[userId] = { userName, userId, roomId, online: true }
        } else {
          users[userId] = {userName, userId, roomId, online: true}
        }
      } else {
        const usersInRoom = {}
        usersInRoom[userId] = { userName, userId, roomId, online: true }

        usersByRoomMap[roomId] = usersInRoom   
      }

        getUsers()
      }
    
      const removeUser = (userId) => {
        const usersInRoom = getRoomUsers()

       if(usersInRoom) {
        if(usersInRoom[userId]) {
          usersInRoom[userId].online = false
        }
       }
        getUsers()
      }
  
      const setVote = ({userId, value}) => {
        const usersInRoom = getRoomUsers()

        if(usersInRoom) {
          if(usersInRoom[userId]) {
            usersInRoom[userId].value = value
          }
          getUsers()
        }
      }
  
      const setShownState = (shown) => {
        const usersInRoom = getRoomUsers()
        if(usersInRoom) {
          const usersArray = Object.values(usersInRoom)
          
          if(usersArray.every(user => user.value) || !shown) {
            for(const userId in usersInRoom) {
              const user = usersInRoom[userId]
              user.coveredState = shown
            }
          }
          getUsers()
        }
      }

      const setTaskName = (taskName) => {
        const usersInRoom = usersByRoomMap[roomId]
        
        if(usersInRoom) {
          for(const userId in usersInRoom) {
            const user = usersInRoom[userId]
            user.taskName = taskName
          }

          getUsers()
        }
      }
  
      const removeVotes = () => {
        const users = usersByRoomMap[roomId]

      if(users) {
        for(const key in users) {
          const user = users[key]
          user.value = ''
        }
        getUsers()
      }
      }

      const kickPlayer = (id) => {
        const usersInRoom = getRoomUsers()
        console.log("kick", id, usersInRoom)
        if(usersInRoom) {
          if(usersInRoom[id]) {
            usersInRoom[id].online = false
          }
        }
        getUsers()
      }

      const notificateAll = () => {
        io.in(socket.roomId).emit('notificate')
      }
    
      // регистрируем обработчики
      socket.on('player:get', getUsers)
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