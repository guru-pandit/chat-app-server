const chatController = require("../controllers").chat

module.exports = (app) => {
    app.post("/private-chat", chatController.getPrivateChat);
}