const { body, validationResult } = require('express-validator');
const { genHash } = require('../lib/bcrypt');
const User = require('../models/userModel');

exports.signUp = [
  body('email')
    .notEmpty()
    .withMessage('Email must not be empty.')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail()
    .custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject('Email already in use.');
        }
      });
    }),
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
      const errorMessages = {};
      errors.array().forEach((err) => (errorMessages[err.param] = err.msg));
      res.status(400).json({ errors: errorMessages });
      return;
    }

    const hashPassword = await genHash(req.body.password);

    const newUser = new User({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashPassword,
    });

    await newUser.save();

    res.json({
      user: {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });
  },
];
