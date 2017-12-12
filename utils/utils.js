const fs = require('fs');

exports.fileExists = function (filePath) {
  return new Promise(function (resolve, reject) {
    fs.exists(filePath, function (exists) {
      resolve(exists);
    })
  })
}

exports.fileRead = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    })
  })
}

exports.fileWrite = function (fileName, ct, encode = 'utf-8') {
  return new Promise(function (resolve, reject) {
    fs.writeFile(fileName, ct, encode, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

exports.filePut = function (fileName, ct) {
  return new Promise(function (resolve, reject) {
    fs.write(fileName, ct, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

exports.fileRem = function (fileName, ct) {
  return new Promise(function (resolve, reject) {
    fs.unlink(fileName, function (err) {
      if (err) console.log(err);
    })
  })
}
