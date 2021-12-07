const { User, ConnectionDetail } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { getSocketIDOfUser } = require("../commonMethods/commonMethods");
const { validationResult } = require("express-validator");

// Funtion to register the user
exports.register = async (req, res) => {
    console.log("Register-Req.body:- ", req.body);

    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }

    // Checking user is already registered or not
    let isUserExist = await User.findOne({ where: { Phone: req.body.Phone, [Op.or]: [{ IsDeleted: false }, { IsDeleted: null }], } })
    console.log("IsUserExist:- ", JSON.stringify(isUserExist));
    let user = {
        Name: req.body.Name,
        Phone: req.body.Phone
    };
    user.Password = await bcrypt.hashSync(req.body.Password, 8);

    // Creating the user in DB
    console.log('Register-user :-' + JSON.stringify(user));
    if (isUserExist == null) {
        await User.create(user)
            .then(data => {
                console.log('User data create:' + JSON.stringify(data));
                return res.send({ data });
            }).catch(err => {
                console.log('User data create-err:' + err);
                return res.status(500).send({ error: err.message || "Something Went wrong" });
            });
    } else {
        return res.status(400).send({ error: "Phone number already exist" });
    }
}

// Funtion to Login the user
exports.login = async (req, res) => {
    console.log("Login-Req.body:- ", req.body);
    console.log("Login-Req.cookies:- ", req.cookies);

    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ error: errors.array()[0].msg });
    }

    await User.findOne({
        where: {
            Phone: req.body.Phone,
            [Op.or]: [{ IsDeleted: false }, { IsDeleted: null }],
        }
    }).then((data) => {
        console.log("Login-data:- ", JSON.stringify(data));

        if (data != null) {
            let isPasswordMatch = bcrypt.compareSync(req.body.Password, data.Password);
            console.log("Login-isPasswordMatch:-", isPasswordMatch);
            if (isPasswordMatch) {
                let token = jwt.sign({ id: data.id }, process.env.JWT_SECRET_KEY);
                // console.log("Auth-token:- ", token);

                let user = {
                    id: data.id,
                    Name: data.Name,
                    Phone: data.Phone,
                    authToken: token
                }

                return res.send(user);
            } else {
                return res.status(400).send({ error: "Password not matching..." })
            }
        } else {
            return res.status(400).send({ error: "User not found....Please register" });
        }
    }).catch((err) => {
        console.log("Login-err:- ", err);
        return res.status(500).send({ error: err.message || "Something went wrong" })
    })
}

// Get user details from their ID
exports.getUserByID = async (req, res) => {
    console.log("GetUserByID-req.params:- ", req.params);
    await User.findOne({
        where: {
            id: req.params.id,
            [Op.or]: [{ IsDeleted: false }, { IsDeleted: null }],
        },
        attributes: ["id", "Name", "Phone"],
        include: { model: ConnectionDetail }
    }).then(async (result) => {
        console.log("GetUserByID-result:- ", JSON.stringify(result));
        if (result != null) {
            // let responseBody = {
            //     id: result.id,
            //     Name: result.Name,
            //     Phone: result.Phone
            // }
            return res.send(result);

        } else {
            return res.status(400).send({ error: "No user found..." });
        }
    }).catch((err) => {
        return res.status(500).send({ error: err.message || "Something went wrong" });
    });
}

// Function to get other users
exports.getOtherUsers = async (req, res) => {
    console.log("GetOtherUsers-req.body:- ", req.body);

    if (req.body.search != "") {
        User.findAll({
            where: {
                id: { [Op.notIn]: [req.body.userId] },
                [Op.or]: [
                    { Name: { [Op.like]: "%" + req.body.search + "%" } },
                    { Phone: { [Op.like]: "%" + req.body.search + "%" } }
                ]
            }
        }).then((response) => {
            return res.send(response);
        }).catch((err) => {
            return res.status(500).send({ error: err.message || "Something went wrong" });
        })
    } else {
        return res.send([]);
    }
}