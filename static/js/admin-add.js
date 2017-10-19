/*
 * Version: 1.0.0
 * Author: xioYown 
 * Updated: 2017-10-19 10:35:59
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
editor.add({
    el: 'md-add'
})
// add
function add(){
    var type = document.getElementById('type').value,
        title = document.getElementById('add-title').value;

    if( !type || !title) {
        console.log('请将信息输入完整');
        return
    }
    var data = {
        type: type,
        title: title,
        content: editor.getMarkdown(),
    };

    $.ajax({
        url: '/artical/add',
        type: 'POST',
        dataType: 'JSON',
        data: data,
        success: function(res){
            if( res.code == '000000' ){
                console.log(res);
                editor.rem();
                window.location.href = '/admin';
            }
        },
        error: function(status){
            console.log(status)
        }
    });
}

document.getElementById('add').addEventListener('click', add)
