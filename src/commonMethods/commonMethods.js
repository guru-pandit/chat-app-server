const { Op } = require("sequelize");

const { ConnectionDetail, ChatMessage, Conversation, User, SessionData } = require("../models");
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
    let userid = 0;
    await ConnectionDetail.findOne({ where: { SocketID: sid } }).then((result) => {
        // console.log("GetUserID-result:- ", JSON.stringify(result));
        if (result) {
            userid = result.UserID;
        } else {
            return userid;
        }
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
async function getConversationByUId(uid) {
    let convs = []
    return await Conversation.findAll({
        include: [
            {
                model: ChatMessage,
                limit: 1,
                where: {
                    [Op.or]: [{ IsDeleted: false }, { IsDeleted: null }]
                },
                order: [['MessageSentAt', 'DESC']]
            }
        ]
    }).then((response) => {
        return response;
    }).catch((err) => {
        logger.error("GetConversationByUId-error:- " + err.message);
    });
}
// Get conversations
async function getConversations() {
    return await Conversation.findAll();
}
// Get conversations
async function getFriendsIDsOfUser(uid) {
    let friendsIds = [];
    return await Conversation.findAll().then((response) => {
        if (response.length != 0) {

            response.forEach((conv) => {
                if (conv.Members.includes(uid.toString())) {
                    let fid = conv.Members.find((f) => f != uid)
                    friendsIds.push(fid);
                }
            })

            return friendsIds;
        } else {
            return friendsIds;
        }
    })
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

// ------------------------------------------------------
// Get socket ids of friends which are conneted/online
// Returns array
async function getSocketIdsOfFriends(uid) {
    let sids = [];
    let fids = await getIdsOfFriends(uid);
    if (fids.length != 0) {
        return await ConnectionDetail.findAll({
            where: {
                UserID: { [Op.in]: fids },
                IsConnected: true
            }
        }).then((response) => {
            response.forEach((s) => {
                sids.push(s.SocketID);
            })
            return sids;
        }).catch((err) => {
            console.log("GetSocketIdsOfFriends-err:- ", JSON.stringify(err.message));
        });
    } else {
        return sids;
    }
}
// Get ids of friends
// Returns array
async function getIdsOfFriends(uid) {
    let ids = []
    return Conversation.findAll({
        where: {
            [Op.or]: [{ IsDeleted: false }, { IsDeleted: null }]
        },
        attributes: ["id", "Members"]
    }).then((response) => {
        response.forEach((conv) => {
            if (conv.Members.includes(uid.toString())) {
                let fid = conv.Members.filter(m => m != uid)[0]
                ids.push(parseInt(fid));
            }
        })
        return ids;
    }).catch((err) => {
        console.log("GetIdsOfFriends-err:- ", JSON.stringify(err.message));
    });
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
    getFriendsIDsOfUser,
    getSocketIdsOfFriends
}