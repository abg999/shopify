var express		=	require("express"),
	app			=	express(),
	bodyParser  =	require("body-parser"),
	mongoose	=  	require("mongoose"),
	passport    =	require("passport"),
	LocalStrategy=	require("passport-local"),
	GoogleStrategy=	require("passport-google-oauth20"),
	methodOverride=require("method-override"),
	Comment     =	require("./models/comment"),
	Product     =	require("./models/product"),
	Order		=	require("./models/order"),
	User		=	require("./models/user"),
	
	seedDB      =	require("./seeds"),
	session     =	require("express-session"),
	MongoStore	= 	require("connect-mongo")(session),
	Cart 		= 	require("./models/cart"),
	flash		=	require("connect-flash");

const Consumer	=	require("./models/googleuser");
app.locals.moment = require('moment');
var authRoutes=require("./routes/auth-routes");
const keys=require("./config/keys");

var middleware=require("./middleware/index.js");

var emailid;
 // seedDB();
mongoose.connect("mongodb://localhost/3dots");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

app.use(methodOverride("_method"));//Tells node to look for pattern _method in url for eg "_method=PUT" 
app.use(flash());


//PASSPORT CONFIGURATION

app.use(session({
	secret: "Hello darkness my old friend",/*using this key password gets hashed in db*/
	resave:false,
	saveUninitialized: false,
	store: new MongoStore({mongooseConnection: mongoose.connection}),
	cookie:{ maxAge: 2*60 * 1000 }//max age set for 2	min
}));




app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Consumer.authenticate()));

// passport.serializeUser(User.serializeUser());
 // passport.deserializeUser(User.deserializeUser());


passport.serializeUser((user,done)=>{
	done(null,user.id);
});



passport.deserializeUser((id,done)=>{

	Consumer.findById(id).then((user) => {
		 done(null,user);
	})		
	
});

passport.use(
	new GoogleStrategy({
	//options for the google strategty
	callbackURL:"/auth/google/redirect",
	clientID:keys.google.clientID,
	clientSecret:keys.google.clientSecret

},(accessToken,refreshToken,profile,done)=>{
		//passport callback function
		//check if user already exists in db
		Consumer.findOne({googleid: profile.id}).then((currentUser)=>{
			if(currentUser){
				//already user present in db
				console.log("user already present")
				done(null,currentUser);
				console.log(typeof(profile.emails[0].value));
				console.log(profile.emails[0].value);
				emailid=profile.emails[0].value;
			} else {
				//if not present in db create new user
				new Consumer({
				username:profile.displayName,
				googleid:profile.id
			}).save().then((newUser) => {
				console.log("new user was created" + newUser);
				console.log(typeof(profile.emails[0].value));
				console.log(profile.emails[0].value);
				emailid=profile.emails[0].value;
				done(null,newUser);
			}) 

		

			}
		})

	
	})
)


app.use(function(req,res,next){//this is a middleware whatever function we provide to it will be called on every route defined so here we are passing req.user which contains username and id of logged in user 
	res.locals.currentUser=req.user;//whatever we put inside res.input is availaible inside template
	res.locals.session=req.session;	
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");	
	next();//imp as it will continue to next routehandler
});

app.use("/auth",authRoutes)



app.get("/",function(req,res){
	var a;
	var successMsg= req.flash('success')[0];

	Product.aggregate([{$group: {_id: "$type"}}],function(err,alltypes){
		if(err){
		}
		else{
			var query=Product.find({type: "mobile"}).limit(6)
			query.exec(function(err,mobile){
				if(err){
					console.log(err)
				}
				else{
					Product.find({type: "watch"},function(err,watch){
						if(err)
						{
							console.log(err);
						}
						else{
							res.render("landing",{type: alltypes,mobile: mobile,watch: watch,successMsg:successMsg, noMessage: !successMsg,message:req.flash("success")});
						}
					})
						
				}
			})
		}
	})
});



app.get("/mobile",function(req,res){
		Product.find({type:"mobile"},function(err,mobile){
			if(err){
				console.log(err);
			}
			else{{
				res.render("mobile",{mobile: mobile,count:mobile.length});
				}
			}
		});
});

//****
//Search Route
//****
app.get("/products",function(req,res){
	if(req.query.search){
		 const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		 
		Product.find({ $or:[{modelname: regex},{type: regex},{ram: regex}]},function(err,product){
		if(err){
			console.log(err);
		}
		else{
			res.render("search",{products:product,count:product.length});
		}
	})
		
	} else{
		Product.find({},function(err,product){
		if(err){
			console.log(err);
		}
		else{
			res.render("search",{products:product,count:product.length});
		}
	}) 

	}
	
})

//****************
//Comments routes
//****************
app.get("/:id/comments/new",middleware.isLoggedIn,function(req,res){
	//find product by id
	Product.findById(req.params.id,function(err,founditem){
		if(err){
			console.log(err);
		} else{
			res.render("comments/new", {founditem: founditem});

		}
	});
});

