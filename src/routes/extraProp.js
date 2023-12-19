const { Router } = require('express');
const {
  AddExtraProp,
  AddManyExtraProp,
  deleteExtraProp,
  getAllExtraProps,
  getExtraProp,
  updateExtraProp,
} = require('../controllers/extraProp.js');

const {
  isAllowed,
  isMine,
  verifyToken,
  isTheSameCompany,
  isMyService,
  isOrderAllowed,
} = require('../middlewares/auth.js');

const router = Router();
router
  .route('/')
  .get(getAllExtraProps)
  .post(verifyToken, isAllowed('Company', 'Admin'), AddExtraProp);

router.route('/addMany').post(verifyToken, isAllowed('Company', 'Admin'), AddManyExtraProp);

router
  .route('/:id')
  .get(getExtraProp)
  .delete(verifyToken, isAllowed('Company', 'Admin'), deleteExtraProp)
  .put(verifyToken, isAllowed('Company', 'Admin'), updateExtraProp);
module.exports = router;
