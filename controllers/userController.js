const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('this route is not used for upodate password!', 400)
    );
  }
  //filter fileds which can be updated
  const filterBody = filterObj(req.body, 'username', 'email');
  //update user document

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.showAddUserForm = (req, res, next) => {
  res.status(200).render('add_user', {
    title: 'Add User',
  });
};
exports.showEditUserForm = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).render('edit_user', {
    title: 'Edit User',
    user,
  });
});
exports.getAllUsers = factory.getAll(User, 'admin_user', 'Manage');
exports.getUser = factory.getOne(User, null, 'detail_user', 'Detail');

exports.updateUser = factory.updateOne(User, 'admin_user', 'Manage');

exports.deleteUser = factory.deleteOne(User, 'admin_user', 'Manage');
exports.createUser = factory.createOne(User, 'admin_user', 'Manage');
