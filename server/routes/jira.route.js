import express from "express";
import {getIssues , getIssuesByCreator , getAssignedIssues , getIssueByID , getIssusByProject ,  saveAsCSVandXML} from '../controllers/jira/get-issues.js';

import  getUser   from '../controllers/jira/get-users.js';
import {getProjects} from '../controllers/jira/get-projects.js'
const router = express.Router();

    router.post('/issus', getIssues);
    router.post('/issus/bycreator', getIssuesByCreator);
    router.post('/issus/bycurrentProfile', getAssignedIssues);
    router.post('/issus/byproject', getIssusByProject); 
    router.get('/byIds', getIssueByID);
    router.get('/user', getUser);
    router.post('/project', getProjects);
    router.post('/saveAsCSV/:name', saveAsCSVandXML);
    
    
    export default router;
