const chatController = require("../controllers").chat

module.exports = (app) => {
    // add messages
    app.post("/chat/add-message", chatController.addMessage);
    // get private chat
    app.get("/chat/private-chat/:conversationID", chatController.getPrivateChat);
    // get private chat
    app.put("/chat/private-chat/:messageID", chatController.updateMessage);
}