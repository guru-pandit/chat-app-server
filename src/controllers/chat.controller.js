const { ChatMessage } = require("../models");
const { Op } = require("sequelize");
const { createChatMessage } = require("../commonMethods/commonMethods");

// Function to add messages
exports.addMessage = async (req, res) => {
    console.log("AddMessage-req.body:- ", req.body);
}

// Function to get the private chats
exports.getPrivateChat = async (req, res) => {
    console.log("GetPrivateChat-req.body:- ", req.body);
    ChatMessage.findAll({
        where: {
            SenderId: { [Op.or]: [req.body.id1, req.body.id2] },
            ReceiverId: { [Op.or]: [req.body.id1, req.body.id2] }
        },
        attributes: ["id", "Body", "SenderID", "ReceiverID", "IsReceived", "IsDeleted", "MessageSentAt", "MessageReceivedAt"],
        order: [['createdAt', 'ASC']]
    }).then((data) => {
        console.log("GetPrivateChat-data:- ", JSON.stringify(data));
        res.send(data);
    }).catch((err) => {
        console.log("GetPrivateChat-err:- ", err);
        res.status(500).send({ error: err.message || "Something went wrong" });
    });
}