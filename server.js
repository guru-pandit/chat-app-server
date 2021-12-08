const express = require('express');
const { createServer } = require('http');
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const webSocket = require("./src/utils/webSocket");
require("dotenv").config();

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

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

// Syncing the database
const db = require("./src/models");
db.sequelize.sync({
    logging: false
});

// Importing routes
require("./src/routes")(app);

// Socket connection
global.io = new Server(httpServer, { cors: { origin: "*" } });
global.io.on("connection", webSocket.connection);

// Listening the server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Server running on PORT:${PORT}`);
});