import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { genHash } from '../lib/bcrypt';
import UserModel from '../models/userModel';

// POST /sign-up
export const signUp = [
  body('username')
    .notEmpty()
    .withMessage("Username can't be empty")
    .trim()
    .isLength({ min: 4 })
    .withMessage('Username must have at least 4 characters.')
    .isAlphanumeric()
    .withMessage('Username can only contain letters and numbers')
    .custom((value) => {
      return UserModel.findOne({ username: value }).then((user) => {
        if (user) {
          return Promise.reject('Username already exists.');
        }
      });
    })
    .escape(),
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
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const hashPassword = await genHash(req.body.password);
      const newUser = new UserModel({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashPassword,
      });

      await newUser.save();

      res.json({ message: 'Sign Up Successful.' });
    } catch (err: unknown) {
      if (err) res.status(500).json({ message: 'Unknown Error.' });
    }
  },
];
