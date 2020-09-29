const express = require("express");
const router = express.Router();
const config = require("config");
const auth = require("../../middleware/auth");
const axios = require('axios');
const SpotifyWebApi = require('spotify-web-api-node');



  // credentials are optional
  var spotifyApi = new SpotifyWebApi({
    clientId: config.get("spotifyClientId"),
    clientSecret: config.get("spotifyClientSecret"),
    //http://www.example.com/callback'
});

//@route GET api/spotify/getMe
//@desc LOGIN with spotify
//@access Public
router.get('/getMe', async(req, res) => {
    spotifyApi.setAccessToken(req.query.token);
    try {
        let response  = await spotifyApi.getMe();
        res.send(response.body)
    } catch (error) {
        console.log('Something went wrong!', error);
    }
});




module.exports = router;
