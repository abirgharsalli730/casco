import express from "express";
import { createProject,getProjects,uploadfile,updateProject } from "../controllers/project.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/createproject",authMiddleware, createProject );
router.post("/upload/:name/:option", uploadfile );
router.get("/getprojects",authMiddleware,getProjects)
router.put("/updateproject/:id", authMiddleware, updateProject);

export default router;