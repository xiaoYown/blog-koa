/*
 * Version: 1.0.0
 * Author: xioYown 
 * Updated: 2018-04-15 21:33:03
*/
// 文件夹跳转
function linkFolder (index) {
  let pathname = location.pathname
  if (pathname === '/image') {
    pathname += '/' + index;
  } else {
    pathname += '_' + index;
  }
  window.location = pathname;
}

/* 添加文件夹 */

// 添加文件夹请求
function postAddFolder (name) {
  $.ajax({
    url: '/image/addfolder',
    method: 'POST',
    dataType: 'JSON',
    data: {
      name: name,
      dir: location.pathname.replace(/^\/image\/{0,1}/, '')
    },
    success: function (res) {
      if (res.code === 0) {
        location.reload();
      } else {
        console.log(res);
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}
// 添加文件夹
function addFolder () {
  var folder = prompt('请输入文件夹名称', '');
  if (folder === '') {
    alert('请输入文件名!')
  } else if (folder !== null) {
    postAddFolder(folder);
  }
}

document.getElementById('add-folder').addEventListener('click', addFolder);

/* 删除文件 */

// 删除文件夹请求
function postDelFolder (indexs) {
  $.ajax({
    url: '/image/delfolder',
    method: 'POST',
    dataType: 'JSON',
    data: {
      indexs: indexs,
      dir: location.pathname.replace(/^\/image\/{0,1}/, '')
    },
    success: function (res) {
      if (res.code === 0) {
        location.reload();
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}
// 删除文件夹
function delFolder () {
  var area = $('#edit-area');
  var checkboxs = area.find('input');
  var checked = [];
  for (var i = 0, len = checkboxs.length; i < len; i++) {
    if (checkboxs[i].checked) {
      checked.push($(checkboxs[i]).attr('data-index'));
    }
  }
  var folder = confirm('确认删除');
  if (folder) {
    postDelFolder(checked);
  }
}
// 编辑状态切换
function editStatus () {
  let area = $('#edit-area');
  if (area.hasClass('editting')) {
    area.removeClass('editting');
    this.textContent = '编辑';
  } else {
    area.addClass('editting');
    this.textContent = '退出编辑';
  }
}

document.getElementById('edit').addEventListener('click', editStatus);
document.getElementById('del').addEventListener('click', delFolder);

/* 上传图片 */
var xTool = {};

/**
 * @param file.file 		-- ele for file input
 * @param file.progress 	-- ele for progress length show
 * @param file.progressNum  -- ele for progress number show
 * @param file.api 			-- file upload url
 * @param file.apiKey 		-- key word for api key name
 * @cb    file.success 		-- callback for success
 * @cb    file.fail 		-- callback for fail
 */
xTool.uploadImg = function(fileInfo){
  var xhr = new XMLHttpRequest();  
    
  xhr.onreadystatechange = function(){  
    if(xhr.readyState == 4)  {  
      if(xhr.status ==200 || xhr.status == 304)  {  
        var respon = JSON.parse(xhr.responseText);  
        if(respon.success == "success")  {  
          if (!!fileInfo.success) {
            fileInfo.success(JSON.parse(xhr.response));
          }
        } else if (respon.success == "no_file"){  
          if (!!fileInfo.fail) {
            fileInfo.fail(xhr);
          }
        } else {  
          if (!!fileInfo.fail) {
            fileInfo.fail(xhr);
          }
        }  
      }  
      else  {  
        alert("Request was unsuccessful:" + xhr.status);
      }  
    }  
  }

  xhr.upload.onprogress = function (evt) {
    if (evt.lengthComputable) {
      var percentComplete = Math.round(evt.loaded * 100 / evt.total);
      fileInfo.progress.style.width = percentComplete + '%';
      fileInfo.progressNum.innerHTML = percentComplete + '%';
    }
  };
  
  var files = document.getElementById('files').files;  
  
  if (!files.length) {  
    alert('Please select a file!');  
    return;  
  }  
  var file = files[0];
  
  var form = new FormData();  
  form.append(fileInfo.apiKey, file);
  if (fileInfo.params && typeof fileInfo.params === 'object') {
    for (var key in fileInfo.params) {
      form.append(key, fileInfo.params[key]);
    }
  }
  form.append("acttime", new Date().valueOf()); 
  xhr.open("post", fileInfo.api, true);  
  xhr.send(form);
}

function uploadImg () {
  xTool.uploadImg({
    file: document.getElementById('files'),
    progress: document.getElementById('progress'),
    progressNum: document.getElementById('progressNumber'),
    api: '/image/uploadimg?url=' + location.pathname.replace(/^\/image\/{0,1}/, ''),
    apiKey: 'infile',
    params: {
      url: location.pathname.replace(/^\/image\/{0,1}/, '')
    },
    success: function (res) {
      location.reload();
    },
    fail: function () {
      console.log('upload fail')
    }
  });
}

document.getElementById('files').addEventListener('change', uploadImg);

/* 复制图片链接 */
function copySrc () {
  this.previousElementSibling.select();
  document.execCommand("copy");
}

var copyEles = document.querySelectorAll('[src-copy]');

for (var i = 0, len = copyEles.length; i < len; i++) {
  copyEles[i].addEventListener('click', copySrc);
}
