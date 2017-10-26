require(["domReady!","mobile","jcl","iScroll","tap"], function(doc,Mobile,$,iScroll) {
	var level = $("#level").val();
	var param = $.DataMap();
	param.put("LEVEL", parseInt(level) + 1);
	
	$("#openWindow").tap(function() {
		Mobile.openWindow("UI-CustomWindow", param, function(result) {
			alert(result);
		});
	});
	
	$("#return").tap(function() {
		alert("关闭第"+level+"层窗口");
		Mobile.closeWindow($("#result").val());
	});
	
	$("#cancel").tap(function() {
		alert("关闭第"+level+"层窗口");
		Mobile.closeWindow();
	});
});