const Comment = require('../models/commentModel');
const { body, validationResult } = require('express-validator');

exports.getComments = async (req, res) => {
  const postId = req.query.postId;

  const comments = await Comment.find({ postId }).sort({ likes: -1 });

  res.json({ data: comments });
};

exports.addComment = [
  body('body').notEmpty().withMessage('Comment should not be empty').trim(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = {};
      errors.array().forEach((err) => {
        errorMessages[err.param] = err.msg;
      });
      return res.status(400).json({ errors: errorMessages });
    }

    const postId = req.query.postId;

    const newComment = new Comment({
      author: req.userId,
      body: req.body.body,
      postId,
      likes: [req.userId],
    });

    await newComment.save();

    res.redirect(`/api/comments?postId=${postId}`);
  },
];

exports.likeComment = async (req, res) => {
  const commentId = req.params.id;

  const comment = await Comment.findOne({ _id: commentId, likes: req.userId });

  // if already liked, dislike and vice versa
  const arrayCommand = comment ? '$pull' : '$push';

  // Update the likes
  const updatedComment = await Comment.findByIdAndUpdate(commentId, {
    [arrayCommand]: { likes: req.userId },
  });

  res.redirect(`/api/comments?postId=${updatedComment.postId}`);
};
