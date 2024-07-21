const express = require('express');
const { check } = require('express-validator');
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', [
  authMiddleware,
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('phoneNumber', 'Phone number is required').not().isEmpty(),
], contactController.createContact);

router.get('/', authMiddleware, contactController.getAllContacts);
router.get('/:id', authMiddleware, contactController.getContact);
router.put('/:id', [
  authMiddleware,
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('phoneNumber', 'Phone number is required').not().isEmpty(),
], contactController.updateContact);

router.delete('/:id', authMiddleware, contactController.deleteContact);

module.exports = router;
