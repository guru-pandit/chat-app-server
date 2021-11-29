const connectionController = require("../controllers").connection;

module.exports = (app) => {
    // Set connection
    app.post("/set-connection", connectionController.setConnection);
}