require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors({origin: "*"}));
app.use(express.json());
const connectToMongo = require('./db');

app.use("/api/user",require("./Router/User"))

app.listen(process.env.PORT,()=>{
    console.log("SErver is connected with",process.env.PORT);
    connectToMongo();
})