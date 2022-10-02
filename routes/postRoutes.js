const router = require('express').Router();
const verifyToken = require('../middlewares/verifyToken');
const {
  createPost,
  getPosts,
  getPost,
} = require('../controllers/postController');

router.get('/posts', getPosts);

router.get('/post/:id', getPost);

router.post('/post', verifyToken, createPost);

module.exports = router;
