const conversationController = require("../controllers").conversation;

module.exports = (app) => {
    // create conversation
    app.post("/create-conversation", conversationController.createConversation);
    // get conversation
    app.get("/get-conversation/:id", conversationController.getConversation);
}