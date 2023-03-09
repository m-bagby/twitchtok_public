import express from "express";
import {getFrontpage} from "../controllers/FrontpageController.js";

const router = express.Router();

router.get("", getFrontpage);

export default router;