const router = require('express').Router();
const { signUp, signIn, getUser } = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.get('/user', verifyToken, getUser);

module.exports = router;
