const { ChatMessage } = require("../models");
const { Op } = require("sequelize");
const { createChatMessage, getPrivateChatByConvId, updateMessageByMsgID, getSocketIDOfUser } = require("../commonMethods/commonMethods");

// Function to add messages
exports.addMessage = async (req, res) => {
    console.log("AddMessage-req.body:- ", req.body);
    createChatMessage(req.body).then((response) => {
        console.log("AddMessages-res:- ", response);
        return res.send(response);
    }).catch((err) => {
        console.log("AddMessages-err:- ", err);
        return res.status(500).send({ error: err.message || "Something went wrong" });
    })
}

// Function to get the private chats
exports.getPrivateChat = async (req, res) => {
    console.log("GetPrivateChat-req.params:- ", req.params);
    getPrivateChatByConvId(req.params.conversationID).then((response) => {
        // console.log("GetPrivateChat-res:- ", JSON.stringify(response));
        if (response.length != 0) {
            return res.send(response);
        } else {
            return res.status(400).send({ error: "No chat found...." });
        }
    }).catch((err) => {
        console.log("GetPrivateChat-err:- ", err);
        return res.status(500).send({ error: err.message || "Something went wrong" });
    })
}

// Function to update msg
exports.updateMessage = async (req, res) => {
    console.log("UpdateMessage-req.body:- ", req.body);
    // console.log("UpdateMessage-req.params:- ", req.params);
    updateMessageByMsgID(req.params.messageID, { MessageReceivedAt: req.body.MessageReceivedAt, IsReceived: req.body.IsReceived, IsRead: req.body.IsRead }).then(async (response) => {
        // console.log("UpdateMessage-res", response);

        let sid = await getSocketIDOfUser(req.body.SenderID);
        // console.log("UpdateMessage-sid:- ", sid);
        global.io.to(sid).emit("receiver received private message", { ConversationID: req.body.ConversationID });

        return res.send({ message: "Message updated" });
    }).catch((err) => {
        console.log("UpdateMessage-err:- ", err);
        return res.status(500).send({ error: err.message || "Something went wrong" });
    })
}