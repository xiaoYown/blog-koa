/*
 * Version: 1.0.0
 * Author: xioYown 
 * Updated: 2018-02-24 22:57:38
*/
// editor 控制
var editor = {
  el: null,
  md: '',
  add: function(options){
    /**
     * el element editor元素
     */
    var wrap = document.createElement('div');
    wrap.setAttribute('id', 'md-wrap');
    document.getElementById(options.el).appendChild(wrap);
    this.el = editormd("md-wrap", {
      width: "90%",
      height: 800,
      markdown: this.md,
      syncScrolling : "single",
      path: "/static/js/editor/"
    });
  },
  rem: function () {
    this.md = '';
    this.el.editor.remove();
  },
  getMarkdown: function(){
    return this.el.getMarkdown();
  }
};
editor.add({
  el: 'md-add'
})
// add
function add(){
  var type = document.getElementById('type').value,
    title = document.getElementById('add-title').value,
    description = document.getElementById('description').value,
    tipsEls = document.querySelectorAll('[data-tip]'),
    tips = ''
  
  if( !type || !title) {
    console.log('请将信息输入完整');
    return
  }
  for (var i = 0, len = tipsEls.length; i < len; i++) {
    tips += tipsEls[i].getAttribute('data-tip') + (i < len -1 ? '--' : '')
  }
  var data = {
    type: type,
    title: title,
    tips: tips,
    description: description,
    content: editor.getMarkdown(),
  };

  $.ajax({
    url: '/admin/add',
    type: 'POST',
    dataType: 'JSON',
    data: data,
    success: function(res){
      if( res.code == '000000' ){
        editor.rem();
        window.location.href = '/admin';
      } else {
        alert(res.message)
      }
    },
    error: function(status){
      console.log(status)
    }
  });
}

document.getElementById('add').addEventListener('click', add)

// 标签
function Tips (param) {
  this.el = document.getElementById(param.id)
  this.addEl = document.getElementById('tips-add')
  this.fillEl = document.getElementById('tips-fill')

  var list = param.str.split('--')
  if (list.length > 1 || list[1] !== '') {
    this.list = list
  }
}

Tips.prototype = {
  el: null,
  addEl: null,
  fillEl: null,
  isShowAdd: false,
  list: [],
  init: function () {
    this.initMethods()

    this.add(this.list)

    // 显示输入事件
    this.addEl.addEventListener('click', this.showAdd)
    // 关闭输入事件
    this.fillEl.addEventListener('blur', this.close)
  },
  initMethods: function () {
    function bind (fn, ctx) {
      return function (a) {
        var l = arguments.length
        return l
            ? l > 1
            ? fn.apply(ctx, arguments)
            : fn.call(ctx, a)
            : fn.call(ctx)
      }
    }
    for (var key in this) {
      if (typeof this[key] === 'function') {
        this[key] = bind(this[key], this)
      }
    }
  },
  close: function () {
    this.showAdd(false)
  },
  showAdd: function (bool) {
    if (bool === false) {
      this.fillEl.className = this.fillEl.className.replace(/\sshow/, '')
      this.add([this.fillEl.value])
      this.fillEl.value = ''
    } else {
      this.fillEl.className += ' show'
    }
  },
  add: function (_tips) {
    var frame = document.createDocumentFragment(), li = null, span = null

    for (var i = 0, len = _tips.length; i < len; i++) {
      if (_tips[i] === '') continue

      li = document.createElement('li')
      li.className = 'admin__add-tips_item'
      li.setAttribute('data-tip', _tips[i])
      li.innerHTML = _tips[i]

      span = document.createElement('span')
      span.className = 'del'
      span.setAttribute('onclick', 'delTip("' + _tips[i] + '")')
      span.innerHTML = 'del'
      
      li.appendChild(span)

      frame.appendChild(li)
    }
    if (li) {
      this.el.appendChild(frame)
    }
  },
  del: function (_tips) {
    var lis = this.el.querySelectorAll('[data-tip]')
    for (var i = 0, len = lis.length; i < len; i++) {
      if (_tips.indexOf(lis[i].getAttribute('data-tip')) > -1) {
        this.el.removeChild(lis[i])
      }
    }
  },
  destroy: function () {
    this.addEl.removeEventListener('click', this.showAdd)
    this.el.parentNode.removeChild(this.el)
    this.el = null
    this.addEl = null
  }
}

var tips = new Tips ({
  str: '',
  id: 'tips-wrap'
})

tips.init()

function delTip (tip) {
  tips.del([tip])
}
