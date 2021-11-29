const express = require('express');
const { createServer } = require('http');
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const webSocket = require("./src/utils/webSocket");

const app = express();
const httpServer = createServer(app);
const { Server } = require("socket.io");

// Middlewares
app.use(cors({ origin: "*" }));
app.use(cookieParser());
app.use(express.json());

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