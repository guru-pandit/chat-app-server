const { ConnectionDetail } = require("../models");

async function createConnection(data) {
    return await ConnectionDetail.create(data);
}

async function updateConnectionByUserID(userid, data) {
    return await ConnectionDetail.update(data, {
        where: { UserID: userid }
    })
}

async function updateConnectionBySocketID(socketid, data) {
    return await ConnectionDetail.update(data, {
        where: { SocketID: socketid }
    })
}

module.exports = {
    createConnection,
    updateConnectionBySocketID,
    updateConnectionByUserID
}