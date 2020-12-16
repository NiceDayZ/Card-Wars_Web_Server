const router = require("express").Router();

const { authController } = require("../controllers");

router.put("/login", authController.login);
router.put("/register", authController.register);

module.exports = router;