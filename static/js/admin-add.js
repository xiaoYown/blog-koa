/*
 * Version: 1.0.0
 * Author: xioYown 
 * Updated: 2017-10-27 17:58:28
*/
function add(){var e=document.getElementById("type").value,t=document.getElementById("add-title").value,d=document.getElementById("description").value;if(!e||!t)return void console.log("请将信息输入完整");var n={type:e,title:t,description:d,content:editor.getMarkdown()};$.ajax({url:"/admin/add",type:"POST",dataType:"JSON",data:n,success:function(e){"000000"==e.code&&(console.log(e),editor.rem(),window.location.href="/admin")},error:function(e){console.log(e)}})}var editor={el:null,md:"",add:function(e){var t=document.createElement("div");t.setAttribute("id","md-wrap"),document.getElementById(e.el).appendChild(t),this.el=editormd("md-wrap",{width:"90%",height:800,markdown:this.md,syncScrolling:"single",path:"/static/js/editor/"})},rem:function(){this.md="",this.el.editor.remove()},getMarkdown:function(){return this.el.getMarkdown()}};editor.add({el:"md-add"}),document.getElementById("add").addEventListener("click",add);