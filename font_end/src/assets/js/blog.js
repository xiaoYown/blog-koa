var blogList = document.getElementById('blog-list')
var blogs = blogList.querySelectorAll('.blog__wrap-list_title')

function move (method) {
  if (method === 'in') {
    blogList.className = blogList.className.replace(/\s+artical--animate-before/, ' artical--animate-in')
  } else if (method === 'out') {
    blogList.className = blogList.className.replace(/\s+artical--animate-in/, ' artical--animate-before')
  }
}

function link () {
  var href = this.getAttribute('data-href')
  move('out')
  setTimeout(function () {
    window.location.href = href
  }, 700)
}

move('in')

for (var i = 0, len = blogs.length; i < len; i++) {
  blogs[i].addEventListener('click', link)
}