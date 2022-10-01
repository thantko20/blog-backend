const router = require('express').Router();
const { signUp } = require('../controllers/authController');

router.post('/sign-up', signUp);

module.exports = router;
