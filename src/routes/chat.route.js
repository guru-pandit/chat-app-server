const chatController = require("../controllers").chat

module.exports = (app) => {
    app.post("/chat/private-chat", chatController.getPrivateChat);
}