import mongoose from "mongoose";

export const connectDB = async () =>{
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("Connect To MongoosDB");
        
    } catch (error) {
         console.log("ERROR connecting To MongoosDB:",error);
    }
}