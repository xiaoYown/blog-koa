/*
 * Version: 1.0.0
 * Author: xioYown 
 * Updated: 2017-10-26 11:18:13
*/
function getBlogList() {
    $.ajax({
        url: '/list/articals',
        type: 'GET',
        dataType: 'JSON',
        data: {},
        success: function(res){
            if( res.code == '000000' ){
                var artical_list = res.data;
                var list = '',
                    time = '';
                for( var i = 0, len = artical_list.length; i < len; i++ ){
                    list += '<tr>' +
                        '<td>' + artical_list[i].title + '</td>' +
                        '<td>' + artical_list[i].type + '</td>' +
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
getBlogList()
/* 操作 */
// del
function del(){
    var _this = this;
    $.ajax({
        url: '/admin/del/' + this.getAttribute('blog-del'),
        type: 'POST',
        dataType: 'JSON',
        data: {},
        success: function(res){
            var tr = _this.parentNode.parentNode;
            tr.parentNode.removeChild(tr);
        },
        error: function(status){
            console.log(status)
        }
    });
}
// get
function get(){
    window.location.href = '/admin/mod/' + this.getAttribute('blog-put')
}

// put
function put(){
    var data = {
        id: state.id,
        content: editor.getMarkdown(),
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