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
//@desc Returns profile and saves auth token
//@access Private
router.get('/getMe', async(req, res) => {
    spotifyApi.setAccessToken(req.query.token);
    try {
        let response  = await spotifyApi.getMe();
        res.send(response.body)
    } catch (error) {
        console.log('Something went wrong!', error);
    }
});

//@route GET api/spotify/playing
//@desc Get Information About The User's Current Playback State
//@access Private
router.get('/playing', async(req, res) => {
    try {
        let response  = await spotifyApi.getMyCurrentPlaybackState();
        res.send(response.body)
    } catch (error) {
        console.log('Something went wrong!', error);
    }
    
});



module.exports = router;
