const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');
const {isLoggedIn}=require("../middleware.js");

router.post('/book', isLoggedIn, bookingController.createBooking);
router.delete('/:id', bookingController.cancelBooking);

module.exports = router;
