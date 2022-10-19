const Comment = require('../models/commentModel');
const { body, validationResult } = require('express-validator');
const { Types } = require('mongoose');
const User = require('../models/userModel');
const Post = require('../models/postModel');

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

exports.deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const { postId } = req.query;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(400).json({ message: 'Post does not exist.' });
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(400).json({ message: 'Comment does not exist.' });
  }

  // Post owner and comment owner can delete comment instance
  if (
    String(post.author) === req.userId ||
    String(comment.author) === req.userId
  ) {
    await Comment.findByIdAndDelete(commentId);
    return res.json({ message: 'Comment Deleted.' });
  }

  return res.json({
    message: 'You are not authorized to perform this action.',
  });
};
