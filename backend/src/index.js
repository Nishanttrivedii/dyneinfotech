import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/connection.js";
import Category from "./models/Category.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date()
  });
});

app.post("/categories", async()=>{
    try{
    const {name, description} = req.body
    const category = await Category.create({
        name, description
    })

    res.status(201).json({
        success: true,
        data:category
    })
    }
    catch(error){
    res.status(400).json({
        success
    })    }
})
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  await connectDB()
});