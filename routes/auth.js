import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import {complete_user_auth} from '../controllers/complete.user.auth.js'
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/login/failed' }),
  async (req, res) => {
    const user = req.user; 
    if (!user) {
      return res.redirect('/api/auth/login/failed');
    }

    if (user.username && user.role) {
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: '365d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.PROJECT_STATE === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      return res.redirect(`${process.env.CLIENT_URL}/navigator`);
    }

    
    if (!user.username) {
        res.cookie('email',user.email,{
     httpOnly: true,
        secure: process.env.PROJECT_STATE === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60 * 1000,
     })


      return res.redirect(`${process.env.CLIENT_URL}/complete_profile`)

    }
  }
);



router.post('/complete_user', complete_user_auth)

router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Login failed',
  });
});

export default router;
