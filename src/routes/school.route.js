import express from "express";
import { getSchools } from "../controllers/school.controller.js";
import isLoggedIn from "../middlewares/isLoggedin.js";
const router = express.Router();
router.get("/", isLoggedIn, getSchools);
export default router;
