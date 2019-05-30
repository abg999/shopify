var mongoose = require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var consumerSchema= new mongoose.Schema({
	username: String,
	password:String,
	googleid: String
});

consumerSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Consumer",consumerSchema);
