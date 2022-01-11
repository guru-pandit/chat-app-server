const { Op } = require("sequelize");
const _ = require("lodash");

const logger = require("../utils/logger");
const { Conversation, ChatMessage, User, ConnectionDetail } = require("../models");
const { createNewConversation, getConversationById, getConversationByUId, getConversations, getPrivateChatByConvId, getFriendsIDsOfUser } = require("../commonMethods/commonMethods");


// Creating new conversation
exports.createConversation = async (req, res) => {
    console.log("CreateConversation-req.body:- ", req.body);

    let members = [req.body.id1, req.body.id2]

    if (req.body.id1 == "" || req.body.id2 == "" || req.body.id1 == req.body.id2) {
        return res.status(400).send({ error: "Please enter sender and receiver ids" })
    } else {
        getConversations().then((response) => {
            // console.log("Conversations:-", JSON.stringify(response));

            if (response.length != 0) {
                let conversation;
                response.forEach((conv) => {
                    if (conv.Members.includes(req.body.id1.toString()) && conv.Members.includes(req.body.id2.toString())) {
                        conversation = conv;
                    }
                })
                // console.log("conversation:- ", conversation);
                if (conversation != undefined) {
                    return res.send(conversation);
                } else {
                    createNewConversation(members).then((response) => {
                        // console.log("CreateConversation-res", JSON.stringify(response));
                        return res.send(response);
                    }).catch((err) => {
                        logger.error("CreateConversation-error:- " + err.message);
                        return res.status(500).send({ error: err.message || "Something went wrong" });
                    });
                }
            } else {
                createNewConversation(members).then((response) => {
                    // console.log("CreateConversation-res", JSON.stringify(response));
                    return res.send(response);
                }).catch((err) => {
                    logger.error("CreateConversation-error:- " + err.message);
                    return res.status(500).send({ error: err.message || "Something went wrong" });
                });
            }
        })
    }
}

// getting conversation
exports.getConversation = async (req, res) => {
    console.log("GetConversation-req.params:- ", req.params);
    await getConversationById(req.params.id).then((response) => {
        // console.log("GetConversation-res", JSON.stringify(response));
        if (response != null) {
            return res.send(response)
        } else {
            return res.status(400).send({ error: "No conversation found..." });
        }
    }).catch((err) => {
        logger.error("GetConversation-error:- " + err.message);
        return res.status(500).send({ error: err.message || "Something went wrong" });
    });
}

// Get conversation by user id
exports.getConversationByUserId = async (req, res) => {
    console.log("GetConversation-req.params:- ", req.params);
    await getConversations().then((response) => {
        // console.log("GetConversation-res", response);
        if (response.length != 0) {
            let convArray = []

            response.forEach((conv) => {
                if (conv.Members.includes(req.params.id.toString())) {
                    convArray.push(conv)
                }
            })
            return res.send(convArray)
        } else {
            return res.status(400).send({ error: "No conversation found..." });
        }
    }).catch((err) => {
        logger.error("GetConversation-error:- " + err.message);
        return res.status(500).send({ error: err.message || "Something went wrong" });
    });
}

// Get all convesation details of user
exports.getConversationsOfUser = async (req, res) => {
    console.log("GetConversationsOfUser-req.paramas:- ", req.params);
    await getConversations().then(async (result) => {
        let convArray = getConvArray(result, req.params.id);
        if (convArray.length != 0) {
            let lm = await getLastMessages(convArray);
            let lastMsgArray = _.orderBy(lm, ["MessageSentAt"], ["desc"]);

            let convs = [];
            await Promise.all(
                lastMsgArray.map(async (msg) => {
                    await getConversationById(msg.ConversationID).then((result) => {
                        convs.push(result)
                    }).catch((err) => {
                        logger.error("GetConversationsOfUser-error:- " + err.message);
                        return res.status(500).send({ error: err.message || "Something went wrong" });
                    });
                })
            )
            res.send(convs);
        } else {
            return res.status(400).send({ error: "No conversation found" });
        }
    }).catch((err) => {
        logger.error("GetConversationsOfUser-error:- " + err.message);
        return res.status(500).send({ error: err.message || "Something went wrong" });
    });
}

function getConvArray(data, uid) {
    let convArray = [];
    if (data.length != 0) {
        data.map((conv) => {
            if (conv.Members.includes(uid)) {
                convArray.push(conv.id);
            }
        })
        return convArray;
    } else {
        return convArray;
    }
}

async function getLastMessages(convArr) {
    let lastMsgArray = [];
    await Promise.all(
        convArr.map(async (cid) => {
            await ChatMessage.findAll({
                limit: 1,
                where: { ConversationID: cid, [Op.or]: [{ IsDeleted: false }, { IsDeleted: null }] },
                order: [['MessageSentAt', 'DESC']]
            }).then((result) => {
                lastMsgArray.push(result[0]);
            }).catch((err) => {
                logger.error("GetLastMessages-error:- " + err.message);
            });
        }))
    return lastMsgArray
}

// get all friends
exports.getAllFriends = async (req, res) => {
    console.log("GetAllFriends-req.body:- ", req.params);
    try {
        let friendsIds = await getFriendsIDsOfUser(req.params.userID);

        let dummyImg = `${req.protocol}://${req.headers.host}/uploads/images/avatar.png`

        User.findAll({
            where: {
                id: { [Op.in]: friendsIds }
            },
            include: { model: ConnectionDetail },
            attributes: ["id", "Name", "Phone", "Email", "Avatar", "DOB"]
        }).then(async (response) => {
            let jsonRes = []
            await Promise.all(response.map(async (f) => {
                let imgUrl = `${req.protocol}://${req.headers.host}/uploads/avatars/${f.id}/`;

                let friend = {
                    id: f.id,
                    Name: f.Name,
                    Phone: f.Phone,
                    Email: f.Email,
                    Avatar: f.Avatar != null ? imgUrl + f.Avatar : dummyImg,
                    DOB: f.DOB,
                    IsConnected: f.ConnectionDetail.IsConnected,
                    DisconnectedAt: f.ConnectionDetail.DisconnectedAt,
                    ConnectionDetail: f.ConnectionDetail,
                    ConversationID: null,
                    ConversationMembers: null,
                    LastMessage: null
                }

                let lastConv = await getLastMessageOfUsers(req.params.userID, friend.id);
                console.log("GetAllFriends-lastConv:- ", JSON.stringify(lastConv));
                friend.ConversationID = lastConv[0].id;
                friend.ConversationMembers = lastConv[0].Members;
                friend.LastMessage = lastConv[0].ChatMessages;
                jsonRes.push(friend);
            }))

            return res.send(jsonRes);
        }).catch((err) => {
            logger.error("GetAllFriends-error:- " + err.message);
            return res.status(500).send({ error: err.message || "Something went wrong" });
        });
    } catch (err) {
        logger.error("GetAllFriends-error:- " + err.message);
        return res.status(500).send({ error: err.message || "Something went wrong" });
    }
}
// function to get the last messages between the users
async function getLastMessageOfUsers(uid, fid) {
    console.log("getLastMessageOfUsers:- uid: " + uid + " fid: " + fid)
    try {
        let allConvs = await getConversationByUId(uid);
        let convs = [];
        if (allConvs.length != 0) {
            allConvs.forEach((c) => {
                if (c.Members.includes(uid.toString()) && c.Members.includes(fid.toString())) {
                    convs.push(c)
                }
            })
            return convs;
        } else {
            return convs;
        }
    } catch (err) {
        logger.error("GetLastMessageOfUsers-error:- " + err.message);
    }
}