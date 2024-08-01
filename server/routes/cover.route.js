import express from "express";
import { allIssues } from "../controllers/cover.controller.js"

const router = express.Router();
router.post('/cover',allIssues)
export default router;
