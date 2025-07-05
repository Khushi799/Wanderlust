const User=require("../models/user.js");
const Booking = require('../models/booking');
const Listing = require('../models/listing');

module.exports.signupForm=(req,res)=>{
    res.render("./user/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        });
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}

module.exports.loginForm=(req,res)=>{
    res.render("./user/login.ejs");
}

module.exports.login=async(req,res)=>{
    
    req.flash("success","Welcome back to Wanderlust !");
    
    res.redirect(res.locals.redirectUrl ||"/listings");
}

module.exports.logout=async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out !");
        res.redirect("/listings");
    });

    
    
}


exports.userProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ userId }).populate('listingId');
    
    const listings = await Listing.find({ owner: userId }); 

    res.render('./user/profile.ejs', { bookings, listings });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Unable to load profile.');
    res.redirect('/');
  }
};