const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

main()
.then(res=>console.log("connected to DB")
).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
const initDB=async()=>{
    try{  await Listing.deleteMany({});
      initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:'67eb78dccf59c9369125af1f',
      }));
      await Listing.insertMany(initData.data);
     
      console.log("data was saved");
    }catch(err){
      console.log(err.message);
    }  
}
initDB();