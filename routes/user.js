const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const bcryptjs = require('bcryptjs');

module.exports = (admin) => {
const db = admin.firestore();
const usersCollection = db.collection('users');

const verifyToken = async (req, res, next) => {
  const idToken = req.header('x-auth-token');
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
      });
    }
  };


router.get('/', async (req, res, next) => {
  try {
    const user = await usersCollection.doc(req.user.uid).get();

    if (!user.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: user.data(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
});

router.post('/register', async (req, res, next) => {
  const { name, email, phone, password, confirmpassword } = req.body;

  try {
    const existingUser = await usersCollection.where('email', '==', email).get();

    if (!existingUser.empty) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

const salt = await bcryptjs.genSalt(10);
const hashedPassword = await bcryptjs.hash(password, salt);
const hashedConfirmPassword = await bcryptjs.hash(confirmpassword, salt);

const newUserRef = await usersCollection.add({
      name,
      email,
      phone,
      password: hashedPassword,
      confirmpassword: hashedConfirmPassword,
    });

const newUserDoc = await newUserRef.get();
const firebaseIdToken = await admin.auth().createCustomToken(newUserDoc.id);

    res.status(200).json({
      success: true,
      user: newUserDoc.data(),
      token: firebaseIdToken,


    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
});

router.post('/login', async (req, res, next) => {
  try {
    
    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid user credentials. Please log in again.',
      });
    }

    const user = await usersCollection.doc(req.user.uid).get();

    if (!user.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register to continue.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User logged in',
      user: user.data(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
});

return router;
};