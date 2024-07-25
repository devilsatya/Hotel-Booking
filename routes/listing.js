const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const  {listingSchema}=require("../schema.js");
const {isLoggedIn}=require("../middleware.js")


const path=require("path");
const Listing=require("../models/listing.js");

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let ermsg=error.details.map((el)=>el.message).join(',')
        throw new ExpressError(400,ermsg );
    }  else{
        next();
    }
};






router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});

}));


//new route
router.get("/new",isLoggedIn,(req,res)=>{
  //  console.log(req.user);
 
    res.render("listings/new.ejs");
});

//create route
router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res,next)=>{
    //let listing=req.body.listing;
    //or
   // let{title,description,price,image,location,country}=req.body;
 //or

 const newlisting=Listing(req.body.listing);
 
 await newlisting.save();
 req.flash("success","new listing create");

 res.redirect("/listings");

}));
//show route
router.get("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listin=await Listing.findById(id);
if(!listin){
    req.flash("error","listing you are request does not exist");
    res.redirect("/listings");
}
    res.render("listings/show.ejs",{listin});
}));

//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

}));

//update route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listings");
     }
    let {id}=req.params;
   /* const listing=await Listing.findById(id);
    if(!listin.owner.equals(res.localscurrUser._id)&&currUser){
        req.flash("error","we have no permission to update");
       return res.redirect(`/listings/${id}`);
    }*/
    await Listing.findByIdAndUpdate(id,{...req.body.listing});

    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success"," listing deletes");
res.redirect("/listings");
}));


module.exports=router;