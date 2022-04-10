// нормализованная структура
// имитация БД
const users = { }
let coveredState = true
let taskNameState = '...'

module.exports = (io, socket) => {
    try {
      const getUsers = () => {
        io.in(socket.roomId).emit('players', users)
      }
  
      const getCovered = () => {
        io.in(socket.roomId).emit('covered', coveredState)
      }

      const getTaskName = () => {
        io.in(socket.roomId).emit('taskName', taskNameState )
      }
    
      // обрабатываем добавление пользователя
      // функция принимает объект с именем пользователя и его id
      const addUser = ({ userName, userId }) => {
        // проверяем, имеется ли пользователь в БД
        if (!users[userId]) {
          // если не имеется, добавляем его в БД
          users[userId] = { userName, userId, online: true }
        } else {
          // если имеется, меняем его статус на онлайн
          users[userId] = {userName, userId, online: true}
        }
        // выполняем запрос на получение пользователей
        getUsers()
      }
    
      // обрабатываем удаление пользователя
      const removeUser = (userId) => {
        if(users[userId]) {
          users[userId].online = false
        }
        getUsers()
      }
  
      const setVote = ({userId, value}) => {
        if(users[userId]) {
          users[userId].value = value
        }
        getUsers()
      }
  
      const setCovered = (covered) => {
        coveredState = covered
        getUsers()
        getCovered()
      }

      const setTaskName = (taskName) => {
        taskNameState = taskName
        console.log(taskName)
        getTaskName()
      }
  
      const removeVotes = () => {
       for(const key in users) {
         const user = users[key]
         user.value = ''
       }
       getUsers()
      }

      getAll = () => {
        getTaskName()
        getCovered()
        getUsers()
      }

      const kickPlayer = (id) => {
        if(users[id]) {
          users[id].online = false
        }
        getUsers()
      }

      const notificateAll = () => {
        io.in(socket.roomId).emit('notificate')
        console.log("notificate")
      }
    
      // регистрируем обработчики
      socket.on('get', getAll)
      socket.on('player:get', getUsers)
      socket.on('player:add', addUser)
      socket.on('player:leave', removeUser)
      socket.on('vote:set', setVote)
      socket.on('covered:set', setCovered)
      socket.on('covered:get', getCovered)
      socket.on('votes:remove', removeVotes)
      socket.on('taskName:get', getTaskName)
      socket.on('taskName:set', setTaskName)
      socket.on('player:kick', kickPlayer)
      socket.on('all:notification', notificateAll)
    } catch (error) {
      console.log(error)
    }
  }