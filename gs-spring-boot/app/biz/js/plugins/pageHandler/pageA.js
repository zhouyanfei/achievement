require([ "domReady!", "wadeMobile", "mobile", "util"], function(doc,
		WadeMobile, Mobile) {
	$("#back").click(function() {
		Mobile.back();
	});
	$("#toB").click(function() {
		Mobile.openPage("PageB");
	});
	$("#backCallback").click(function() {
		Mobile.backWithCallback("回调：测试数据来自pageA");
	});
	
	Mobile.setBackCallListener(function(e){
		alert(e);
	});
});