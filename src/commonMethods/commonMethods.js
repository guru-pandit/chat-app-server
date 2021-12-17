const { ConnectionDetail, ChatMessage, Conversation, User, SessionData } = require("../models");
const { Op } = require("sequelize");
const logger = require("../utils/logger");

// Create new connetion details
async function createConnection(data) {
    return await ConnectionDetail.create(data);
}
// Update the connection by user id
async function updateConnectionByUserID(userid, data) {
    return await ConnectionDetail.update(data, {
        where: { UserID: userid }
    })
}
// Update the connection by socket id
async function updateConnectionBySocketID(socketid, data) {
    return await ConnectionDetail.update(data, {
        where: { SocketID: socketid }
    })
}
// Create new message
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
// Update the message by message id
async function updateMessageByMsgID(mid, msg) {
    return await ChatMessage.update(msg, { where: { id: mid } })
}
// Get user by primary key
async function getUserByPK(uid) {
    return await User.findByPk(uid);
}
// Get user by socket id
async function getUserBySocketId(sid) {
    let userid;
    await ConnectionDetail.findOne({ where: { SocketID: sid } }).then((result) => {
        // console.log("GetUserID-result:- ", JSON.stringify(result));
        userid = result.UserID;
    })
    return userid;
}
// Get socket id of user
async function getSocketIDOfUser(userid) {
    let socketid = ""
    await ConnectionDetail.findOne({ where: { UserID: userid } }).then((result) => {
        // console.log("GetSocketID-result:- ", JSON.stringify(result));
        socketid = result.SocketID;
    })
    return socketid;
}
// Create new conversation
async function createNewConversation(members) {
    return await Conversation.create({ Members: members });
}
// Get conversation on conversation by conversation id
async function getConversationById(cid) {
    return await Conversation.findOne({
        where: { id: cid },
        include: [
            {
                model: ChatMessage,
                where: {
                    [Op.or]: [{ IsDeleted: false }, { IsDeleted: null }]
                }
            }]
    });
}

// // Get users conversations 
// async function getAllConversationsOfUser() {
//     return await Conversation.findAll()
// }
// Get conversation by user id
async function getConversationByUId() {
    return await Conversation.findAll();
}
// Get conversations
async function getConversations() {
    return await Conversation.findAll();
}
// Get private chat by conversation id
async function getPrivateChatByConvId(cid) {
    return await ChatMessage.findAll({ where: { ConversationID: cid } });
}
// -----------------------------------------------------
// Saving token in the session data table
async function saveToken(token) {
    try {
        await SessionData.create({ Token: token });
    } catch (err) {
        logger.error("SaveToken:- " + err.message)
    }
}

module.exports = {
    createConnection,
    updateConnectionBySocketID,
    updateConnectionByUserID,
    createChatMessage,
    getSocketIDOfUser,
    updateMessageByMsgID,
    createNewConversation,
    getConversationById,
    getConversationByUId,
    getPrivateChatByConvId,
    getConversations,
    getUserBySocketId,
    getUserByPK,
    saveToken,
}