var li1=document.getElementById("li1");
var li2=document.getElementById("li2");
var li3=document.getElementById("li3");
var li4=document.getElementById("li4");

var zoomedimg=document.getElementById("zoomed-img");
var demo=document.getElementById("demo");
var demo2=document.getElementById("demo2");
var demo3=document.getElementById("demo3");
var demo4=document.getElementById("demo4");

li1.addEventListener("mouseover",function(){
	zoomedimg.style.backgroundImage=demo.style.backgroundImage;
	demo.style.border="2px solid #2874f0";
	demo2.style.border="1px solid black";
	demo3.style.border="1px solid black";
	demo4.style.border="1px solid black";

});
li2.addEventListener("mouseover",function(){
	zoomedimg.style.backgroundImage=demo2.style.backgroundImage;
	demo2.style.border="2px solid #2874f0";
	demo.style.border="1px solid black";
	demo3.style.border="1px solid black";
	demo4.style.border="1px solid black";
}); 
li3.addEventListener("mouseover",function(){
	zoomedimg.style.backgroundImage=demo3.style.backgroundImage;
	demo3.style.border="2px solid #2874f0";
	demo.style.border="1px solid black";
	demo2.style.border="1px solid black";
	demo4.style.border="1px solid black";

});
li3.addEventListener("click",function(){
	zoomedimg.style.backgroundImage=demo4.style.backgroundImage;
	demo4.style.border="2px solid #2874f0";
	demo.style.border="1px solid black";
	demo2.style.border="1px solid black";
	demo3.style.border="1px solid black";

});
