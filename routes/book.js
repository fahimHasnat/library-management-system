const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');
const Authenticate = require('../middlewares/isAuth');
const Validate = require('../middlewares/isValid');

router.post('/add-book', Authenticate, Validate(1, "book"), bookController.addBook);
router.patch('/update-book', Authenticate, Validate(3, "book"), bookController.updateBook);
router.delete('/delete-book/:id', Authenticate, Validate(4, "book"), bookController.deleteBook);
router.get('/books', bookController.getBooks);
router.get('/get-book/:id', bookController.getBook);
router.get('/search/:title', bookController.search);

module.exports = router;