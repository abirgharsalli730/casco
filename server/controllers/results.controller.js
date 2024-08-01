import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';

export const getProjectResults = async (req, res) => {
  const { name } = req.params;
  const baseDirectory = path.join(path.resolve(), `./projects/${name}`);
  if (!fs.existsSync(baseDirectory)) {
    return res.status(404).json({ message: "Project does not exist" });
  }   
  const folders = fs.readdirSync(baseDirectory).filter(folder => fs.lstatSync(path.join(baseDirectory, folder)).isDirectory());

  const result = {};

  for (const folder of folders) {
    const folderPath = path.join(baseDirectory, folder);
    const xmlFilePath = path.join(folderPath, `${folder}.xml`);
    const jsonFilePath = path.join(folderPath, `${folder}_results.json`);

    if (fs.existsSync(xmlFilePath) && fs.existsSync(jsonFilePath)) {
      const xmlContent = fs.readFileSync(xmlFilePath, 'utf-8');
      const jsonContent = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

      // Parse XML content to a structured array
      const parser = new xml2js.Parser();
      const xmlData = await parser.parseStringPromise(xmlContent);
      const issues = xmlData.issues.issue.map(issue => {
        const parsedIssue = {};
        for (const key in issue) {
          if (issue.hasOwnProperty(key)) {
            parsedIssue[key] = issue[key][0];
          }
        }
        return parsedIssue;
      });

      result[folder] = {
        list: issues,
        graph: jsonContent
      };
    }
  }

  res.json(result);
};

export const getSW = async (req, res) => {
  const { name } = req.params;
  const baseDirectory = path.join(path.resolve(), `./projects/${name}`);
  
  if (!fs.existsSync(baseDirectory)) {
    return res.status(404).json({ message: "Project does not exist" });
  }

  const result = {};
  const foldersToCheck = ['SWAD', 'SWDD'];

  for (const folder of foldersToCheck) {
    const folderPath = path.join(baseDirectory, folder);
    const metadataFilePath = path.join(folderPath, `${folder.toLowerCase()}_metadata.json`);
    const extractedFilePath = path.join(folderPath, `${folder.toLowerCase()}_extracted.json`);

    if (fs.existsSync(metadataFilePath) && fs.existsSync(extractedFilePath)) {
      const metadataContent = JSON.parse(fs.readFileSync(metadataFilePath, 'utf-8'));
      const extractedContent = JSON.parse(fs.readFileSync(extractedFilePath, 'utf-8'));

      let structuredExtractedContent;
      if (folder === 'SWDD') {
        structuredExtractedContent = structureSWDDJsonData(extractedContent);
      } else if (folder === 'SWAD') {
        structuredExtractedContent = structureSWADJsonData(extractedContent);
      }

      result[folder] = {
        metadata: metadataContent,
        extracted: structuredExtractedContent
      };
    }
  }

  res.json(result);
};
// Function to structure SWDD JSON data
function parseSWDDEntry(entry) {
  const lines = entry.split(/\n+/);
  const ID = lines[0] ||   null;
  const taskName = lines[1] ||   null;
  const description = lines.includes('Description') ? lines[lines.indexOf('Description') + 1] : null;
  const parameter = lines.includes('Parameter 1') ? lines[lines.indexOf('Parameter 1') + 1] : null;
  const returnValue = lines.includes('Return Value') ? lines[lines.indexOf('Return Value') + 1] : null;
  const precondition = lines.includes('Precondition') ? lines[lines.indexOf('Precondition') + 1] : null;
  const postCondition = lines.includes('Post condition') ? lines[lines.indexOf('Post condition') + 1] : null;
  const errorConditions = lines.includes('Error Conditions') ? lines[lines.indexOf('Error Conditions') + 1] : null;
  const reference = lines.find(line => line.startsWith('Ref')) || null;

  return {
    ID,
    taskName,
    description,
    parameter,
    returnValue,
    precondition,
    postCondition,
    errorConditions,
    reference
  };
}

function structureSWDDJsonData(inputData) {
  return inputData.map(entry => parseSWDDEntry(entry));
}

// Function to structure SWAD JSON data
function parseSWADEntry(entry) {
  // Split the entry into lines
  const lines = entry.split('\n').map(line => line.trim()).filter(line => line !== "");

  // Initialize structured JSON object
  const structuredJSON = {
      taskname: lines[0],
      reference: "",
      interfaceDetails: []
  };

  let inInterfaceDetails = false;
  let currentInterface = null;
  let summaryLines = []; // Array to store summary lines

  // Iterate through each line
  lines.forEach(line => {
      if (line === 'Provided Interface Details') {
          inInterfaceDetails = true;
          return;
      }

      if (!inInterfaceDetails) {
          summaryLines.push(line.replace(structuredJSON.taskname,'')); 
      } else {
          if (line.startsWith('Ref:')) {
              structuredJSON.reference = line.match(/Ref:{([^}]*)}/)[1];
              inInterfaceDetails = false;
          } else {
              if (!currentInterface) {
                  currentInterface = {
                      interfaceName: line,
                      description: "",
                      parameters: "",
                      returns: "",
                      summary: summaryLines.join('\n') // Add summary field to currentInterface
                  };
              } else if (!currentInterface.description) {
                  currentInterface.description = line;
              } else if (!currentInterface.parameters) {
                  currentInterface.parameters = line;
              } else if (!currentInterface.returns) {
                  currentInterface.returns = line;
                  structuredJSON.interfaceDetails.push(currentInterface);
                  currentInterface = null;
              }
          }
      }
  });

  return structuredJSON;
}

function structureSWADJsonData(inputData) {
  return inputData.map(entry => parseSWADEntry(entry));
}
