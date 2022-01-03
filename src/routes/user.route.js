const userController = require("../controllers").user;
const { checkName, checkPassword, checkPhone, checkEmail, checkDOB } = require("../middlewares/validate");
const { auth } = require("../middlewares/auth");
const { uploadImage } = require("../services/upload.service");

module.exports = (app) => {
    // Home
    app.get("/", auth, userController.home);
    // Get user by user id
    app.get("/user/:id", userController.getUserByID);
    // Register route
    app.post("/user/register", [checkName, checkPhone, checkPassword], userController.register);
    // Login route
    app.post("/user/login", [checkPhone, checkPassword], userController.login);
    // Logout route
    app.post("/user/logout", userController.logout);
    // get other users
    app.post("/user/get-other", userController.getOtherUsers);
    // upload profile image
    app.post("/user/profile/:id", uploadImage.single("avatar"), userController.uploadProfileImage);
    // update user profile
    app.put("/user/update-profile", [checkName, checkPhone, checkEmail, checkDOB], userController.updateUserProfile);
}