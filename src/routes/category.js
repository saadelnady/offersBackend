const { Router } = require('express');
const {
  AddCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} = require('../controllers/category.js');

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
  .get(getAllCategories)
  .post(verifyToken, isAllowed('Company', 'Admin'), AddCategory);

router
  .route('/:id')
  .get(getCategory)
  .delete(verifyToken, isAllowed('Company', 'Admin'), deleteCategory)
  .put(verifyToken, isAllowed('Company', 'Admin'), updateCategory);

module.exports = router;
