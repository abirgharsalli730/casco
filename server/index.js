import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import graphRoutes from "./routes/graph.route.js"
import projectRoutes from "./routes/project.route.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import coonectDB from "./config/db.config.js";
import path from 'path';
import jiraroute from './routes/jira.route.js';
import resultsroute from './routes/results.router.js'
import bodyParser from "body-parser";
import coverRouter from './routes/cover.route.js'
import fs from "fs";
dotenv.config();
coonectDB();

const __dirname = path.resolve();

const app = express();



app.use(cors({
  origin: '*', // Replace with your frontend URL
  credentials: true, // Enable credentials (cookies)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization,Custom-Header'
}));  
app.use(express.json({ limit: '2gb' }));
app.use(express.urlencoded({ limit: '2gb', extended: true }));
app.use(cookieParser());
// Add body-parser middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies


app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use('/api', jiraroute);
app.use("/api/graph",  graphRoutes)
app.use("/api/results",resultsroute)
app.use("/api/coverage",coverRouter)
app.get('/test', (req, res) => {
  const filePath = path.join(__dirname, 'excel.xls');
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    'Content-Type': 'application/vnd.ms-excel',
    'Content-Length': stat.size,
    'Content-Disposition': 'attachment; filename="excel.xls"'
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.use("*", (req, res) => {
  res
    .status(404)
    .json({ message: "page not found 404, bad url", status: false });
});

app.listen(process.env.PORT || 3001, () => {
  console.log(
    `Server listening on port ${process.env.PORT || "3001"}`
  );
});