var mongoose    =require("mongoose");
var	Product     =require("./models/product");
var Comment     =require("./models/comment");

var data=[
		{
			modelname:"Redmi Note 5",
			price: 11999,
			color: "Gold",
			ram: "4GB",
			storage:"64GB",
			type:"mobile",
			description:"Meet the Redmi Note 5 - the elegantly designed smartphone that comes with a powerful 14 nm Snapdragon 625 processor. From capturing enchanting pictures with the rear camera and an amazing front camera, to watching videos and playing games on the FHD+ display, this smartphone ensures you never have a dull moment again.",
			inthebox:"Handset, Power Adapter, USB Data Cable, Ultra Thin Case, Warranty Card, Getting Started Guide, Pin",
			modelnumber:"MZB5917IN",
			Simtype:"Dual Sim",
			otgcompatible: "Yes",
			image1:"https://rukminim1.flixcart.com/image/832/832/jdkjzww0/mobile/d/y/b/redmi-note-5-mzb5917in-original-imaf2g8zwrmywhqq.jpeg?q=70",
			image2:"https://rukminim1.flixcart.com/image/832/832/jdkjzww0/mobile/f/w/5/redmi-note-5-mzb5913in-original-imaf2g8zhapfannn.jpeg?q=70",
			image3:"https://rukminim1.flixcart.com/image/832/832/jdkjzww0/mobile/d/y/b/redmi-note-5-mzb5917in-original-imaf2g8nzpcrsgqm.jpeg?q=70",
			display:"5.99 inch",
			resolution:"2160 x 1080 Pixels",
			gpu:"Adreno 506",
			os:"Android Nougat 7.1.2",
			processor:"Qualcomm Snapdragon 625",
			processorcore:"Octa Core",
			clockspeed:"2 GHZ",
			expandablestorage:"128 GB",
			primarycamera:"12MP",
			secondarycamera:"5MP",
			flash:"Rear and Front Flash",
			nwtype:"4G VOLTE, 4G, 3G",
			internetconnectivity:"4G, 3G, Wi-Fi",
			microusbport:"YES",
			bluetoothver:"4.2",
			audiojack:"3.5mm",
			sensors:"Fingerprint Scanner, Ambient Light Sensor, Proximity Sensor, E Compass, Accelerometer, Hall Sensor, Gyroscope",
			battery:"4000 mAh",
			width:"75.45 mm",
			height:"158.5 mm",
			depth: "8.05 mm",
			weight:"180g"
		},
		{	

			modelname:"Apple iPhone X",
			price: 85999,
			color:  "Space Gray",
			ram: "-",
			storage:"64GB",
			type:"mobile",
			description:"Meet the iPhone X - the device that’s so smart that it responds to a tap, your voice, and even a glance. Elegantly designed with a large 14.73 cm (5.8) Super Retina screen and a durable front-and-back glass, this smartphone is designed to impress. What’s more, you can charge this iPhone wirelessly. ",
			inthebox:"Handset, EarPods with Lightning Connector, Lightning to 3.5 mm Headphone Jack Adapter, Lightning to USB Cable, USB Power Adapter, Documentation",
			modelnumber:"MQA52HN/A",
			Simtype:"Single Sim",
			otgcompatible: "NO",
			image1:"https://rukminim1.flixcart.com/image/832/832/j9d3bm80/mobile/k/x/a/apple-iphone-x-mqa82hn-a-original-imaeyysgmypxmazk.jpeg?q=70",
			image2:"https://rukminim1.flixcart.com/image/832/832/j9d3bm80/mobile/k/x/a/apple-iphone-x-mqa82hn-a-original-imaeyzyf8dyfgaaq.jpeg?q=70",
			image3:"https://rukminim1.flixcart.com/image/832/832/j9d3bm80/mobile/k/x/a/apple-iphone-x-mqa82hn-a-original-imaeyzzw2zrxkwug.jpeg?q=70",
			display:"5.8 inch",
			resolution:"2436 x 1125 Pixels",
			gpu:"M11",
			os:"iOS 11",
			processor:"A11 Bionic Chip with 64-bit Architecture, Neural Engine, Embedded M11 Motion Coprocessor",
			processorcore:"-",
			clockspeed:"2 GHZ",
			expandablestorage:"N/A",
			primarycamera:"12MP+12MP",
			secondarycamera:"7MP",
			flash:"Rear Quad LED True Tone Flash with Slow Sync and Front Retina Flash",
			nwtype:"4G ,2G, 3G",
			internetconnectivity:"4G, 3G, Wi-Fi",
			microusbport:"Lightning port",
			bluetoothver:"5",
			audiojack:"N/A",
			sensors:"    Face ID, Barometer, Three-axis Gyro, Accelerometer, Proximity Sensor, Ambient Light Sensor",
			battery:"2,716mAh",
			width:"70.09 mm",
			height:"143.6 mm",
			depth: "7.7 mm",
			weight:"174g"
		}
]

function seedDB(){
//Remove all Products
	Product.remove({}, function(err){
	if(err){
		console.log(err);
	}
	console.log("removed product");
	//add a few Products
	data.forEach(function(seed){//written in callback function of remove so that order is maintained i.e adding of campground should always be after removing from db
		Product.create(seed,function(err, product){
			if(err){
				console.log("error");
			}
			else{
				console.log("Added Product to db");
				//create a comment on each Product
				
					}
				});
			});
});
}

	
	//add a few comments


module.exports=seedDB;