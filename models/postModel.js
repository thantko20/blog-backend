const { Schema, model, Types } = require('mongoose');

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Types.ObjectId, ref: 'User' },
    likes: [{ type: Types.ObjectId, ref: 'User' }],
    content: { type: String },
  },
  {
    timestamps: true,
  }
);

const Post = model('Post', PostSchema);

module.exports = Post;
