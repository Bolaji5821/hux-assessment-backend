const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');



exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  const db = getDB();

  try {
    const existingUserByEmail = await db.collection('users').findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const existingUserByUsername = await db.collection('users').findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.collection('users').insertOne({ username, email, password: hashedPassword });
    const userId = result.insertedId;

    const payload = {
      user: {
        id: userId,
        username,
        email
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET,  (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const db = getDB();

  try {
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const payload = {
      user: {
        id: user._id,
        username: user.username,
        email
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET,  (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};




exports.getUserProfile = async (req, res) => {
  const db = getDB();
  try {
    const userId = req.user.id;
    console.log(req.user);
    console.log({ userId });

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) }, 
      { projection: { password: 0 } }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


// Edit user profile
exports.editUserProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  const db = getDB();

  try {
    const updates = { username, email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await db.collection('users').findOneAndUpdate(
      { _id: req.user.id },
      { $set: updates },
      { returnOriginal: false, projection: { password: 0 } }
    );

    if (!updatedUser.value) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser.value);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

