const router = require('express').Router();
const {
  getComments,
  addComment,
  likeComment,
  deleteComment,
} = require('../controllers/commentController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', getComments);
router.post('/', verifyToken, addComment);
router.post('/:id/like', verifyToken, likeComment);
router.post('/:id/delete', verifyToken, deleteComment);

module.exports = router;
