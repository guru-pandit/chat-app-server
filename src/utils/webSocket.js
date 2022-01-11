const logger = require("../utils/logger");
const { updateConnectionBySocketID, createChatMessage, getSocketIDOfUser, getUserBySocketId, getSocketIdsOfFriends } = require("../commonMethods/commonMethods");


const connection = (client) => {
    logger.info("ConnectedClientID:- " + client.id);

    // On disconnect
    client.on("disconnect", async () => {
        logger.warn("Disconnected:- " + client.id);
        let jsonBody = { IsConnected: false, DisconnectedAt: Date.now() }
        await updateConnectionBySocketID(client.id, jsonBody).then(async (result) => {
            console.log("Disconnect-update:- ", result);
            let userid = await getUserBySocketId(client.id);
            let sids = await getSocketIdsOfFriends(userid);
            console.log("Disconnect-sids:- ", sids);
            if (sids.length != 0) {
                sids.forEach(sid => {
                    global.io.to(sid).emit("user offline", { UserID: userid, IsConnected: false });
                });
            }

        }).catch((err) => {
            logger.error("Disconnect-error:- " + err.message);
        });
    })

    // on private message message
    client.on("private message", async (msg) => {
        // console.log("PrivateMessageFromSender:- ", msg);

        let rsid = await getSocketIDOfUser(msg.ReceiverID);
        let ssid = await getSocketIDOfUser(msg.SenderID);

        await createChatMessage(msg).then((res) => {
            global.io.to(rsid).emit("private message", res);
            global.io.to(ssid).emit("server received private message", { ConversationID: msg.ConversationID });
        })
    })
}

module.exports = { connection }
