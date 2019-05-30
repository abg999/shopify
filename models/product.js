var mongoose=  require("mongoose");

var productSchema=new mongoose.Schema({
	modelname:String,
	price: Number,
	color: String,
	ram: String,
	storage:String,
	type:String,
	description:String,
	inthebox:String,
	modelnumber:String,
	Simtype:String,
	otgcompatible: String,
	image1:String,
	image2:String,
	image3:String,
	display:String,
	resolution:String,
	gpu:String,
	os:String,
	processor:String,
	processorcore:String,
	clockspeed:String,
	expandablestorage:String,
	primarycamera:String,
	secondarycamera:String,
	flash:String,
	nwtype:String,
	internetconnectivity:String,
	microusbport:String,
	bluetoothver:String,
	audiojack:String,
	sensors:String,
	battery:String,
	width:String,
	height:String,
	depth: String,
	weight:String,
	comments:[
	{
		type: mongoose.Schema.Types.ObjectId,
		ref:"Comment"
	}
	]
});

module.exports = mongoose.model("Product",productSchema);


