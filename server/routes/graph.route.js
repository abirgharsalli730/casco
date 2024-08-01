import express from "express";
import { checkFolders } from '../controllers/graph.controller.js';


const router = express.Router();
router.get('/checkFolders/:name', checkFolders);
export default router;