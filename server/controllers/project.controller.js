import Project from "../models/project.model.js";
import { errorHandler } from "../utils/error.handler.js";
import { valdiateProject } from "../validations/projects.schema.js";
import { convert } from "html-to-text";
import fs from "fs";
import path from "path";
import multer from "multer";
import xlsx from "xlsx";
import mammoth from "mammoth";
import xml2js from "xml2js";

/**
 * @desc create new  project
 * @params POST /api/project/createproject
 * @access PRIVATE (owner of this account)
 **/

export const createProject = async (req, res, next) => {
  const { name, description } = req.body;
  // validate register schema
  const { error } = valdiateProject(req.body);
  if (error) return next(errorHandler(400, `${error.details[0].message}`));
  // check if project already exists
  const existProject = await Project.find({ $or: [{ name }] });
  if (existProject.length)
    return next(errorHandler(409, "Project already exists"));

  const newProject = new Project({
    name,
    description: convert(description),
    creator: req.user.id,
  });

  try {
    await newProject.save();
    const projectFolderPath = `./projects/${req.body.name}`;
    fs.mkdirSync(projectFolderPath, { recursive: true });
    console.log(newProject);
    return res
      .status(201)
      .json({
        message: "Project created successfully",
        status: true,
        project: newProject,
      });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc upload files
 * @params POST /api/project/upload
 * @access PRIVATE (owner of this account)
 **/

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const selectedOption = req.params.option;
    const projectFolderPath = `./projects/${req.params.name}/${selectedOption}`;
    fs.mkdir(projectFolderPath, { recursive: true }, (err) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, projectFolderPath);
      }
    });
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Helper function to convert Excel to Text
function convertExcelToText(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Flatten the JSON to a single string
  let text = '';
  json.forEach(row => {
    text += row.join(' ') + '\n';
  });

  return text;
}

// Helper function to convert Word to Text
async function convertWordToText(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

// Function to save text
function saveText(filePath, textContent) {
  const textFilePath = filePath.replace(path.extname(filePath), '.txt');
  fs.writeFileSync(textFilePath, textContent);
}

// Function to extract multiple texts between lines containing start and end keywords
function extractMultipleTextsBetween(filePath, startKeyword, endKeyword) {
  const textContent = fs.readFileSync(filePath, 'utf8');
  const lines = textContent.split('\n');
  const extractedTexts = [];
  const metadata = {
    startKeywordCount: 0,
    statusWords: [],
    preparedByWords: []
  };

  let isExtracting = false;
  let buffer = [];
  let captureNextLineForPreparedBy = false;

  lines.forEach((line, index) => {
    if (line.includes(startKeyword)) {
      metadata.startKeywordCount++;
      if (buffer.length > 0) {
        extractedTexts.push(buffer.join('\n').trim());
      }
      buffer = []; // Start a new buffer
      isExtracting = true;
    }

    if (isExtracting) {
      buffer.push(line);
    }

    if (line.includes(endKeyword)) {
      if (buffer.length > 0) {
        extractedTexts.push(buffer.join('\n').trim());
      }
      isExtracting = false;
      buffer = [];
    }

    const statusMatch = line.match(/Status:\s*(\w+)/);
    if (statusMatch) {
      metadata.statusWords.push(statusMatch[1]);
    }

    if (captureNextLineForPreparedBy) {
      metadata.preparedByWords.push(line.trim());
      captureNextLineForPreparedBy = false;
    }

    if (line.includes('Prepared By:')) {
      captureNextLineForPreparedBy = true;
    }
  });

  if (isExtracting && buffer.length > 0) {
    extractedTexts.push(buffer.join('\n').trim());
  }

  return { extractedTexts, metadata };
}

// Upload and process files
export const uploadfile = (req, res) => {
  upload.array("files")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).send(err.message);
    } else if (err) {
      return res.status(500).send("An error occurred while uploading files.");
    }

    const files = req.files;

    try {
      for (const file of files) {
        const filePath = file.path;
        const ext = path.extname(filePath).toLowerCase();
        let textContent = '';

        if (ext === '.xlsx') {
          textContent = convertExcelToText(filePath);
        } else if (ext === '.docx') {
          textContent = await convertWordToText(filePath);
        }

        if (textContent) {
          saveText(filePath, textContent);

          // Define the start and end keywords based on the text file name
          const textFilePath = filePath.replace(ext, '.txt');
          let startKeyword = '';
          let endKeyword = '';

          if (path.basename(textFilePath) === 'SWAD.txt') {
            startKeyword = 'SWAD';
            endKeyword = 'Ref:{';
          } else if (path.basename(textFilePath) === 'SWDD.txt') {
            startKeyword = 'SWDD';
            endKeyword = 'Ref{';
          }

          // Extract multiple texts between the keywords
          const { extractedTexts, metadata } = extractMultipleTextsBetween(textFilePath, startKeyword, endKeyword);

          // Save the extracted texts to a JSON file
          const extractedFilePath = filePath.replace(ext, '_extracted.json');
          fs.writeFileSync(extractedFilePath, JSON.stringify(extractedTexts, null, 2));

          // Save the metadata to a separate JSON file
          const metadataFilePath = filePath.replace(ext, '_metadata.json');
          fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
        }
      }

      res.json({ files: req.files });
    } catch (error) {
      console.error('Error processing files:', error);
      res.status(500).send("An error occurred while processing files.");
    }
  });
};

//get all projects

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ creator: req.user.id });
    if (!projects) {
      return next(errorHandler(404, "No projects found"));
    }
    return res.status(200).json({ status: true, projects });
  } catch (error) {
    next(error);
  }
};





//update project
/**
 * @desc update project
 * @params PUT /api/project/updateproject/:id
 * @access PRIVATE (owner of this account)
 **/

export const updateProject = async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const project = await Project.findById(id);

    if (!project) {
      return next(errorHandler(404, "Project not found"));
    }

    if (project.creator.toString() !== req.user.id) {
      return next(
        errorHandler(403, "You are not authorized to update this project")
      );
    }

    const oldName = project.name;
    project.name = name || project.name;
    project.description = description || project.description;
    await project.save();
    if (name && name !== oldName) {
      const baseDirectory = path.join(path.resolve(), './projects');
      const oldFolderPath = path.join(baseDirectory, oldName);
      const newFolderPath = path.join(baseDirectory, name);

      if (fs.existsSync(oldFolderPath)) {
        try {
          fs.mkdirSync(newFolderPath);
          const files = fs.readdirSync(oldFolderPath);
          for (const file of files) {
            fs.renameSync(path.join(oldFolderPath, file), path.join(newFolderPath, file));
          }
          fs.rmdirSync(oldFolderPath);

        } catch (err) {
          console.error(`Failed to move folder contents: ${err.message}`);
          return next(errorHandler(500, `Failed to move folder contents: ${err.message}`));
        }
      } else {
        console.warn(`Old folder path not found: ${oldFolderPath}`);
      }
    }

    return res
      .status(200)
      .json({ message: "Project updated successfully", status: true, project });
  } catch (error) {
    next(error);
  }
};