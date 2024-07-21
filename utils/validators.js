const { check } = require('express-validator');

exports.userValidationRules = [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
];

exports.contactValidationRules = [
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('phoneNumber', 'Phone number is required').not().isEmpty(),
];
