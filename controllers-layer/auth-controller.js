const express = require("express");
const authLogic = require("../business-logic-layer/auth-logic");
const errorsHelper = require("../helpers/errors-helper");
const svgCaptcha = require("svg-captcha");
const cryptoHelper = require("../helpers/crypto-helper");
//const verifyCaptcha = require("../middleware/verify-captcha");
const router = express.Router();

// define root route
router.get("/captcha", (request, response) => {
    const captcha = svgCaptcha.create(); // Creates a new CAPTCHA image + text
    const image = captcha.data;
    const text = captcha.text;
    const hashedText = cryptoHelper.hash(text);
    response.cookie("text", hashedText); // cookie רק בגלל שאנו רוצים לקבל בחזרה את הטקסט - שלחנו אותו ע"י
    response.type("svg").send(image);
});

router.post("/register", async (request, response) => {
    try {
        const addedUser = await authLogic.registerAsync(request.body);
        response.status(201).json(addedUser);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

router.post("/login", async (request, response) => {
    try {
        const loggedInUser = await authLogic.loginAsync(request.body);
        if (!loggedInUser) return response.status(401).send("Incorrect username or password.");
        response.json(loggedInUser);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

module.exports = router;