const express = require("express");
const connectDb = require("../server/src/config/dbConnection");
const dotenv =require("dotenv").config();
const cors = require("cors");

connectDb() ; //calls from config/dbConnection file

const app = express();

app.use(cors())

const port = process.env.PORT||5000;

app.use(express.json())


app.use("/api/panshop/order", require("./src/routes/panShopRoutes"));

app.use("/api/panShopLogin" ,require("./src/routes/panShopOwnerRoutes"))  


app.listen(port,()=>{
    console.log(`Server runiinrng port no ${port}`);
})