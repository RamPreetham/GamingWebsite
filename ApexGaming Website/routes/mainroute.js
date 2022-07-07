const express = require('express');
const router = express.Router();
const controller = require('../controllers/mainController');
const {isGuest, authenticated} = require('../middlewares/auth');
const ratelimiter = require('../middlewares/rateLimiter')
const validate = require('../middlewares/validator');

//get /nav/about renders about.ejs page
router.get('/about',controller.about);

//get /nav/contact renders contact.ejs page
router.get('/contact',controller.contact);

//get /nav/login renders login.ejs page
router.get('/login',isGuest, controller.login);

router.post('/login', isGuest,ratelimiter.loginLimiter,validate.validateLogin, validate.validateResult,controller.authenticate);

//get /nav/signup renders signup.ejs page
router.get('/signup',isGuest, controller.signup);

router.post('/signup',isGuest,ratelimiter.loginLimiter,validate.validateSignup,validate.validateResult,controller.create);

//get /nav/profile renders signup.ejs page
router.get('/profile',authenticated, controller.profile);

//get /nav/logout renders signup.ejs page
router.get('/logout',authenticated, controller.logout);

//get /nav/msg renders message.ejs page
router.get('/msg', controller.msg);

//get /nav/cart renders items which are already in cart
router.get('/cart', authenticated, controller.cartitems);

//get /nav/cart/id renders details of particular item in cart
router.get('/cart/:id',validate.validateId, authenticated, controller.cartitem);

//get /nav/cart/id/edit renders edit form (only quantity)
router.get('/cart/:id/edit',validate.validateId, authenticated, controller.cartedit);

//put /nav/cart/id updates the particular item in cart
router.put('/cart/:id',validate.validateId, authenticated, controller.cartupdate);

router.delete('/cart/:id', validate.validateId, authenticated, controller.cartdelete);
module.exports = router;