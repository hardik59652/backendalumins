import express from "express";
import { createReunion, getReunion } from "../controllers/reunion.controller.js";

const router = express.Router();

router.post("/create",createReunion);
router.get("/",getReunion);

export default router;