const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {listingSchema} = require("../schema.js");
const {isLoggedIn, isOwner} = require('../middleware.js')
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(listingController.index))//index route
.post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing)); //create route



// new route
router.get("/new",isLoggedIn,listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing)) //show route
.put(isLoggedIn,isOwner,upload.single("listing[image]"),listingController.updateListing)//update route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)); //delete route


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports = router;