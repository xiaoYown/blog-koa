var router = [
    {
        path: '/',
        cb: 'index'
    },{
        path: '/edit',
        cb: 'edit'
    },{
        path: '/blog',
        cb: 'blog'
    }
];
var state = {
    id: ''
};
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
            width   : "90%",
            height  : 640,
            markdown: this.md,
            syncScrolling : "single",
            path    : "../static/js/editor/"
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

var views = {
    index: function(){

    },
    edit: function(){
        document.getElementById('post-add').style.display = 'inline-block';
        document.getElementById('post-put').style.display = 'none';
        editor.add({
            el: 'md-add',
        });
    },
    blog: function(){
        $.ajax({
            url: '/list/blog',
            type: 'GET',
            dataType: 'JSON',
            data: {},
            success: function(res){
                if( res.code == '000000' ){
                    var artical_list = res.data;
                    var list = '',
                        time = '';
                    for( var i = 0, len = artical_list.length; i < len; i++ ){
                        // time = artical_list[i].create_time.replace(/(T|\.000Z)/g, function(str){
                        // 	if( str === 'T' )
                        // 		return '&nbsp;&nbsp;';
                        // 	else
                        // 		return '';
                        // });
                        list += '<tr>' +
                            '<td>' + artical_list[i].title + '</td>' +
                            '<td>' + artical_list[i].type_name_NO01 + '</td>' +
                            '<td>' + artical_list[i].type_name_NO02 + '</td>' +
                            '<td>' + artical_list[i].type_name_NO03 + '</td>' +
                            '<td>' + artical_list[i].create_time + '</td>' +
                            '<td>' + artical_list[i].update_time + '</td>' +
                            '<td><span blog-put="' + artical_list[i].id + '">编辑</span><span blog-del=' + artical_list[i].id + ' >删除</span></td>' +
                            '</tr>';
                    }
                    document.getElementById('blog-list').innerHTML = list;

                    var dels = document.querySelectorAll('[blog-del]'),
                        puts = document.querySelectorAll('[blog-put]');

                    // 删除
                    for( var i = 0, len = dels.length; i < len; i++ ){
                        dels[i].onclick = del;
                    }
                    // 编辑
                    for( var i = 0, len = puts.length; i < len; i++ ){
                        puts[i].onclick = get;
                    }
                }
            },
            error: function(status){
                console.log(status)
            }
        });
    }
};
// viewport change
function viewChange(hash){

    var path = location.hash.substring(1);
    let view_ports = document.querySelectorAll('li[view-port]');
    
    if( !path ){
        path = '/';
    }
    // 编辑离开路由清理记录
    if( !!hash )
        console.log(hash.oldURL)
    if( !!hash && !!hash.oldURL.match(/#\/(.+)/) && (hash.oldURL.match(/#\/(.+)/)[1] === 'edit') ){
        editor.rem();
    }
    for( var i = 0, len = view_ports.length; i < len; i++ ){
        if( path == view_ports[i].getAttribute('view-port') ){
            view_ports[i].style.display = 'block';
        } else {
            view_ports[i].style.display = 'none';
        }
    }
    for( var i = 0, len = router.length; i < len; i++ ){
        if( router[i].path == path ){
            if( path !== '/' ){
                views[path.substring(1)]();
            } else {
                views.index();
            }
            break;
        }
    }
}

window.addEventListener('hashchange', viewChange);

viewChange();

/* 操作 */
// del
function del(){
    var _this = this;
    var data = {
        id: this.getAttribute('blog-del')
    };
    $.ajax({
        url: '/artical/del',
        type: 'POST',
        dataType: 'JSON',
        data: data,
        success: function(res){
            console.log(res)
            var tr = _this.parentNode.parentNode;
            tr.parentNode.removeChild(tr);
        },
        error: function(){

        }
    });
}
// get
function get(){
    var data = {
        id: this.getAttribute('blog-put')
    };
    state.id = data.id;
    $.ajax({
        url: '/artical/get',
        type: 'POST',
        dataType: 'JSON',
        data: data,
        success: function(res){
            console.log(res.data.content)
            if( res.code == '000000' ){
                editor.md = res.data.content;
                window.location.href = '#/edit';
                setTimeout(function(){
                    document.getElementById('post-add').style.display = 'none';
                    document.getElementById('post-put').style.display = 'inline-block';
                }, 10);
            }
        },
        error: function(status){
            console.log(status)
        }
    });
}
// add
function add(){
    var type_NO01 = document.getElementById('type_NO01').value,
        type_NO02 = document.getElementById('type_NO02').value,
        type_NO03 = document.getElementById('type_NO03').value,
        title     = document.getElementById('add-title').value;

    if( !type_NO01 || !type_NO02 || !type_NO03 || !title) {
        console.log('请将信息输入完整');
        return
    }
    var data = {
        type_NO01: type_NO01,
        type_NO02: type_NO02,
        type_NO03: type_NO03,
        title: title,
        content:   editor.getMarkdown(),
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
                window.location.href = '#/blog';
            }
        },
        error: function(status){
            console.log(status)
        }
    });

}
// put
function put(){
    var data = {
        id: state.id,
        content:   editor.getMarkdown(),
    };

    $.ajax({
        url: '/artical/put',
        type: 'POST',
        dataType: 'JSON',
        data: data,
        success: function(res){
            if( res.code == '000000' ){
                console.log(res);
                editor.rem();
                window.location.href = '#/blog';
            }
        },
        error: function(status){
            console.log(status)
        }
    });

}
document.getElementById('post-add').addEventListener('click', add);
document.getElementById('post-put').addEventListener('click', put);