const path = require('path');
const fsPromises = require('fs').promises;

module.exports = async function readdir(entryPath, distPath) {
  return new Promise(async (resolve, reject) => {
    try {
      files = await fsPromises.readdir(entryPath);
  
      for (const file of files) {
        const currentPath = path.resolve(entryPath, file);
        statsObj = await fsPromises.stat(currentPath);
  
        if (statsObj.isFile()) {
          const fileDistPath = path.resolve(distPath, `./${file[0].toUpperCase()}`);
          try {
            await fsPromises.access(fileDistPath);
            await fsPromises.copyFile(currentPath, `${fileDistPath}/${file}`);
          } catch (e) {
  
            try {
              await fsPromises.mkdir(fileDistPath)
              await fsPromises.copyFile(currentPath, `${fileDistPath}/${file}`);
            } catch (e) {
              if (e.code === 'EEXIST') {
                await fsPromises.copyFile(currentPath, `${fileDistPath}/${file}`);
              } else {
                throw e;
              }
            }
          }  
        } else if (statsObj.isDirectory()) {  
          readdir(currentPath, distPath);
        }
        resolve(true);
      }
    } catch (error) {
      reject(error);
    }
  })
}
