const express = require('express');
const router = express.Router();

const bookLoanController = require('../controllers/bookloanController');
const Authenticate = require('../middlewares/isAuth');
const Validate = require('../middlewares/isValid');

router.post('/request', Authenticate, Validate(11, "bookloan"), bookLoanController.requestBook);
router.get('/reject/:id', Authenticate, Validate(12, "bookloan"), bookLoanController.rejectBookLoan);
router.get('/accept/:id', Authenticate, Validate(13, "bookloan"), bookLoanController.acceptBookLoan);
router.get('/return/:id', Authenticate, Validate(14, "bookloan"), bookLoanController.returnBookLoan);
router.get('/my-loans', Authenticate, Validate(2, "bookloan"), bookLoanController.myBookLoans);
router.get('/book-loan/:id', Authenticate, Validate(10, "bookloan"), bookLoanController.specificBookLoans);
router.get('/export', Authenticate, Validate(15, "bookloan"), bookLoanController.bookLoanExport);

module.exports = router;