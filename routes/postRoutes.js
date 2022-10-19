const router = require('express').Router();
const verifyToken = require('../middlewares/verifyToken');
const {
  createPost,
  getPosts,
  getPost,
  likePost,
  deletePost,
  editPost,
} = require('../controllers/postController');

router.get('/', getPosts);
router.post('/', verifyToken, createPost);
router.get('/:id', getPost);
router.post('/:id/like', verifyToken, likePost);
router.post('/:id/delete', verifyToken, deletePost);
router.post('/:id/edit', verifyToken, editPost);

module.exports = router;
