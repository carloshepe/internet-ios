// JavaScript Document

var initTime;
var endTime;
var useEndTime;
function calculateMoney(){
	var doOperations=function(){
		var nowTime = new Date();
    	var spendMillis=nowTime.getTime()-initTime.getTime();
		var minutos = spendMillis/1000/60;
		var total=Math.round(minutos*10/60)
		if(total>2){
			postMessage(total);
		}else{
			postMessage(2);
		}
		if(useEndTime && (nowTime.getTime()>endTime)){
			postMessage(9999);
		}
	}
	setInterval(doOperations,1000);
}

onmessage = function(event) {
	var data = event.data;
  	switch (data.cmd) {
    	case 'start':
			initTime = new Date(data.msg);
			calculateMoney();
      		break;
		case 'useEndTime':
			endTime=data.msg2;
			useEndTime=data.msg;
			break;	
    	case 'refresh':
		    initTime=new Date(data.msg);
      		break;
    
	  };
};