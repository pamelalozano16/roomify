const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

//@desc Test route
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

module.exports = router;
