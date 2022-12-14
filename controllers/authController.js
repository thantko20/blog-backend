const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { genHash, comparePasswords } = require('../lib/bcrypt');
const User = require('../models/userModel');

exports.signUp = [
  body('email')
    .notEmpty()
    .withMessage('Email must not be empty.')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail(),
  body('firstName')
    .notEmpty()
    .withMessage("First Name can't be empty.")
    .trim()
    .isLength({ min: 2 })
    .withMessage('First Name must have at least 2 letters.')
    .isAlpha()
    .withMessage('First Name can only contain alphabets.'),
  body('lastName')
    .notEmpty()
    .withMessage("Last Name can't be empty.")
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last Name must have at least 2 letters.')
    .isAlpha()
    .withMessage('Last Name can only contain alphabets.'),
  body('password').notEmpty().withMessage('Password should not be emtpy'),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed. Try again.' });
      return;
    }

    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const hashPassword = await genHash(req.body.password);

    const newUser = new User({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashPassword,
    });

    await newUser.save();
    res.json({ message: 'Sign Up Successful.' });
  },
];

exports.signIn = [
  body('email').isEmpty().withMessage('Email must not be empty'),
  body('password').isEmpty().withMessage('Password must not be empty'),
  async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid Email.' });
    }

    const isValidPassword = await comparePasswords(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid Password.' });
    }

    jwt.sign(
      { userId: user._id },
      process.env.TOKEN_SECRET,
      { expiresIn: '30d' },
      (err, token) => {
        if (err) next(err);

        // Send back the token to frontend.
        res.json({
          token,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            _id: user._id,
          },
        });
      },
    );
  },
];

exports.getUser = async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed.' });
  }

  res.json({
    data: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    },
  });
};
