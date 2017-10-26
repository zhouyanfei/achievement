require(["domReady!","wadeMobile", "util"], function(doc,WadeMobile) {
	var videoPath;
	// 视频录制
	$("#record").tap(function(){
		WadeMobile.recordVideo(function(path){
			// path:返回视频录制文件存放的路径
			if(path){
				videoPath = path;
				WadeMobile.tip(videoPath);
				$("#hiddenContent").show();
			}else{
				WadeMobile.tip("别气馁，再录一次吧！");
			}
		});
	});
	
	// 播放视频
	$("#play").tap(function(){
		WadeMobile.playVideo(videoPath,function() {
			Mobile.tip("hi");
		});
	});
});
