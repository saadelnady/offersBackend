const asyncHandler = require('express-async-handler');
const UserModel = require('../models/user.js');
const Service = require('../models/service.js');
const ExtraPropModel = require('../models/extraProp.js');

const removeUsernameAndEmail = asyncHandler(async (req, res, next) => {
  // Remove username and email from req.body

  const userId = req.params['id'];
  const user = await UserModel.findById(userId);
  if (user.username === req.body.username) delete req.body.username;
  if (user.email === req.body.email) delete req.body.email;
  if (user.full_name === req.body.full_name) delete req.body.full_name;
  if (user.phone_number === req.body.phone_number) delete req.body.phone_number;

  next();
});

const deleteExtraProps = asyncHandler(async (req, res, next) => {
  const currentService = await Service.findById(req.params.id);

  const extraPropsArray = currentService.extra_props;
  extraPropsArray.forEach(
    asyncHandler(async (extraProp) => {
      await ExtraPropModel.findByIdAndDelete(extraProp);
    }),
  );
  next();
});

module.exports = {
  deleteExtraProps,
  removeUsernameAndEmail,
};
