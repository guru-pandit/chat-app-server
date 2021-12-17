const express = require('express');
const { createServer } = require('http');
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const webSocket = require("./src/utils/webSocket");
const logger = require("./src/utils/logger");
const morgan = require("morgan");

const app = express();
const httpServer = createServer(app);
const { Server } = require("socket.io");

global.__basedir = __dirname;

// Middlewares
app.use(cors({ origin: "*" }));
app.use(cookieParser());
app.use(express.json());
const publicDir = path.join(__basedir, "./public");
app.use(express.static(publicDir));

// Morgan Logger
app.use(morgan("dev"));

// Syncing the database
const db = require("./src/models");
db.sequelize.sync({ logging: false }).then((result) => logger.info("Succesfully connected to DB:- " + result.config.database)).catch((err) => logger.error(err.message))

// Importing routes
require("./src/routes")(app);

// Socket connection
global.io = new Server(httpServer, { cors: { origin: "*" } });
global.io.on("connection", webSocket.connection);

// Listening the server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    logger.info(`Server running on PORT: ${PORT}`);
});