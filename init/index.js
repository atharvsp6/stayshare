require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require("../models/listing.js")
const initData = require('./data.js');
const dbUrl = process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(dbUrl);
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

initDB();