//EDIT COMMENT ROUTE
app.get("/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req, res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.render("/mobile")
		}else{
			res.render("comments/edit",{product_id: req.params.id,comment: foundComment});
		}
		
	 });
});
//Editing comment
app.put("/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/"+req.params.id)
		}
	});
});

app.post("/:id/comments",middleware.isLoggedIn,function(req,res){//here isLoggedIn middleware function is added so that user cannot post comment explictly sending a post request using an application like POSTMAN
	//lookup product using Id
	Product.findById(req.params.id, function(err, founditem){
		if(err){
			console.log(err);
			res.redirect("/mobile")
		}else{

			Comment.create(req.body.comment, function(err, comment){//create new comment
				if(err){
					console.log(err);
				}else{
					//add username  and id to comment
					comment.author.id=req.user._id
					comment.author.username=req.user.username;
					//save comment
					comment.save()
					founditem.comments.push(comment);
					founditem.save();
					res.redirect("/"+req.params.id);
				}
			})	
		}

	});
});


//deleting comment
app.delete("/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("/");
		}else{
			res.redirect("/"+req.params.id);
		}
	});
});



//**********************************
//login logout and register routes
//**********************************
app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	var newUser=new Consumer({username: req.body.username});
	if(req.body.password!==req.body.confirmpassword){
		return res.render("register");
	}
	Consumer.register(newUser, req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/");
		})
	});
});



//logout route
app.get("/logout",function(req,res){
	req.session.destroy(function(e){
        req.logout();
        res.redirect('https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000/');
    });
  });



//handling login
app.post("/login",passport.authenticate("local",//passport.authenticate is middle ware which calls authenticate method which matches from db
	{
		successRedirect:"/",//sucess redirect will lead to home page
		failureRedirect:"https://www.google.com"//failiure redirect will lead to google.com
	}),function(req,res){

});






//************
//CART Routes
//************

app.get("/add-to-cart/:id",function(req,res,next){
	var productId = req.params.id;
	var cart=new Cart(req.session.cart ? req.session.cart : {items: {}});

	Product.findById(productId,function(err, product){
		if(err){
			return res.redirect("/");
		}
		cart.add(product, product.id);
		req.session.cart=cart;
		console.log(req.session.cart);
		res.redirect("/");
	});

});
app.get("/reduceone/:id",function(req,res,next){
	var productId = req.params.id;
	var cart=new Cart(req.session.cart ? req.session.cart : {items: {}});

	cart.reduceone(productId);
	req.session.cart=cart;
	res.redirect("/shopping-cart");
})


app.get("/shopping-cart",function(req,res){
	if(!req.session.cart){
		return res.render("shopping-cart",{products: null});
	}
	var cart=new Cart(req.session.cart);


	res.render("shopping-cart",{products: cart.generateArray(),totalPrice:cart.totalPrice});
});


app.get("/checkout",middleware.isLoggedIn,function(req,res,next){
	if(!req.session.cart){//if there is no shopping cart and users enters the /checkout in url
		return res.redirect("/shopping-cart");
	}
	var cart= new Cart(req.session.cart); 
	var errMsg=req.flash('error')[0];
	res.render("checkout",{total:cart.totalPrice, errMsg:errMsg, noError: !errMsg});
});

app.post("/checkout", middleware.isLoggedIn,function(req,res,next){
	if(!req.session.cart){//if there is no shopping cart and users enters the /checkout in url
		return res.redirect("/shopping-cart");
	}
	var cart=new Cart(req.session.cart);
var stripe = require("stripe")(
  "sk_test_VJFoIj5Lhf5uKz5Ds634Iwxa");

stripe.charges.create({
  amount: cart.totalPrice*100,
  currency: "inr",
  source: req.body.stripeToken, // obtained with Stripe.js
  description: "Test Charge",
  receipt_email: 'ashishgangaramani@gmail.com',
}, function(err, charge) {
	if(err){
		return res.redirect("/");
	}
	var order=new Order({
		user: req.user,
		cart: cart,
		address: req.body.address,
		name:  req.body.name,
		paymentId: charge.id

	});
	order.save(function(err,result){
		req.flash("success","success");
		req.session.cart=null;
		console.log(emailid)
		res.redirect("/")
	});
  // asynchronously called
});


});

app.get("/profile",middleware.isLoggedIn,function(req,res,next) {
	Order.find({user: req.user},function(err, orders) {
		if(err){
			return res.write("error");
		}
		var cart;
		orders.forEach(function(order){
			cart = new Cart(order.cart);
			order.items=cart.generateArray();
		});
		res.render("user/profile",{orders:orders});

	})
	
});

app.get("/admin/newproduct",function(req,res,next){
	res.render("newproduct");
});



//route to find product from db and display contents **this route should be at last** because :id
app.get("/:id", function(req, res){
	Product.findById(req.params.id).populate("comments").exec(function(err,founditem){
		if(err){
			console.log(err)
		}
		else{
			res.render("show",{founditem:founditem})
		}
	});
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

var server=app.listen(process.env.PORT||3000,process.env.IP,function(){//this specifies server will run on port number 3000
	console.log("Server started");
});
