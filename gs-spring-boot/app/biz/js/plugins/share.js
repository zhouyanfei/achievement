require(["domReady!","wadeMobile","jcl","iScroll","tap"], function(doc,WadeMobile,$,iScroll){
	
	var imgPathType = 0;
	var musicPathType = 1;
	var videoPathType = 2;
	var imgPath = "/storage/emulated/0/share/img.png";
	var musicPath = "/storage/emulated/0/share/music.mp3";
	var videoPath =  "/storage/emulated/0/share/video.mp4";
	
	$("#qqFriendText").tap(function(){
		var text = $("#shareText").val();
		WadeMobile.shareTextQQFriend(text);
	});
	$("#wechatFriendText").tap(function(){
		var text = $("#shareText").val();
		WadeMobile.shareTextWeChatFriend(text);
	});
	$("#qqFriendImg").tap(function(){
		WadeMobile.shareFileQQFriend(imgPathType,imgPath);
	});
	$("#wechatFriendImg").tap(function(){
		WadeMobile.shareFileWeChatFriend(imgPathType,imgPath);
	});
	$("#qqFriendMusic").tap(function(){
		WadeMobile.shareFileQQFriend(musicPathType,musicPath);
	});
	$("#wechatFriendMusic").tap(function(){
		WadeMobile.shareFileWeChatFriend(musicPathType,musicPath);
	});
	$("#qqFriendVideo").tap(function(){
		WadeMobile.shareFileQQFriend(videoPathType,videoPath);
	});
	$("#wechatFriendVideo").tap(function(){
		WadeMobile.shareFileWeChatFriend(videoPathType,videoPath);
	});
	$("#moreText").tap(function() {
		var text = $("#shareText").val();
		WadeMobile.shareTextMore(text)
	});
	$("#moreImg").tap(function() {
		WadeMobile.shareFileMore(imgPathType,imgPath)
	});
	$("#moreMusic").tap(function() {
		WadeMobile.shareFileMore(musicPathType,musicPath)
	});
	$("#moreVideo").tap(function() {
		WadeMobile.shareFileMore(videoPathType,videoPath)
	});
});