const router = require('express').Router();
const verifyToken = require('../middlewares/verifyToken');
const {
  createPost,
  getPosts,
  getPost,
  likePost,
} = require('../controllers/postController');

router.get('/posts', getPosts);

router.get('/post/:id', getPost);

router.post('/post', verifyToken, createPost);

router.post('/post/:id/like', verifyToken, likePost);

module.exports = router;
