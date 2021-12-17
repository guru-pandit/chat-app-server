const jwt = require("jsonwebtoken");

const { User, SessionData } = require("../models");
const logger = require("../utils/logger");

async function auth(req, res, next) {
    let { authtoken } = req.headers;
    console.log("AuthMiddleware:- ", authtoken);

    if (authtoken == null || authtoken == undefined || authtoken == "") {
        res.status(400).send({ error: "No token found please login..." })
    } else {
        await SessionData.findOne({ where: { Token: authtoken } }).then(async (result) => {
            if (result != null) {
                jwt.verify(result.Token, process.env.JWT_SECRET_KEY, (error, decoded) => {
                    if (error) throw error;
                    User.findOne({ where: { id: decoded.id } }).then((data) => {
                        req.user = data
                        next();
                    })
                })
            } else {
                res.status(400).send({ error: "No token found..." })
            }
        }).catch((err) => {
            logger.error(err.message)
            res.status(500).send({ error: err.message || "Something went wrong" })
        })
    }

}

// Check JWT
async function checkJWT(req, res, next) {
    let { authtoken } = req.headers;
    console.log("CheckJWTMiddleware:- ", authtoken);

    if (authtoken) {
        SessionData.findOne({ where: { Token: authtoken } }).then(async (result) => {
            if (result != null) {
                jwt.verify(result.Token, process.env.JWT_SECRET_KEY, (error, decoded) => {
                    if (error) throw error;
                    User.findOne({ where: { id: decoded.id } }).then((data) => {
                        console.log("CheckJWT-user:- ", JSON.stringify(data));

                        let imgUrl = `${req.protocol}://${req.headers.host}/uploads/avatars/${data.id}/`
                        let dummyImg = `${req.protocol}://${req.headers.host}/uploads/images/avatar.png`

                        let user = {
                            id: data.id, Name: data.Name, Phone: data.Phone, authToken: authtoken,
                            Avatar: data.Avatar != null ? imgUrl + data.Avatar : dummyImg,
                        }
                        res.send(user);
                    })
                })
            } else {
                next();
            }
        }).catch((err) => {
            logger.error(err.message);
            res.status(500).send({ error: err.message || "Something went wrong" });
        });
    } else {
        next();
    }

}

module.exports = {
    auth,
    checkJWT
}