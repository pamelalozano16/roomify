const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");

//@route POST api/posts
//@desc Create a post
//@access Private

router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const user = await User.findOne({ _id: req.user.id }).select("-password");
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route GET api/posts
//@desc Get all posts
//@access Private

router.get("/", auth, async (req, res) => {
  try {
    //Sort a most recent first
    const posts = await Post.find({}).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route GET api/posts/:post_id
//@desc Get one posts
//@access Private

router.get("/:post_id", auth, async (req, res) => {
  try {
    //Sort a most recent first
    const post = await Post.findOne({ _id: req.params.post_id });
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.name === "CastError") {
      return res.status(400).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

//@route DELETE api/posts/:post_id
//@desc Delete posts
//@access Private

router.delete("/:post_id", auth, async (req, res) => {
  try {
    //Sort a most recent first
    const post = await Post.findOne({ _id: req.params.post_id });

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    //Check user
    if (post.user.toString() != req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();
    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    if (err.name === "CastError") {
      return res.status(400).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

//@route PUT api/posts/like/:post_id
//@desc Like a post
//@access Private
router.put("/like/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    //check if post is already liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    //adds user to likes
    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.name === "CastError") {
      return res.status(400).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

//@route PUT api/posts/unlike/:post_id
//@desc Delete like
//@access Private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    //Buscas el user
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    //check if post is liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not been liked" });
    }
    //Remove index va a ser la posicion donde esta rl likr
    //Que queremos borrar esto lo que hace es buscar el item.id que sea
    //Igual a like
    const removeIndex = post.likes
      .map((item) => item.user.toString())
      .indexOf(req.user.id);
    //Borra el like del array
    post.likes.splice(removeIndex, 1);
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

//@route POST api/posts/comment/:post_id
//@desc Comment on a post
//@access Private

router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const user = await User.findOne({ _id: req.user.id }).select("-password");
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route DELETE api/posts/comment/:post_id/:comment_id
//@desc Delete comment
//@access Private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    //Buscas el user
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    //Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    //Check user is the one that made comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const removeIndex = post.comments
      .map((item) => item.user.toString())
      .indexOf(req.user.id);
    //Borra el like del array
    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
