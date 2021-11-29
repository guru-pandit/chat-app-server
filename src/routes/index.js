module.exports = (app) => {
    require("./user.route")(app);
    require("./connection.route")(app);
}