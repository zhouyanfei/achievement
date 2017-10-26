require(["domReady!","wadeMobile","jcl","iScroll","tap"], function(doc,WadeMobile,$,iScroll) {
	var audioPath;
	//录音
	$("#record").tap(function(){
		WadeMobile.audioRecord(function(path){
			// path:返回录音文件存放的路径
			if(path){
				audioPath = path;
				WadeMobile.tip(audioPath);
				$("#hiddenContent").show();
			}else{
				WadeMobile.tip("别气馁，再录一次吧！");
			}
		});
	});
	
	// 播放录音
	$("#play").tap(function(){
		// audioPath:播放的语音文件的路径;
		// 第二个参数:播放的语音文件的效果，true：弹出波纹，false：无效果
		WadeMobile.audioPlay(audioPath,true);
	});
	
	// 清空录音
	$("#cleanAudioResource").tap(function(){
		// 第一个参数：清除资源类型（3:语音）；
		WadeMobile.cleanResource("audios");
		$("#hiddenContent").hide();
	});
});