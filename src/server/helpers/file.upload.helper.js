const multer = require('multer');
const mime = require('mime');
const path = require('path');
const fs = require('fs');

const randomFileName = (length) => {
  return [...Array(length)].map((element) => (~~(Math.random()*36)).toString(36)).join('');
}

const helper = {
  uploadFile: (filePath, fileFilter) => {
    const storage = multer.diskStorage({
      destination: filePath,
      filename: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        ext = ext.length > 2 ? ext : '.'.concat(mime.extension(file.mimetype));
        let filename = randomFileName(32).concat(ext);
        cb(null, filename);
      }
    });
    return multer({ storage: storage, fileFilter: fileFilter });
  },
  unlinkFile: (filePath, fileName, cb) => {
    if(!(cb instanceof Function)) {
      const typeError = new TypeError('Invalid callback argument');
      cb(typeError, null);
    }
    const fullPath = path.join(filePath, fileName);
    fs.stat(fullPath, (err, stats) => {
      if(err) return cb(err, null);
      if(!stats.isFile()) return cb(new TypeError(`There is no such file: ${fileName}`), null);
      fs.unlink(fullPath, (err) => {
        if(err) {
          err.fullPath = fullPath;
          return cb(err, null);
        }
        console.log(`File: ${fullPath} succesfully unlinked.`);
        return cb(null, true);
      });
    });
  }
}

module.exports = helper;
