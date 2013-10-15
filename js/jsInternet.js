// JavaScript Document

//Array de Pc
var pcs = new Array();

var previousValue;
	
//Objeto PC
function PcObject(idpc){
	this.idpc=idpc;
	this.startWorker=function(){
	this.worker= new Worker('js/timeWorker.js');
	this.worker.onmessage= function(e) {
   		$('[id="totalMoney'+idpc+'"]').html(e.data);
		};	
	}
	this.stopWorker=function(){
		this.worker.terminate();
	}
	this.initTime;
	this.isUsed=true;
	this.useEndTime=false;
	this.endTime;
}
	
//onfocus del timepo final

function onfocusEndTime(element){
$("#endTime").val($("#startTime").val());
}	
	
//onfocus del tiempo inicial
function savePreviousValue(element){
	previousValue=element.value;
}
	
//cambia de on-off
function changeStatus(){
	var idpc=$("#tituloConfiguracion").data("idpc");
	if($("#busy").val()=="off"){
		pcs[idpc-1].stopWorker();
		pcs[idpc-1].isUsed=false;
		$("#imagePc"+idpc).removeClass("busyPc");
		$("#pc"+idpc).removeClass("busyDivPc");
		$("#pc"+idpc).addClass("freeDivPc");
		$("#imagePc"+idpc).addClass("freePc");
		$("#totalMoney"+idpc).html("");
		
	}else{
		pcs[idpc-1].startWorker();
		pcs[idpc-1].worker.postMessage({'cmd': 'start', 'msg': pcs[idpc-1].initTime});
		pcs[idpc-1].isUsed=true;
		$("#imagePc"+idpc).removeClass("freePc");
		$("#imagePc"+idpc).addClass("busyPc");
		$("#pc"+idpc).removeClass("freeDivPc");
		$("#pc"+idpc).addClass("busyDivPc");
	}
}
	
//onblur del tiempo inicial
function refreshWorkerTime(){
	if($.trim($("#startTime").val())==""){
		$("#startTime").val(previousValue);
		return;
	}
	var idpc=$("#tituloConfiguracion").data("idpc");
	var nowDate= new Date();
	var arrayTime = $("#startTime").val().split(":");
	nowDate.setHours(arrayTime[0]);
	nowDate.setMinutes(arrayTime[1]);
	nowDate.setSeconds(0);
	pcs[idpc-1].worker.postMessage({'cmd': 'refresh', 'msg': nowDate.getTime()});
	pcs[idpc-1].initTime=nowDate.getTime();
	$("#endTime").prop("min",$("#startTime").val());
}
	
//cuando se agrega una pc
function validaAddPc(){
	if($("#pcForm").val()<1){
		$("#pcForm").css("box-shadow","0 0 12px #F00");
		return;
	}
	var pc = new PcObject(pcs.length+1);
	pcs[pcs.length]=pc;
	$("#mainContent").append("<div id='pc"+pc.idpc+"' data-idpc='"+pc.idpc+"' class='blockPc busyDivPc' onclick='configurePc(this)'> <div style='text-align:center;color:#000;font-size:22px;font-weight:bolder'>    PC"+pc.idpc+"    </div>    <div id='imagePc"+pc.idpc+"' style='background-image:url(img/pcImage.png);background-repeat:no-repeat;height:100%;color:#FFFFFF;font-size:42px;font-weight:bolder;text-align:center'>    <div style='width:100%;height:50px;position:relative;top:50px;'id=totalMoney"+pc.idpc+"></div>    </div>    </div>");
	$( "#agregar" ).dialog( "close" );
	pc.startWorker();
	pc.initTime=new Date().getTime();
	pc.worker.postMessage({'cmd': 'start', 'msg': pc.initTime});
	$("#pc"+pc.idpc).addClass("busyPc");
}
	
//configurar un pc	
function configurePc(divPc){
	$.mobile.changePage( "#configuraPc", { transition: "slidedown"} );
	$("#tituloConfiguracion").html("Propiedades de PC"+divPc.dataset.idpc);
	$("#tituloConfiguracion").data('idpc',divPc.dataset.idpc);
	if(pcs[divPc.dataset.idpc-1].isUsed){
		$("select").val('on');			
	}else{
		$("select").val('off');			
	}
	$("select").slider('refresh');
	var datePc = new Date(pcs[divPc.dataset.idpc-1].initTime);
	var horas=datePc.getHours();
	if(horas<10){
		horas="0"+horas;
	}
	var minutos=datePc.getMinutes();
	if(minutos<10){
		minutos="0"+minutos;
	}
	$("#startTime").val(horas+":"+minutos+":00");
    
	if(pcs[divPc.dataset.idpc-1].useEndTime){
		$("#useEndTimeCheck").attr("checked",true).checkboxradio("refresh");
		datePc = new Date(pcs[divPc.dataset.idpc-1].endTime);
		var horas=datePc.getHours();
		if(horas<10){
			horas="0"+horas;
		}
		var minutos=datePc.getMinutes();
		if(minutos<10){
			minutos="0"+minutos;
		}
		$("#endTime").val(horas+":"+minutos+":00");
	}else{
		$("#useEndTimeCheck").attr("checked",false).checkboxradio("refresh");
		$("#endTime").val("");
	}
}

//onclick del boton utilizar hora de fin
function useEndTimeFunction(component){
	var idpc=$("#tituloConfiguracion").data("idpc");
	if(component.checked){
		if($("#endTime").val()==""){
			alert("Antes debe configurar el tiempo final");
			component.checked=false;
			return;
		}
		pcs[idpc-1].useEndTime=true;
		var nowDate= new Date();
		var arrayTime = $("#endTime").val().split(":");
		nowDate.setHours(arrayTime[0]);
		nowDate.setMinutes(arrayTime[1]);
		nowDate.setSeconds(0);
		pcs[idpc-1].endTime=nowDate.getTime();
		pcs[idpc-1].worker.postMessage({'cmd': 'useEndTime', 'msg': true,'msg2':pcs[idpc-1].endTime});
	}else{
		$("#endTime").val("");	
		pcs[idpc-1].useEndTime=false;
		pcs[idpc-1].worker.postMessage({'cmd': 'useEndTime', 'msg': false});
	}
}