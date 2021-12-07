const userController = require("../controllers").user;
const { checkName, checkPassword, checkPhone } = require("../middlewares/validate")

module.exports = (app) => {
    app.get("/user/:id", userController.getUserByID);
    // Register route
    app.post("/user/register", [checkName, checkPhone, checkPassword], userController.register);
    // Login route
    app.post("/user/login", [checkPhone, checkPassword], userController.login);
    // get other users
    app.post("/user/get-other", userController.getOtherUsers);
}