const userController = require("../controllers").user;
const { checkName, checkPassword, checkPhone } = require("../middlewares/validate");
const { auth, checkJWT } = require("../middlewares/auth");
const { uploadImage } = require("../services/upload.service");

module.exports = (app) => {
    app.get("/", auth, (req, res) => console.log("Homepage"))
    // Get user by user id
    app.get("/user/:id", userController.getUserByID);
    // Register route
    app.post("/user/register", [checkName, checkPhone, checkPassword], userController.register);
    // Login route
    app.post("/user/login", checkJWT, [checkPhone, checkPassword], userController.login);
    // Logout route
    app.post("/user/logout", userController.logout);
    // get other users
    app.post("/user/get-other", userController.getOtherUsers);
    // get other users
    app.post("/user/profile/:id", uploadImage.single("avatar"), userController.uploadProfileImage);
}