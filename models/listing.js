const mongoose = require('mongoose');
const Review = require('./review.js');
const { urlencoded } = require('express');

const listingSchema = new mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String,
        required:true
    },
    image:{
        url: String,
        filename: String,
    },
    price:{
        type: Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
        type: {
            type: String, // 'Point'
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
    }})


//mongoose middleware to delete the reviews for a listing after the listing is deleted
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}}); 
    }    
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;