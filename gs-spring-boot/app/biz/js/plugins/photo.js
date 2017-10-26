require(["domReady!","wadeMobile","jcl","iScroll","tap"], function(doc,WadeMobile,$,iScroll) {
	var iscroll = new iScroll("scroll-container");
	
	// 调用手机的照相功能，返回相片的路径或相片的Base64编码
	$("#tack_a_picture").tap(function() {
		var width = $("#pic").width();
		var height = $("#pic").height();
		
		// 默认1；1：返回相片的路径，0：返回相片的Base64编码
		WadeMobile.getPhoto(function(path) {
			$("#path").html("路径：" + path);
//			$("#pic").removeClass("e_imagePlaceHolder");
			$("#pic").removeClass("fa").removeClass("fa-image");
			$("#pic").attr("class","");
			$("#pic").html("<img height='" + height + "' width='" + width + "' src='" + path + "'/>");
			iscroll.refresh();
		}, 1);
	});
	
	// 调用手机自带的图库类应用，选择一张相片后返回路径或Base64编码
	$("#search").tap(function() {
		var width = $("#pic2").width();
		var height = $("#pic2").height();
		// 默认1；1：返回相片的路径，0：返回相片的Base64编码
		
		WadeMobile.getPicture(function(path) {
			$("#pic2").removeClass("fa").removeClass("fa-image");
			$("#pic2").html("<img height='" + height + "' width='" + width + "' src='" + path + "'/>");
			iscroll.refresh();
		}, 1);
	});
});