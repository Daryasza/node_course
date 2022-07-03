const path = require('path');
const fs = require('fs');

module.exports = function readdir(entryPath, distPath) {

  fs.readdir(entryPath, (err, files) => {
    if (err) throw err;

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const currentPath = path.resolve(entryPath, file);
      
      fs.stat(currentPath, (err, stats) => {
        if (err) throw err;

        if (stats.isFile()) {
          const fileDistPath = path.resolve(distPath, `./${file[0].toUpperCase()}`);
       
          fs.access(fileDistPath, (err) => {
            if (err) {
              fs.mkdir(fileDistPath, (err) => {
                if (err) {
                  if (err.code === 'EEXIST') {
                    fs.copyFile(currentPath, `${fileDistPath}/${file}`, (err) => {
                      if (err) throw err;
                    });
                  } else {
                    throw err;
                  }
                };

                fs.copyFile(currentPath, `${fileDistPath}/${file}`, (err) => {
                  if (err) throw err;
                });
              });

            } else {
              fs.copyFile(currentPath, `${fileDistPath}/${file}`, (err) => {
                if (err) throw err;
              });
            };
          });

        } else if (stats.isDirectory()) {  
          readdir(currentPath, distPath);
        };
      });
    };
  });
};
