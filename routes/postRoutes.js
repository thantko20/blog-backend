const router = require('express').Router();
const verifyToken = require('../middlewares/verifyToken');
const {
  createPost,
  getPosts,
  getPost,
  likePost,
  deletePost,
} = require('../controllers/postController');

router.get('/', getPosts);

router.get('/:id', getPost);

router.post('/', verifyToken, createPost);

router.post('/:id/like', verifyToken, likePost);

router.post('/:id/delete', verifyToken, deletePost);

module.exports = router;
