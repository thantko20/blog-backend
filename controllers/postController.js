const { body, validationResult } = require('express-validator');
const Post = require('../models/postModel');

// GET get posts
exports.getPosts = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: 'desc' });

  res.json({ data: posts });
};

// GET get a single post
exports.getPost = async (req, res) => {
  const id = req.params.id;
  const post = await Post.findById(id);

  res.json({ data: post });
};

// POST create a single post
exports.createPost = [
  body('title')
    .notEmpty()
    .withMessage('Title must not be empty')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Title should have at least 2 characters')
    .escape(),
  body('body').notEmpty().withMessage('Blog content must not be empty'),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = {};
      errors.array().forEach((err) => (errorMessages[err.param] = err.msg));
      return res.status(400).json({ errors: errorMessages });
    }

    const newPost = new Post({
      title: req.body.title,
      body: req.body.body,
      author: req.userId,
      likes: [req.userId],
    });

    const post = await newPost.save();

    res.json({ postId: post._id });
  },
];

// POST like the post
exports.likePost = async (req, res) => {
  const postId = req.params.id;

  const post = await Post.findOne({ _id: postId, likes: req.userId });

  // if already liked, dislike and vice versa
  const arrayCommand = post ? '$pull' : '$push';

  const updatedPost = await Post.findByIdAndUpdate(postId, {
    [arrayCommand]: { likes: req.userId },
  });

  return res.json({ data: updatedPost });
};
