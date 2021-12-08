const { ConnectionDetail, ChatMessage, Conversation, User } = require("../models");
const { Op } = require("sequelize");

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
        ConversationID: msg.ConversationID,
        MessageSentAt: msg.MessageSentAt,
        IsDeleted: false,
        IsRead: false,
        IsSaved: true
    })
}

async function updateMessage(mid, msg) {
    return await ChatMessage.update(msg, { where: { id: mid } })
}

async function getUserByPK(uid) {
    return await User.findByPk(uid);
}

async function getUserBySocketId(sid) {
    let userid;
    await ConnectionDetail.findOne({ where: { SocketID: sid } }).then((result) => {
        // console.log("GetUserID-result:- ", JSON.stringify(result));
        userid = result.UserID;
    })
    return userid;
}

async function getSocketIDOfUser(userid) {
    let socketid = ""
    await ConnectionDetail.findOne({ where: { UserID: userid } }).then((result) => {
        // console.log("GetSocketID-result:- ", JSON.stringify(result));
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

async function getConversationByUId() {
    return await Conversation.findAll();
}

async function getConversations() {
    return await Conversation.findAll();
}

async function getPrivateChatByConvId(cid) {
    return await ChatMessage.findAll({ where: { ConversationID: cid } });
}

module.exports = {
    createConnection,
    updateConnectionBySocketID,
    updateConnectionByUserID,
    createChatMessage,
    getSocketIDOfUser,
    updateMessage,
    createNewConversation,
    getConversationById,
    getConversationByUId,
    getPrivateChatByConvId,
    getConversations,
    getUserBySocketId,
    getUserByPK
}