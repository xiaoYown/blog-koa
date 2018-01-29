const fs = require('fs');
const imageConfig = require('../config/image_config');

// 设置 json 文件目录 新文件夹属性
function setAddFolder (tree, dir, name) {
  if (dir.length > 0) {
    setAddFolder(tree.folders[dir[0]], dir.slice(1), name);
    // for (let i = 0, len = tree.folders.length; i < len; i++) {
    //   if (tree.folders[i].name === tree.folders[dir[0]].name) {
    //     setAddFolder(tree.folders[i], dir.slice(1), name);
    //     break;
    //   }
    // }
  } else {
    tree.folders.push({
      "type": "folder",
      "name": name,
      "folders": []
    })
  }
}
// 获取文件夹树形结构
exports.getFolderTree = function () {
  return new Promise(function (resolve, reject) {
    fs.stat(imageConfig.folders_root, function (err) {
      if (err) {
        fs.mkdir(imageConfig.folders_root, function () {
            const folderTree = {
              name: 'root',
              folders: []
            };
            resolve(folderTree);
            fs.writeFileSync(imageConfig.folders_path, JSON.stringify(folderTree), 'utf-8')
        })
      } else {
        fs.readFile(imageConfig.folders_path, function (err, data) {
          if (err) {
            console.log(err)
          } else {
            resolve(JSON.parse(data.toString()));
          }
        })
      }
    })
  })
}
// 添加文件夹
exports.addFolder = function (tree, dir, name) {
  setAddFolder(tree, dir, name)
  fs.writeFileSync(imageConfig.folders_path, JSON.stringify(tree), 'utf-8')
  return new Promise(function (resolve, reject) {
    fs.readFile(imageConfig.folders_path, function (err, data) {
      resolve(data)
    })
  })
}
// 删除 json 文件目录 文件夹属性
function setDelFolder (tree, dir, indexs) {
  if (dir.length > 0) {
    setDelFolder(tree.folders[dir[0]], dir.slice(1), indexs);
  } else {
    for (let i = indexs.length - 1; i >= 0; i--) {
      tree.folders.splice(indexs[i], 1);
    }
  }
}
// 删除文件夹
exports.delFolder = function (tree, dir, indexs) {
  setDelFolder(tree, dir, indexs)
  fs.writeFileSync(imageConfig.folders_path, JSON.stringify(tree), 'utf-8')
  return new Promise(function (resolve, reject) {
    fs.readFile(imageConfig.folders_path, function (err, data) {
      resolve(data)
    })
  })
}
// 获取当前文件夹下目录 tree ---- root 结构树; dir ---- 序号链
exports.getDirs = function (tree, dir) {
  if (dir.length > 0) {
    let index
    for (let i = 0, len = tree.folders.length; i < len; i++) {
      if (tree.folders[i].name === tree.folders[dir[0]].name) {
        return exports.getDirs(tree.folders[i], dir.slice(1));
        break;
      }
    }
    return exports.getDirs(tree.folders[dir[0]], dir.slice(1))
  } else {
    return tree.folders
  }
}
