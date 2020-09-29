const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const axios = require('axios');
const qs = require('qs');
var SpotifyWebApi = require('spotify-web-api-node');


  const clientId= config.get("spotifyClientId");
  const clientSecret= config.get("spotifyClientSecret");


//@route GET api/auth
//@desc Verifies and returns user
//@access Public

router.get("/", auth, async (req, res) => {
  try {
    //Regresa el user del id del token con toda la info menos el password

    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (e) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route POST api/auth
//@desc LOGIN Authenticate user & get token
//@access Public

router.post(
  "/",
  [
    //El check de express validator checa la informacion
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    //Pone los errors en un array
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //Si existen errors
      //Status 400 y manda los errors
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      //See if user exists
      let user = await User.findOne({ email });
      //Si no existe
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: " Invalid Credentials" }] });
      }

      //Check if email and password matches
      const isMatch = await bcrypt.compare(password, user.password);
      //Si no es match
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id, //Object id del user
        },
      };

      jwt.sign(
        payload,
        config.get("jwtToken"),
        { expiresIn: 560000 },
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

//@route GET api/auth/spotify
//@desc LOGIN with spotify
//@access Public
router.get('/spotifySuccess', async(req, res) => {

  var data = qs.stringify({
   'grant_type': 'authorization_code',
   'code': req.query.code,
   'redirect_uri': 'http://localhost:3000/login' 
  });

  var config = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: { 
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64') , 
      'Content-Type': 'application/x-www-form-urlencoded', 
    },
    data : data
  };

  try {
    let response = await axios(config);
    res.send(response.data);
  } catch (error) {
    console.log(error.response.data);
    res.status(500).send(error.response.data.error_description);
  }

});


module.exports = router;
