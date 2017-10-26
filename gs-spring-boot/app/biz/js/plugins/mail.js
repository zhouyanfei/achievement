require(["domReady!","wadeMobile", "jcl","iScroll","tap"], function(doc,WadeMobile,$,iScroll) {
	var iscroll = new iScroll("scroll-container");
	var picPath = "picture/my.png";
	
	/**
	 * 选择图片 
	 */
	$("#getPicture").tap(function() {
		WadeMobile.getPicture(function(filePath){
			$("#uploadFilePath").html(filePath);
		});
	});
	/**
	 * 发送邮件
	 */
	$("#sendMail").tap(function(){
		var params =new $.DataMap();
		params.put("user", $("#mailsender").val());
		params.put("password", $("#mailsenderpwd").val());
		params.put("subject", "this is the test subject");
		params.put("body", "this is the test body");
		params.put("receiver", $("#mailReceiver").val());
		var uploadFile = $("#uploadFilePath").html();
		params.put("attachment", uploadFile);
		WadeMobile.shareImageBymail(params.toString());
	});
});
