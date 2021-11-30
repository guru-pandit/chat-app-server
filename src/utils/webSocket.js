const { updateConnectionBySocketID, createChatMessage, getSocketIDOfUser } = require("../commonMethods/commonMethods");

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
    client.on("message", async (msg) => {
        console.log("MessageToBeSend:- ", msg);

        let messageToBeSave = {
            Body: msg.Body,
            SenderID: msg.SenderID,
            ReceiverID: msg.ReceiverID
        }

        await createChatMessage(messageToBeSave).then((data) => {
            global.io.to(msg.ReceiverSocketID).emit("message", data);
            console.log("CreateChatMessage-data:- ", JSON.stringify(data));
        }).catch((err) => {
            console.log("CreateChatMessage-err:- ", err);
        })
    })

}

module.exports = { connection }
