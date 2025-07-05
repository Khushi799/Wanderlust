const Booking = require('../models/booking');
const Listing = require('../models/listing');

exports.createBooking = async (req, res) => {
  try {
    const { listingId, startDate, endDate } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).send("Listing not found");

    const start = new Date(startDate);
    const end = new Date(endDate);

    const existingBooking = await Booking.findOne({
      listingId,
      $or: [
        {
          startDate: { $lte: end },
          endDate: { $gte: start },
        }
      ]
    });

    if (existingBooking) {
      req.flash('error', 'Selected dates are already booked.');
      return res.redirect(`/listings/${listingId}`);
    }


    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = listing.price * days;

    

    const booking = await Booking.create({
      listingId,
      userId: req.user._id,
      startDate,
      endDate,
      totalPrice,
    });

    res.redirect(`/listings/${listingId}?booked=true`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Booking failed");
  }
};


module.exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    await Booking.findByIdAndDelete(bookingId);
    
    res.redirect('/profile'); 
  } catch (err) {
    console.error("Error cancelling booking:", err);
    res.status(500).send("Something went wrong while cancelling the booking.");
  }
};

