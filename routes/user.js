const express = require('express');
const router = express.Router();
const multer = require('multer');
const { imageFilter } = require('../services/imageFilter');
const path = require('path');

const userController = require('../controllers/userController');
const Authenticate = require('../middlewares/isAuth');
const Validate = require('../middlewares/isValid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({ storage: storage, fileFilter: imageFilter });

router.post('/upload', upload.single('profile_pic'), userController.uploadPic);
router.post('/add-user', userController.addUser);
router.patch('/update-user', Authenticate, Validate(3, "user"), userController.updateUser);
router.get('/deactivate', Authenticate, Validate(6, "user"), userController.deactivateUser);
router.get('/users', Authenticate, Validate(2, 'user'), userController.getUserList);
router.get('/activate/:id', Authenticate, Validate(5, "user"), userController.activateUser);
router.get('/get-user/:id', Authenticate, Validate(10, "user"), userController.getUser);
router.get('/get-user', Authenticate, Validate(2, "user"), userController.getProfile)

module.exports = router;