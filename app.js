if(process.env.NODE_ENV != "production"){
    console.log("development mode");
    require('dotenv').config();
};





const express = require('express');
const app = express();
const mongoose =  require('mongoose');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const expressError = require("./utils/expressError.js");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");


app.use(cookieParser("secretcode"));


const listingRouter = require('./routes/listings.js');
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(dbUrl)
}
main().then(()=>console.log("successfully connected to mongodb")).catch(err => console.log(err));

app.set('view engine','ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() * 7 * 24 * 60 * 60 *  1000,
        maxAge: 7 * 24 * 60 * 60 *  1000,
        httpOnly: true
    }
};

sessionOptions.store = MongoStore.create(
    {
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600, // time period in seconds
    crypto: {
        secret: process.env.SECRET
    }
});

sessionOptions.store.on("error",function(e){
    console.log("session store error",e);   
}
);


// app.get("/",(req,res)=>{
    
//     res.send(`Hi i am root`);
// })

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

//creating a demo user using User.register method
// app.get("/demouser", async (req, res) => {
//   try {
//     const fakeUser = new User({
//       email: "student@gmail.com",
//       username: "delta-student2",
//     });
//     const registeredUser = await User.register(fakeUser, "hello world");
//     res.send(registeredUser);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }

// });

//using express router for all /listings routes which are specified inside routes folder in listing.js
app.use("/listings",listingRouter);

//using express router for all /listings/:id/reviews routes which are specified inside routes folder in reviews.js
app.use("/listings/:id/reviews",reviewRouter);

app.use("/",userRouter);


// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description:"by the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country: "India"
//     })
//     await sampleListing.save();
//     console.log("sample was saved!");
//     res.send("<h1>successful testing!</h1>");
// })

app.all("/{*splat}",((req,res,next)=>{
    next(new expressError(404,"Page not found!"));
}));


app.use((err,req,res,next)=>{
    let {status = 500, message="something went wrong!"} = err;
    res.status(status).render("error.ejs",{message});
    // res.status(status).send(message);
});

app.listen(8080,()=>{
    console.log("listening on port 8080");
})