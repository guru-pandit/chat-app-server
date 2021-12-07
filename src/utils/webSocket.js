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

    // on private message message
    client.on("private message", async (msg) => {
        console.log("PrivateMessageFromSender:- ", msg);
        let sid = await getSocketIDOfUser(msg.ReceiverID);
        console.log("SID:- ", sid)
        await createChatMessage(msg).then((res) => {
            global.io.to(sid).emit("private message", res);
        })
    })
}

module.exports = { connection }
