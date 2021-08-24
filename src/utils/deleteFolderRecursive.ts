import fs from 'fs';
import path from 'path';

const deleteFolderRecursive = function (dirPath: string) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);

      if (fs.lstatSync(curPath).isDirectory()) deleteFolderRecursive(curPath);
      else fs.unlinkSync(curPath);
    });

    fs.rmdirSync(dirPath);
  }
};

export default deleteFolderRecursive;