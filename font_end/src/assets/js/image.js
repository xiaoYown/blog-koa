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
