/*
 * Version: 1.0.0
 * Author: xioYown 
 * Updated: 2019-08-22 22:47:31
*/
;(function () {
  var state = {
    title: document.querySelector('title').innerHTML,
    titleContent: ['o(╥﹏╥)o 去哪了', '(￣▽￣)ノ 回来啦!']
  };
  var elTitle = document.querySelector('title');

  document.addEventListener('visibilitychange', function (event) {
    if (document.hidden) {
      // if (elTitle.innerHTML.indexOf(state.titleContent) === -1) {
      //   state.title = elTitle.innerHTML;
      // }
      elTitle.innerHTML = state.titleContent[0];
    } else {
      elTitle.innerHTML = state.titleContent[1];
      setTimeout(function () {
        if (!document.hidden) {
          elTitle.innerHTML = state.title;
        }
      }, 2000)
    }
  });
})()