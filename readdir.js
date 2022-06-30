const path = require('path');
const fs = require('fs');

module.exports = function readdir(entryPath, distPath, isDelete) {

  fs.readdir(entryPath, (err, files) => {
    if (err) {
      throw new Error(err);
    };

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const currentPath = path.resolve(entryPath, file);
      
      fs.stat(currentPath, (err, stats) => {
        if (err) {
          throw new Error(err);
        }

        if (stats.isFile()) {
          const fileDistPath = path.resolve(distPath, `./${file[0].toUpperCase()}`);
       
          fs.access(fileDistPath, (err) => {

            if (err) {
              fs.mkdir(fileDistPath, (err) => {
                if (err) {
                  if (err.code === 'EEXIST') {
                    fs.copyFile(currentPath, `${fileDistPath}/${file}`, (err) => {
                      if (err) {
                        throw new Error(err);
                      }
                    });
                  } else {
                    throw new Error(err)
                  }
                };

                fs.copyFile(currentPath, `${fileDistPath}/${file}`, (err) => {
                  if (err) {
                    throw new Error(err);
                  };
                });
              });

            } else {
              fs.copyFile(currentPath, `${fileDistPath}/${file}`, (err) => {
                if (err) {
                  throw new Error(err);
                }
              });
            };
          });


        } else if (stats.isDirectory()) {  
          readdir(currentPath, distPath, isDelete);
        };
      });
    };
  });
};
