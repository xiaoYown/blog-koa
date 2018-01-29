let login = {
    isLogin: async (ctx, next) => {
        if (!ctx.session.user_id) {
            return ctx.redirect( '/login' );
        } else {
            await next();
        }
    }
}

module.exports = login;
