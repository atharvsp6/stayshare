const mongoose = require('mongoose');
const Listing = require("../models/listing.js")
const initData = require('./data.js');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}
main().then(()=>console.log("successfully connected to mongodb")).catch(err => console.log(err));

async function initDB(){
 await Listing.deleteMany({});
 initData.data = initData.data.map((obj) => ({
    ...obj,
    owner:'68829939b4c0d3a013e9cf0d',
 }));
 await Listing.insertMany(initData.data);
 console.log("data was intialized!");
}

// initDB();