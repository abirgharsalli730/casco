import express from "express";
import { getProjectResults,getSW } from '../controllers/results.controller.js';

const router = express.Router();
router.get('/getResults/:name', getProjectResults);
router.get('/getSW/:name', getSW);

export default router;
