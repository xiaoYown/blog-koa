/*
 * Version: 1.0.0
 * Author: xioYown 
 * Updated: 2017-10-31 19:00:31
*/
function add(){var t=document.getElementById("type").value,e=document.getElementById("add-title").value,i=document.getElementById("description").value,l=document.querySelectorAll("[data-tip]"),d="";if(!t||!e)return void console.log("请将信息输入完整");for(var n=0,s=l.length;n<s;n++)d+=l[n].getAttribute("data-tip")+(n<s-1?"--":"");var a={type:t,title:e,tips:d,description:i,content:editor.getMarkdown()};$.ajax({url:"/admin/add",type:"POST",dataType:"JSON",data:a,success:function(t){"000000"==t.code&&(editor.rem(),window.location.href="/admin")},error:function(t){console.log(t)}})}function Tips(t){this.el=document.getElementById(t.id),this.addEl=document.getElementById("tips-add"),this.fillEl=document.getElementById("tips-fill");var e=t.str.split("--");(e.length>1||""!==e[1])&&(this.list=e)}function delTip(t){tips.del([t])}var editor={el:null,md:"",add:function(t){var e=document.createElement("div");e.setAttribute("id","md-wrap"),document.getElementById(t.el).appendChild(e),this.el=editormd("md-wrap",{width:"90%",height:800,markdown:this.md,syncScrolling:"single",path:"/static/js/editor/"})},rem:function(){this.md="",this.el.editor.remove()},getMarkdown:function(){return this.el.getMarkdown()}};editor.add({el:"md-add"}),document.getElementById("add").addEventListener("click",add),Tips.prototype={el:null,addEl:null,fillEl:null,isShowAdd:!1,list:[],init:function(){this.initMethods(),this.add(this.list),this.addEl.addEventListener("click",this.showAdd),this.fillEl.addEventListener("blur",this.close)},initMethods:function(){for(var t in this)"function"==typeof this[t]&&(this[t]=function(t,e){return function(i){var l=arguments.length;return l?l>1?t.apply(e,arguments):t.call(e,i):t.call(e)}}(this[t],this))},close:function(){this.showAdd(!1)},showAdd:function(t){!1===t?(this.fillEl.className=this.fillEl.className.replace(/\sshow/,""),this.add([this.fillEl.value]),this.fillEl.value=""):this.fillEl.className+=" show"},add:function(t){for(var e=document.createDocumentFragment(),i=null,l=null,d=0,n=t.length;d<n;d++)""!==t[d]&&(i=document.createElement("li"),i.className="admin__add-tips_item",i.setAttribute("data-tip",t[d]),i.innerHTML=t[d],l=document.createElement("span"),l.className="del",l.setAttribute("onclick",'delTip("'+t[d]+'")'),l.innerHTML="del",i.appendChild(l),e.appendChild(i));i&&this.el.appendChild(e)},del:function(t){for(var e=this.el.querySelectorAll("[data-tip]"),i=0,l=e.length;i<l;i++)t.indexOf(e[i].getAttribute("data-tip"))>-1&&this.el.removeChild(e[i])},destroy:function(){this.addEl.removeEventListener("click",this.showAdd),this.el.parentNode.removeChild(this.el),this.el=null,this.addEl=null}};var tips=new Tips({str:"",id:"tips-wrap"});tips.init();