const { updateConnectionBySocketID, createChatMessage, getSocketIDOfUser, getUserBySocketId } = require("../commonMethods/commonMethods");

const connection = (client) => {
    console.log("ConnectedClientID:- ", client.id);

    // On disconnect
    client.on("disconnect", async () => {
        console.log("Disconnected...", client.id);
        let jsonBody = { IsConnected: false, DisconnectedAt: Date.now() }
        await updateConnectionBySocketID(client.id, jsonBody).then(async (result) => {
            console.log("Disconnect-update:- ", result);
            // let userid = await getUserBySocketId(client.id);
            // global.io.emit("user disconnected", { UserID: userid });
        }).catch((err) => {
            console.log("Disconnect-err:- ", err);
        });
    })

    // on private message message
    client.on("private message", async (msg) => {
        console.log("PrivateMessageFromSender:- ", msg);

        let rsid = await getSocketIDOfUser(msg.ReceiverID);
        let ssid = await getSocketIDOfUser(msg.SenderID);

        await createChatMessage(msg).then((res) => {
            global.io.to(rsid).emit("private message", res);
            global.io.to(ssid).emit("server received private message", { ConversationID: msg.ConversationID });
        })
    })
}

module.exports = { connection }
