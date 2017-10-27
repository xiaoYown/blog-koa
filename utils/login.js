let login = {
    isLogin: function *( next ){
        if( !this.session.user_id )
            return this.redirect( '/login' );
        else
            yield next;
    }
}

module.exports = login;
