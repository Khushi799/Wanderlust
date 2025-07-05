const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,isAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js")

const validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
};
// Reviews
//Post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview));
  
  // Delete Route
  router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));
  
  module.exports=router;