import express from "express";
import {getAccessKey} from "../controllers/AccessTokenController.js";

const router = express.Router();

router.get("", getAccessKey);

export default router;