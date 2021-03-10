const express = require('express');
const router = express.Router();

const authorController = require('../controllers/authorController');
const Authenticate = require('../middlewares/isAuth');
const Validate = require('../middlewares/isValid');

router.post('/add-author', Authenticate, Validate(1, "author"), authorController.addAuthor);
router.patch('/update-author', Authenticate, Validate(3, "author"), authorController.updateAuthor);
router.get('/authors', Authenticate, Validate(2, "author"), authorController.getAuthors);
router.delete('/delete-author/:id', Authenticate, Validate(4, "author"), authorController.deleteAuthor);

module.exports = router;
