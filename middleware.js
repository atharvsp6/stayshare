const Listing = require("./models/listing.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const expressError = require('./utils/expressError.js');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in for that!👇");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}


module.exports.isOwner = async(req,res,next) => {
    
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
   next()
}

module.exports.validateReview = (req,res,next) => {
    try{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
    }catch(err){
    console.log(err);
}
}

module.exports.isReviewAuthor = async(req,res,next) => {
    try{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }}
    catch(err){
        console.log(err);
    }
   next()
}