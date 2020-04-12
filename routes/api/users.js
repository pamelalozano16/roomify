const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

//@route POST api/users
//@desc REGISTER and authenticate user & get token
//@access Public

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
  async (req, res) => {
    //Pone los errors en un array
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //Si existen errors
      //Status 400 y manda los errors
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      //See if user exists
      let user = await User.findOne({ email });
      if (user) {
        //Estamos agregando el error al array para que todos sean
        //El mismo tipo de errores
        return res
          .status(400)
          .json({ errors: [{ msg: " User already exists" }] });
      }

      //Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "mm", //Default es mm como default icons
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      //Encrypt password

      //El salt son como los rounds de hashing que se
      //van a usar y 10 es lo recomendado en la doc
      const salt = await bcrypt.genSalt(10);

      //Guardas el hash del password
      user.password = await bcrypt.hash(password, salt);

      //Guardas el user
      await user.save();

      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id, //Object id del user
        },
      };
      /*
      Estamos haciendo una token donde la info que
      contiene es el userID q es el payload 
      para saber cual es el que ingresó, 
      en config guardamos el secretword,
      y el expiresIn hace que la moneda no sea
      valida todo el tiempo.
      Luego regresamos el token para que
      cuando se registre el usuario inicie sesion
      */
      jwt.sign(
        payload,
        config.get("jwtToken"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      // console.error(err.message);
      res.status(400).send("Server error");
    }
  }
);

module.exports = router;
