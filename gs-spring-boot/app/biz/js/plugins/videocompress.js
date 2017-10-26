require(["domReady!","wadeMobile", "jcl","iScroll","tap"], function(doc,WadeMobile,$,iScroll) {
	var iscroll = new iScroll("scroll-container");
	
	/**
	 * 选择视频
	 */
	$("#getVideoPath").tap(function(){
		WadeMobile.getVideoPath(function(videoPath){
			$("#videoPath").html(videoPath);
		});
	});
	
	//视频压缩
	$("#videoCompressor").tap(function() {
		var videoPath = $("#videoPath").html();
		WadeMobile.videoCompressor(videoPath);
	});
});
