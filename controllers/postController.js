const { body, validationResult } = require('express-validator');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const {
  Types: { ObjectId },
} = require('mongoose');

// GET get posts
exports.getPosts = async (req, res) => {
  const { fieldName = 'createdAt', sortOrder = -1 } = req.query;

  // Used Aggregation pipeline to
  // utilize length of likes
  const posts = await Post.aggregate()
    .addFields({
      likesCount: { $size: '$likes' },
    })
    .sort({ [fieldName]: parseInt(sortOrder) });

  const authorPopulatedPosts = await User.populate(posts, {
    path: 'author',
    select: 'firstName lastName _id',
  });

  res.json({ data: authorPopulatedPosts });
};

// GET get a single post
exports.getPost = async (req, res) => {
  const id = req.params.id;
  const post = await Post.findById(id).populate('author', [
    'firstName',
    'lastName',
    'fullname',
  ]);

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
  body('content').notEmpty().withMessage('Blog content must not be empty'),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = {};
      errors.array().forEach((err) => (errorMessages[err.param] = err.msg));
      return res
        .status(400)
        .json({ message: 'Validation failed. Please try again.' });
    }

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
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

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      [arrayCommand]: { likes: req.userId },
    },
    { returnDocument: 'after' },
  ).populate('author', ['firstName', 'lastName', 'fullname']);

  return res.json({ data: updatedPost });
};

exports.deletePost = async (req, res) => {
  const postId = req.params.id;

  const post = await Post.findById(postId).populate('author', [
    'firstName',
    'lastName',
  ]);

  if (!post) {
    return res.status(400).json({ message: 'Post does not exist.' });
  }

  if (String(post.author._id) !== req.userId) {
    return res
      .status(401)
      .json({ message: 'You are not authorized to perform this action.' });
  }

  await Post.findByIdAndDelete(postId);
  res.json({ message: 'Post removed.' });
};

exports.editPost = [
  body('title')
    .notEmpty()
    .withMessage('Title must not be empty')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Title should have at least 2 characters')
    .escape(),
  body('content').notEmpty().withMessage('Blog content must not be empty'),
  async (req, res) => {
    const postId = req.params.id;
    const authorId = req.query.authorId;

    if (authorId !== req.userId) {
      return res
        .status(400)
        .json({ message: 'You are not authorized to perform this action.' });
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = {};
      errors.array().forEach((err) => (errorMessages[err.param] = err.msg));
      return res
        .status(400)
        .json({ message: 'Validation failed. Please try again.' });
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
        },
      },
      {
        returnDocument: 'after',
      },
    );

    res.json({ postId });
  },
];
