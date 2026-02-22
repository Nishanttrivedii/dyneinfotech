//import pool from packages
//load env variables from env file
//create a connection pool

//test the connection pool

//export the pool

import pg from "pg";
import dotenv from "dotenv"

const {Pool} = pg;

dotenv.config();

// Support both DATABASE_URL (production/Render) and separate variables (local development)
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false // Required for Render PostgreSQL
        }
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,       
        database: process.env.DB_NAME,  
        user: process.env.DB_USER,       
        password: process.env.DB_PASSWORD
      }
)

pool.connect((err,client,release)=>{
    if(err){
        console.error("Error connecting to the database",err)
    }
    else{
        console.log("database connected successfully")
        release();
    }
})

export default pool;