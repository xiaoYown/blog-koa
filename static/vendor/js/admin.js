/*
 * Version: 1.0.0
 * Author: xioYown 
 * Updated: 2017-12-12 18:02:41
*/
function getBlogList() {
    $.ajax({
        url: '/list/articals',
        type: 'GET',
        dataType: 'JSON',
        data: {},
        success: function (res) {
            if( res.code == '000000' ){
                var artical_list = res.data;
                var list = '',
                    time = '';
                for( var i = 0, len = artical_list.length; i < len; i++ ){
                    list += '<tr ' + (artical_list[i].top ? 'class="artical-top"' : '') + '>' +
                        '<td>' + artical_list[i].title + '</td>' +
                        '<td>' + artical_list[i].type + '</td>' +
                        '<td>' + artical_list[i].create_time + '</td>' +
                        '<td>' + artical_list[i].update_time + '</td>' +
                        '<td><span blog-put="' + artical_list[i].id + '">编辑</span>' +
                        '<span blog-del=' + artical_list[i].id + ' >删除</span>' +
                        ('<span blog-top=' + artical_list[i].id + ' >' + (artical_list[i].top ? '取消置顶' : '置顶') + '</span></td>') +
                        '</tr>';
                }
                document.getElementById('blog-list').innerHTML = list;

                var dels = document.querySelectorAll('[blog-del]'),
                    puts = document.querySelectorAll('[blog-put]'),
                    tops = document.querySelectorAll('[blog-top]');

                for( var i = 0, len = dels.length; i < len; i++ ){
                    // 删除
                    dels[i].onclick = del;
                    // 编辑
                    puts[i].onclick = get;
                    // 置顶
                    tops[i].onclick = toTop;
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
function del () {
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
// 编辑
function get () {
    window.location.href = '/admin/mod/' + this.getAttribute('blog-put')
}
// 置顶
function toTop () {
    let id = this.textContent === '置顶' ? this.getAttribute('blog-top') : 'cancel-top'
    $.ajax({
        url: '/admin/top/' + id,
        type: 'POST',
        dataType: 'JSON',
        data: {},
        success: function(res){
            window.location.reload()
        },
        error: function(status){
            console.log(status)
        }
    });
}