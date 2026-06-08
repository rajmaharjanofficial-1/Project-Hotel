import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { getPersonalizedRecommendations, getSimilarRooms, getTrendingRooms, storeRecentSearch } from "../controllers/recommendation.controller.js";

const Rerouter = express.Router();




Rerouter.get("/user/:userId", isAuthenticated, getPersonalizedRecommendations);
Rerouter.get("/similar/:roomId", getSimilarRooms);
Rerouter.get("/trending", getTrendingRooms);
Rerouter.post("/store", isAuthenticated, storeRecentSearch);



export default Rerouter;
