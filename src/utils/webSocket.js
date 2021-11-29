const { updateConnectionBySocketID } = require("../commonMethods/commonMethods");

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
    client.on("message", (msg) => {
        global.io.emit("message", msg);
        console.log("Message:- ", msg);
    })

}

module.exports = { connection }
