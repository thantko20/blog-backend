const { Schema, model, Types } = require('mongoose');

const CommentSchema = new Schema(
  {
    body: { type: String, required: true },
    author: { type: Types.ObjectId, ref: 'User' },
    likes: [{ type: Types.ObjectId, ref: 'User' }],
    postId: { type: Types.ObjectId, ref: 'Post', required: true },
  },
  {
    timestamps: true,
  }
);

const Comment = model('Comment', CommentSchema);

module.exports = Comment;
