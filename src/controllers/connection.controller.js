const { Op } = require("sequelize");

const logger = require("../utils/logger");
const { createConnection, updateConnectionByUserID } = require('./../commonMethods/commonMethods');
const { ConnectionDetail } = require("../models");

// Function to save socket details in DB
exports.setConnection = async (req, res) => {
    console.log("SetConnection-Req.body", req.body);

    // Check user exist or not
    let isUserExist = await ConnectionDetail.findOne({ where: { UserID: req.body.UserID } });
    console.log("IsUserExist", JSON.stringify(isUserExist));

    // If user connection data not exist then create new 
    // Else update data of existing user (SocketID, IsConnected)
    if (isUserExist === null) {
        let jsonBody = { UserID: req.body.UserID, SocketID: req.body.SocketID, IsConnected: true }

        await createConnection(jsonBody).then((data) => {
            console.log("ConnectionCreate:- ", JSON.stringify(data));
            return res.send({ message: "Device connected..." });
        }).catch((err) => {
            logger.error("ConnectionCreate-error:- " + err.message);
            return res.status(400).send({ error: "Device connection failed..." });
        });
    } else {
        let jsonBody = { SocketID: req.body.SocketID, IsConnected: true }
        await updateConnectionByUserID(req.body.UserID, jsonBody).then((data) => {
            console.log("ConnectionUpdate:- ", JSON.stringify(data));
            return res.send({ message: "Device connected..." });
        }).catch((err) => {
            logger.error("ConnectionUpdate-error:- " + err.message);
            return res.status(400).send({ error: "Device connection failed..." });
        });
    }
}