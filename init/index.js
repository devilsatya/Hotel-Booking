const mongoose=require("mongoose");
const initData=require("./data.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const Listing=require("../models/listing.js");
main().then(()=>{
    console.log("connection succesful");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
};

const initdb=async  () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was intilizig");
};
initdb();