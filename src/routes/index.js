module.exports = (app) => {
    require("./user.route")(app);
    require("./connection.route")(app);
    require("./chat.route")(app);
    require("./conversation.route")(app);
}