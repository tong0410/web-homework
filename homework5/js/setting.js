var elem = document.getElementById('mySwipe');
var elemmap = document.getElementById('hdpmap');
function listshow(){
	for(var i=0;i<document.getElementById('picshow').getElementsByTagName("li").length;i++){
		var adlistmap = document.createElement("span");
		i == 0 ? adlistmap.setAttribute("class","now") : adlistmap.setAttribute("class","opan");
		elemmap.appendChild(adlistmap);
	}	
}
listshow();
window.mySwipe = Swipe(elem, {
  auto: 3000,
  callback:function(index, element) {
	  for(var i = 0;i < elemmap.getElementsByTagName("span").length;i++){
		  var _temp_l = elemmap.getElementsByTagName("span")[i];
		  i == index ? _temp_l.setAttribute("class","now") : _temp_l.setAttribute("class","opan");
	  }
	},
});
