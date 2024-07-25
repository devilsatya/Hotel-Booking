const express=require("express");
const app=express();
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const flash=require("connect-flash");

/* 
const users=require("./routes/user.js");
const posts=require("./routes/post.js");*/
const session=require("express-session");
/*
app.use(session({secret:"mysceretcodeinstring",
                  resave:false,
                  saveUninitialized:true,
                }));*/

const sessionOptions={
    secret:"mysceretcodeinstring",
                  resave:false,
                  saveUninitialized:true,

};

 app.use(session(sessionOptions));
 app.use(flash());
 app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
 });
 
 app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
   if(name==="anonymous"){
    
   
    req.flash("error","user not  registration ");
   }
   else{
    req.flash("success","user registration succesgful");
   }
    res.redirect("/hello");
 });


 app.get("/hello",(req,res)=>{
   // let ms=req.flash("success")
  
    res.render("./page.ejs",{name:req.session.name});
    
 });



                /*


app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`you sent a request ${req.session.count}times`);
})
*/
/*
app.get("/test",(req,res)=>{
    res.send("testiong succsfful");
});
*/











app.listen(7890,()=>{
    console.log("port running 1234");
});


/*
const cookieparser=require("cookie-parser");

app.use(cookieparser("sceretcode"));
app.get("/",(req,res)=>{
    res.send("iam root");

});

app.get("/getcookie",(req,res)=>{
    res.cookie("name","value");
    res.cookie("sai","hello");
    res.send("iam root");

});
app.get("/get",(req,res)=>{
    console.dir(req.cookies);
    res.send("iam root");

});
app.get("/greet",(req,res)=>{
    let {name="anonomus"}=req.cookies;
    res.send(`hello ${name}`);
});



app.get("/signedcookie",(req,res)=>{
    res.cookie("sai","hello",{signed:true});
    res.send("signed cookie sent");


});

app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("cookie verified");
})
*/