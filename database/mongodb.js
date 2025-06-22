import mongoose from "mongoose";

import { DB_URI, NODE_env } from "../config/env.js";

if(!DB_URI){
    throw new Error('Please define a valid DB_URI inside .env.whatever.local');
}

const connectToDatabase = async () => {
    try {
    await mongoose.connect(DB_URI);
    console.log(`Connected to database...on ${NODE_env}`);
    }
    catch(err){
        console.error('Error connecting to database',err);
        process.exit(1);
    }
}

export default connectToDatabase;