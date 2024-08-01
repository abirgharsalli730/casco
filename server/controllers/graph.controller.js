import fs from 'fs';
import path from 'path';

export const checkFolders = (req, res) => {
  const { name } = req.params;
  const baseDirectory = path.join(path.resolve(), `./projects/${name}`);
  const folders = req.query.folders.split(',');

  const folderStatus = folders.map(folder => {
    const folderPath = path.join(baseDirectory, folder);
    return { folder, exists: fs.existsSync(folderPath) };
  });

  res.json(folderStatus);
};
