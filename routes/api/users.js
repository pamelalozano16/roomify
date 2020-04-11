const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

//@desc Test route
router.post(
  "/", //Path es /
  [
    //El check de express validator checa la informacion
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  (req, res) => {
    //Pone los errors en un array
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //Si existen errors
      //Status 400 y manda los errors
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);

    res.send();
  }
);

module.exports = router;
