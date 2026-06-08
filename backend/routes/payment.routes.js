import express from "express";
import { initiateKhaltiPayment, verifyKhaltiPayment } from "../controllers/payment.controller.js";


const paymentRoutes= express.Router();

paymentRoutes.post("/khalti/verify", verifyKhaltiPayment);
paymentRoutes.post("/khalti/initiate", initiateKhaltiPayment);

export default paymentRoutes;
