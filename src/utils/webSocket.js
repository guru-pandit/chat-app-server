const { updateConnectionBySocketID, createChatMessage, getSocketIDOfUser, updateMessage } = require("../commonMethods/commonMethods");

const connection = (client) => {
    console.log("ConnectedClientID:- ", client.id);

    // On disconnect
    client.on("disconnect", async () => {
        console.log("Disconnected...", client.id);
        let jsonBody = { IsConnected: false }
        await updateConnectionBySocketID(client.id, jsonBody).then((result) => {
            console.log("Disconnect-update:- ", result);
        }).catch((err) => {
            console.log("Disconnect-err:- ", err);
        });
    })

    // on message
    client.on("private message", async (msg) => {
        console.log("PrivateMessageFromSender:- ", msg);
        let sid = await getSocketIDOfUser(msg.ReceiverID);
        let messageToBeSave = {
            Body: msg.Body,
            SenderID: msg.SenderID,
            ReceiverID: msg.ReceiverID,
            MessageSentAt: msg.MessageSentAt
        }

        await createChatMessage(messageToBeSave).then((data) => {
            global.io.to(sid).emit("private message", data);
            console.log("CreateChatMessage-data:- ", JSON.stringify(data));
        }).catch((err) => {
            console.log("CreateChatMessage-err:- ", err);
        })
    })

    // Private message received
    client.on("private message received", async (msg) => {
        console.log("PrivateMessageReceived:- ", msg);
        let msgToBeUpdate = { MessageReceivedAt: msg.MessageReceivedAt, IsReceived: true }
        await updateMessage(msg.MsgID, msgToBeUpdate);
    })

}

module.exports = { connection }
