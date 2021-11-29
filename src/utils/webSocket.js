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
        console.log("Message:- ", msg);
        let socketid = await getSocketIDOfUser(msg.receiverID);
        await createChatMessage(msg).then((data) => {
            global.io.to(socketid).emit("message", data);
            console.log("CreateChatMessage-data:- ", JSON.stringify(data));
        }).catch((err) => {
            console.log("CreateChatMessage-err:- ", err);
        })
    })

}

module.exports = { connection }
