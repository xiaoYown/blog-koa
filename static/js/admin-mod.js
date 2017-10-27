/*
 * Version: 1.0.0
 * Author: xioYown 
 * Updated: 2017-10-26 18:10:00
*/
// editor 
// var editor = null;
/**
 * md String content
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
  rem: function(){
      this.md = '';
      this.el.editor.remove();
  },
  getMarkdown: function(){
      return this.el.getMarkdown();
  }
};

$.ajax({
  url: '/artical/query/' + window.location.href.match(/mod\/([0-9a-zA-Z\-]+)/)[1],
  type: 'GET',
  dataType: 'JSON',
  success: function(res){
      if( res.code === 0 ){
          console.log(res);
          editor.md = res.data.artical.content
          editor.add({
            el: 'md-add'
          })
      }
  },
  error: function(status){
      console.log(status)
  }
})
// add
function update(){

  var type = document.getElementById('type').value,
      title = document.getElementById('add-title').value,
      description = document.getElementById('description').value

  if( !type || !title) {
      console.log('请将信息输入完整');
      return
  }
  var data = {
      type: type,
      title: title,
      description: description,
      content: editor.getMarkdown(),
  };

  $.ajax({
      url: '/admin/mod/' + window.location.href.match(/mod\/([0-9a-zA-Z\-]+)/)[1],
      type: 'POST',
      dataType: 'JSON',
      data: data,
      success: function(res){
          if( res.code == '000000' ){
              window.location.href = '/admin';
          }
      },
      error: function(status){
          console.log(status)
      }
  });
}

document.getElementById('mod').addEventListener('click', update)
