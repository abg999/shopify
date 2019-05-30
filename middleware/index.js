var middlewareObj={};


var Comment     =   require("../models/comment");	
var	Product     =	require("../models/product");

//middle ware
middlewareObj.isLoggedIn=function(req,res,next){//this function simply just checks if user is logged in or not if yes then next() thing mostly a callback function is executed if not the user will be redirected to login page
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","you need to logged in");
	res.redirect("/auth/login");
}

middlewareObj.checkCommentOwnership=function(req,res,next){
	if(req.isAuthenticated()){
		
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
						
				res.redirect("/")


			} else{
				//does user own campground?
				if(foundComment.author.id.equals(req.user._id)){//=== could've simply used for comparision but foundCampground.author.id is mongoose object and req.author._id is string
						next();

				}else{//otherrwise redirect
					res.redirect("back")
				}
				
			}
	});
	}else {//if not,redirect
		
		res.redirect("back");
	}
		 

}



module.exports=middlewareObj