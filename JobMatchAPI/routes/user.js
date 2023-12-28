const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcryptjs = require('bcryptjs');


router.get('/', async(req, res, next) => {
  try {

      const user = await User.findById(req.user.id).select('-password');
          res.status(200).json({
              success: true,
              user: user
          });

  } catch(error) {
      console.log(error.message);
      res.status(500).json({
          success: false,
          massage: 'Server Error'
      })
      next();
  }
});

router.post('/register', async (req, res, next) => {
    const { name, email, phone, password, confirmpassword } = req.body;
    console.log('Entered /register endpoint');

    try {
        let user_exist = await User.findOne({ email: email });

        if (user_exist) {
          return res.status(400).json({
            success: false,
            massage: 'User already exists'
          });
        }
        let user = new User();

        user.name = name;
        user.email = email;
        user.phone = phone;
    
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);
        user.confirmpassword = await bcryptjs.hash(confirmpassword, salt);

        await user.save();
        const payload = {
          user: {
            id: user.id
          }
        };
        
          res.status(200).json({
            success: true,
            user: user
          });
    
    } catch (err) {
      console.error(err.stack);
      res.status(500).json({
          success: false,
          message: 'Something error occurred',
          user: user
      });
    }    
});

router.post('/login', async(req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {

      let user = await User.findOne({
          email: email
      });

      if(!user) {
          return res.status(400).json({
              success: false,
              massage: 'User not exists go & register to continue.'
          });
      }


      const isMatch = await bcryptjs.compare(password, user.password);

      if(!isMatch) {
          return res.status(400).json({
              success: false,
              massage: 'Invalid password'
          });
      }

      const payload = {
          user: {
              id: user.id
          }
      }

              res.status(200).json({
                  success: true,
                  msg: 'User logged in',
                  user: user
              });
         

  } catch(error) {
      console.log(error.message);
      res.status(500).json({
          success: false,
          massage: 'Server Error'
      })
  }
});

module.exports = router;