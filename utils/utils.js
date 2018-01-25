const fs = require('fs');
/* 判断文件是否存在 */
exports.fileExists = function (filePath) {
  return new Promise(function (resolve, reject) {
    fs.exists(filePath, function (exists) {
      resolve(exists);
    })
  })
}
/* 读文件 */
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
/* 写文件 */
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
/* 修改文件 */
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
/* 删除文件 */
exports.fileRem = function (fileName, ct) {
  return new Promise(function (resolve, reject) {
    fs.unlink(fileName, function (err) {
      if (err) console.log(err);
    })
  })
}
/* 读取目录 */
exports.dirRead = function (folderPath) {
  return new Promise(function (resolve, reject) {
    fs.readdir(folderPath, function (err, files) {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    })
  })
}
