const { getDB } = require('../config/db');
const { validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');

exports.createContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, address, email, phoneNumber } = req.body;
  const db = getDB();

  try {
    const newContact = {
      userId: req.user.email,
      firstName,
      address, email,
      lastName,
      phoneNumber,
    };

    const result = await db.collection('contacts').insertOne(newContact);
    console.log({result})
    res.json(newContact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllContacts = async (req, res) => {
  const db = getDB();

  try {
    console.log(req.user)
    const contacts = await db.collection('contacts').find({ userId: req.user.email }).toArray();
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getContact = async (req, res) => {
  const db = getDB();

  try {
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(req.params.id) });
    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName,  address, email, phoneNumber } = req.body;
  const db = getDB();

  try {
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(req.params.id) });
    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }

    if (contact.userId !== req.user.email) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const updatedContact = {
      firstName,
      address, email,
      lastName,
      phoneNumber,
    };

    await db.collection('contacts').updateOne({ _id: new ObjectId(req.params.id) }, { $set: updatedContact });
    res.json(updatedContact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteContact = async (req, res) => {
  const db = getDB();

  try {
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(req.params.id) });
    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }

    if (contact.userId !== req.user.email) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await db.collection('contacts').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ msg: 'Contact removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
