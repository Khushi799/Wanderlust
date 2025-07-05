const Listing=require("../models/listing.js")
const Booking = require("../models/booking");
const fetch = require("node-fetch");
module.exports.index=async(req,res)=>{
    const { category } = req.query;
    let allListings;

    if (category) {
      allListings = await Listing.find({ category });
    } else {
      allListings = await Listing.find({});
    }
    res.render("listings/index.ejs",{allListings});
  }

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
  }  

module.exports.showListing=async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  
  if(!listing){
    req.flash("error","Listing does not exist");
    return res.redirect("/listings");
  }
  
  const booked = req.query.booked === "true";
  res.render("listings/show.ejs",{listing,booked});
  
  
}

module.exports.createListing=async(req,res)=>{

 
  let url=req.file.path;
  let filename=req.file.filename;
  
  const newListing=new Listing (req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename};

  
  await newListing.save();
  req.flash("success","new listing created");
  res.redirect("/listings");
  


}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error","listing you requested does not exist");
      res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
  }

module.exports.updateListing=async(req,res)=>{
  let {id}=req.params;
  let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }
  req.flash("success","listing updated");
  res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","listing deleted");
  res.redirect("/listings");
}

module.exports.searchListings = async (req, res) => {
  

  const { q } = req.query;
  if (!q) {
    return res.redirect("/listings");
  }

  const regex = new RegExp(q, "i"); // case-insensitive search
  const allListings = await Listing.find({
    $or: [
      { title: regex },
      { location: regex },
      { country: regex },
      { category: regex },
    ],
  }).populate("owner");

  res.render("listings/index", { allListings, q });
};