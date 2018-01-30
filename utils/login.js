let login = {
  isLogin: async (ctx, next) => {
    if (!ctx.session.user_id) {
      if (ctx.request.method === 'GET') {
        ctx.redirect( '/login' );
      } else {
        ctx.body = {
          code: 1,
          success: 'fail',
          message: 'no right'
        }
      }
    } else {
      await next();
    }
  }
}

module.exports = login;
