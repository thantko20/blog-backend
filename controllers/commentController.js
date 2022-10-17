const Comment = require('../models/commentModel');
const { body, validationResult } = require('express-validator');
const { Types } = require('mongoose');
const User = require('../models/userModel');

exports.getComments = async (req, res) => {
  const postId = req.query.postId;

  const comments = await Comment.aggregate()
    .match({ postId: Types.ObjectId(postId) })
    .addFields({ likesCount: { $size: '$likes' } })
    .sort({ likesCount: -1 });

  const authorPopulatedComments = await User.populate(comments, {
    path: 'author',
    select: 'firstName lastName fullname',
  });

  res.json({ data: authorPopulatedComments });
};

exports.addComment = [
  body('content').notEmpty().withMessage('Comment should not be empty').trim(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = {};
      errors.array().forEach((err) => {
        errorMessages[err.param] = err.msg;
      });
      return res.status(400).json({ message: 'Validation failed.' });
    }

    const postId = req.query.postId;

    const newComment = new Comment({
      content: req.body.content,
      author: req.userId,
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
