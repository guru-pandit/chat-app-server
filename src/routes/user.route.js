const userController = require("../controllers").user

module.exports = (app) => {
    app.get("/user/:id", userController.getUserByID);
    // Register route
    app.post("/user/register", userController.register);
    // Login route
    app.post("/user/login", userController.login);
}