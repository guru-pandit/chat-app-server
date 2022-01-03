const { body } = require("express-validator");

module.exports = {
    checkName: body("Name")
        .trim()
        .notEmpty()
        .withMessage("Name is required..."),

    checkEmail: body("Email")
        .trim()
        .isEmail()
        .withMessage("Please enter valid email")
        .normalizeEmail()
        .toLowerCase(),

    checkPhone: body("Phone")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
        .withMessage("Please enter valid phone number"),

    checkPassword: body("Password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,12}$/)
        .withMessage("Password must have 8 to 12 characters, with combination of uppercase, lowercase special character and 1 number"),

    checkDOB: body("DOB").trim(),
}