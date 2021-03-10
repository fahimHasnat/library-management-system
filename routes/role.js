const express = require('express');
const router = express.Router();

const roleController = require('../controllers/roleController');
const Authenticate = require('../middlewares/isAuth');
const Validate = require('../middlewares/isValid');

router.get('/roles', Authenticate, Validate(2, "role"), roleController.getRoleList);
router.post('/add-role', Authenticate, Validate(1, "role"), roleController.addRole);
router.patch('/update-role', Authenticate, Validate(3, "role"), roleController.updateRole);
router.delete('/delete-role/:id', Authenticate, Validate(4, "role"), roleController.deleteRole);
router.post('/assign-role', Authenticate, Validate(16, "role"), roleController.assignRole);

module.exports = router;