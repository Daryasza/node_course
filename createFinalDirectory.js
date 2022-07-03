const fs = require('fs');

module.exports = function createFinalDirectory (distPath) {
  fs.mkdir(distPath, err => {
    if (err) {
      throw err;
    } 
  });
};