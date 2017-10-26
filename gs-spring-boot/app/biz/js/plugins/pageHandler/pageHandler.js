require(["domReady!","wadeMobile","mobile","jcl","iScroll","util"], function(doc,WadeMobile,Mobile,$,iScroll){
	new iScroll("content");
	$("#openPage").click(function(){
		Mobile.openPage("PageA");
	});
	$("#openWindow").click(function(){
		var param = $.DataMap();
		param.put("LEVEL", 1);
		Mobile.openWindow("UI-CustomWindow", param, function(result) {
			alert(result);
		});
	});
	$("#openTemplate").click(function(){
		Mobile.openTemplate("PageA");
	});
	$("#loadPage").click(function(){
		Mobile.loadPage("PageA");
	});
	$("#loadTemplate").click(function(){
		Mobile.loadTemplate("PageA");
	});
	// 被打开的url，不管停留在哪一层页面，按返回会提示退出
	$("#openUrl").click(function(){
		Mobile.openUrl("https://www.baidu.com");
	});
	// 被打开的url，不管停留在哪一层页面，直接退出至ipu主页面
	$("#loadUrl").click(function(){
		Mobile.loadUrl("https://www.baidu.com");
	});
	// 打开原生的浏览器窗口
	$("#openBroswer").click(function(){
		WadeMobile.openBrowser("https://www.baidu.com");
	});
	// 在IPU应用中集成浏览器功能，打开自定义浏览器
	$("#openIpuBroswer").click(function() {
		WadeMobile.openIpuBrowser("https://www.baidu.com","true");
	});
	$("#back").click(function(){
		Mobile.openPage("KeyDownListen");
	});
	$("#home").click(function(){
		Mobile.openPage("KeyDownListen");
	});
	$("#menu").click(function(){
		Mobile.openPage("KeyDownListen");
	});
	
	Mobile.setBackCallListener(function(e){
		alert(e);
	});
});