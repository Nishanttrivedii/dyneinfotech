import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import pool from "./config/database.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/health", async (req,res)=>{
    try{
      const  result = await pool.query("SELECT NOW()")
    res.json({
        status:"healthy",
        database:"connected",
        timestamp:result.rows[0].now
    });
    
    }

    catch(err){
        res.status(500).json({
            status:"unhealthy",
        database:"disconnected",
        error:err.message
        })
    }
});

const PORT= process.env.PORT || 3000;

app.listen(PORT,()=>{
console.log("server is running")

})