module.exports.isLoggedIn=(req,res,next)=>{
    if(req.session.userId){
        next()
    }else{
        res.redirect('/')
    }
}

module.exports.isLogin=(req,res,next)=>{
    if(req.session.userId){
        res.redirect('/userDashboard')
    }else{
        next()
    }
}