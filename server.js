const express=require("express");
const connectDb=require("./config/db");
const app=express();

app.use(express.json());

connectDb().
then(()=>{
    console.log("database connecte sucessfully");
    app.listen(3000,()=>{
        console.log("server running sucessfully");
    })
    
}).catch(err=>{
    console.log("database not connected");
})
