const Joi = require('joi');

module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        country:Joi.string().required(),
        location:Joi.string().required(),
        image:Joi.string().allow("",null),
        category: Joi.string().valid(
      "Trending",
      "Rooms",
      "Iconic cities",
      "Mountains",
      "Castles",
      "Amazing pools",
      "Camping",
      "Farm",
      "Arctic"
    ).required(),
    }).required(),
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
});