require(["domReady!","wadeMobile","jcl","iScroll","tap"], function(doc,WadeMobile,$,iScroll) {
	var iscroll=new iScroll("scroll-container");
	$("#scan").tap(function() {
		WadeMobile.scanQrCode(function(result){
			$("#result").html(result);
			$("#result").removeClass("e_placeholder");
		});
	});
	$("#scanSingle").tap(function() {
		WadeMobile.scanSingle(function(result){
			$("#resultSingle").html(result);
			$("#resultSingle").removeClass("e_placeholder");
		});
	});
	$("#scanMultiple").tap(function() {
		WadeMobile.scanMultiple(function(result){
			$("#resultMultiple").html(result);
			$("#resultMultiple").removeClass("e_placeholder");
		});
	});
	$("#create").tap(function(){
		var str=$("#info").html();
		WadeMobile.createQrCode(function(base64){
			$("#img").html("<img src=\"data:image/jpeg;base64,"+base64+"\" >");
			doc.getElementById("resultContent").style.visibility="visible";
			iscroll.refresh();
		},str);
	});
});