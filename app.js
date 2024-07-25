const express=require("express");
const app=express();
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const path=require("path");

const session=require("express-session");
const flash=require("connect-flash");
const ejsmate=require("ejs-mate");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,"/public")));



const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


 const sessionOptions={
    secret:"mysuprersceretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
         maxAge:7*24*60*60*1000,
       //httpOnly:true
    }
 };
 app.use(session(sessionOptions));
 app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
 });

const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const  {listingSchema}=require("./schema.js");


const Listing=require("./models/listing.js"); 
const userRouter=require("./routes/user.js");

const listings=require("./routes/listing.js");



main().then(()=>{
    console.log("connection succesful");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}


/*
app.get("/testListing",async (req,res)=>{
   let sampleListing=new Listing({
    title:"this is my villa",
    description:"at beach",
    price:1220,
    location:"gao",
    country:"india",
    });
    await sampleListing.save();
    console.log("sample was  saved");
    res.send("testing succesgul");
});

*/
/*
app.get("/demouser",async(req,res)=>{
    let fakeuser=new User({
        email:"srisatyasaikumar333@gmail.com",
        USERNAME:"sai kumar",

    });
    let registerUser=await User.register(fakeuser,"password");
    res.send(registerUser);
})*/

app.use("/listings",listings);
app.use("/",userRouter);
//index route
/*
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let ermsg=error.details.map((el)=>el.message).join(',')
        throw new ExpressError(400,ermsg );
    }  else{
        next();
    }
};

app.get("/",(req,res)=>{
    res.send("iam the root");
});




*/app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});

}));
/*

//new route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
});

//create route
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
    //let listing=req.body.listing;
    //or
   // let{title,description,price,image,location,country}=req.body;
 //or

 const newlisting=Listing(req.body.listing);
 
 await newlisting.save();
 res.redirect("/listings");

}));
//show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listin=await Listing.findById(id);
    res.render("./show.ejs",{listin});
}));

//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});

}));

//update route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listings");
     }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
res.redirect("/listings");
}));


*/



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
}
);

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("./listings/error.ejs",{message});
//res.status(statusCode).send(message);
}
);

app.listen(1234,()=>{
    console.log("port running 1234");
});