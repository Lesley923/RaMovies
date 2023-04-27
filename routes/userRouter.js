const express = require('express');
const multer = require('multer');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const reviewController = require('./../controllers/reviewController');

const router = express.Router();

router
  .route('/signup')
  .get(userController.sendSignUpForm)
  .post(authController.signup);

router.route('/login').post(authController.login);

router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', authController.protect, userController.deleteMe);
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  );
router
  .route('/add')
  .get(userController.showAddUserForm)
  .post(userController.createUser);

router
  .route('/details/:id')
  .get(authController.protect, userController.getUser);
router.route('/delete/:id').post(userController.deleteUser);
router
  .route('/edit/:id')
  .get(authController.protect, userController.showEditUserForm)
  .post(authController.protect, userController.updateUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
