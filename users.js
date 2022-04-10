const users = [];

const addUser = ({ id, name, room }) => {
    //
    name = name.trim();
    room = room.trim();

    const existingUser = users.find(user => user.room === room && user.name === name);

    if (existingUser) {
        return { error: "Username is taken" };
    }

    const user = { id, name, room, money: 1000 };

    users.push(user);

    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    return users.find(user => user.id === id);
}

const getUsersInRoom = (room) => {
    return users.filter(user => user.room === room);
}

const updateUser = ({ fromUserId: name, toUserId, room, money }) => {
    //
    const fromUser = users.find(user => user.room === room && user.name === name);
    const toUser = users.find(user => user.room === room && user.id === toUserId);

    if (toUserId === "bankId") {
        fromUser.money -= money;
    }

    if (!fromUser || !toUser) {
        return { error: "Username is gone" };
    }



    if (fromUser === toUser) {
        fromUser.money += money;
    } else {
        fromUser.money -= money;
        toUser.money += money;
    }


}

module.exports = { addUser, removeUser, getUser, getUsersInRoom, updateUser }