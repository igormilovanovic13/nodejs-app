const express = require('express');

const { body } = require('express-validator/check');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Unesite validnu email adresu!'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Lozinka mora imati 6 ili vise karaktera!'),
  ],
  authController.postLogin
);

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Unesite validnu e-mail adresu!'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Lozinka mora imati 6 ili vise karaktera!'),
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
