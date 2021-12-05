const { Conversation } = require("../models");
const { Op } = require("sequelize");
const { createNewConversation, getConversationById } = require("../commonMethods/commonMethods");


// Creating new conversation
exports.createConversation = async (req, res) => {
    console.log("CreateConversation-req.body:- ", req.body);
    let members = [req.body.id1, req.body.id2]

    if (req.body.id1 != "" && req.body.id2 != "" && req.body.id1 != req.body.id2) {
        await createNewConversation(members).then((response) => {
            // console.log("CreateConversation-res", JSON.stringify(response));
            res.send(response)
        }).catch((err) => {
            res.status(500).send({ error: err.message || "Something went wrong" });
        });
    } else {
        res.status(400).send({ error: "Please enter sender and receiver ids" });
    }
}

// getting conversation
exports.getConversation = async (req, res) => {
    console.log("GetConversation-req.params:- ", req.params);
    await getConversationById(req.params.id).then((response) => {
        // console.log("GetConversation-res", JSON.stringify(response));
        if (response != null) {
            res.send(response)
        } else {
            res.status(400).send({ error: "No conversation found..." });
        }
    }).catch((err) => {
        res.status(500).send({ error: err.message || "Something went wrong" });
    });
}