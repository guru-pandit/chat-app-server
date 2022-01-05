const conversationController = require("../controllers").conversation;

module.exports = (app) => {
    // create conversation
    app.post("/create-conversation", conversationController.createConversation);
    // get conversation
    app.get("/get-conversation/:id", conversationController.getConversation);
    // get conversation by user id
    app.get("/get-conversation-by-user/:id", conversationController.getConversationByUserId);
    // get all conversations of user
    app.get("/get-all-conversations/:id", conversationController.getConversationsOfUser);
    // get all friends
    app.get("/get-all-friends/:userID", conversationController.getAllFriends);
}