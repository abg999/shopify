var router=require("express").Router();
var passport=require("passport");

//auth login
router.get("/login",(req,res)=>{
	res.render("login");
});

//auth logout

//logout route
router.get("/logout",function(req,res){
	req.session.destroy(function(e){
        req.logout();
        res.redirect('https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000/');
    });
  });

//auth with google
router.get("/google",passport.authenticate('google',{
	scope:['profile','https://www.googleapis.com/auth/userinfo.email']
}));

router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
	res.redirect("http://localhost:3000/");
})

module.exports=router;