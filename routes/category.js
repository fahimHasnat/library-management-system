const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const Authenticate = require('../middlewares/isAuth');
const Validate = require('../middlewares/isValid');

router.get('/categories', Authenticate, Validate(2, "category"), categoryController.getCategoryList);
router.post('/add-category', Authenticate, Validate(1, "category"), categoryController.addCategory);
router.patch('/update-category', Authenticate, Validate(3, "category"), categoryController.updateCategory);
router.delete('/delete-category/:id', Authenticate, Validate(4, "category"), categoryController.deleteCategory);

module.exports = router;