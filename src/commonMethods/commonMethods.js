const { ConnectionDetail, ChatMessage, Conversation } = require("../models");

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

async function createChatMessage(msg) {
    return await ChatMessage.create({
        Body: msg.Body,
        SenderID: msg.SenderID,
        ReceiverID: msg.ReceiverID,
        MessageSentAt: msg.MessageSentAt,
        IsDeleted: false,
    })
}

async function updateMessage(mid, msg) {
    return await ChatMessage.update(msg, {
        where: { id: mid }
    })
}

async function getSocketIDOfUser(userid) {
    let socketid = ""
    await ConnectionDetail.findOne({ where: { UserID: userid } }).then((result) => {
        console.log("GetSocketID-result:- ", JSON.stringify(result));
        socketid = result.SocketID;
    })
    return socketid;
}

async function createNewConversation(members) {
    return await Conversation.create({ Members: members });
}

async function getConversationById(cid) {
    return await Conversation.findOne({ where: { id: cid } });
}

module.exports = {
    createConnection,
    updateConnectionBySocketID,
    updateConnectionByUserID,
    createChatMessage,
    getSocketIDOfUser,
    updateMessage,
    createNewConversation,
    getConversationById
}