require(["domReady!","mobile","jcl","iScroll","tap"], function(doc,Mobile,$,iScroll) {
	$("#return").tap(function() {
		Mobile.closeDialog($("#result").val());
	});
	
	$("#cancel").tap(function() {
		Mobile.closeDialog();
	});
	
	$("#openDialog").tap(function() {
		Mobile.openDialog("UI-CustomDialog", null, function(result) {
			alert(result);
		});
	});
});