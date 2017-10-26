require([ "domReady!", "wadeMobile", "mobile", "util" ], function(doc,
		WadeMobile, Mobile) {
	$("#back").click(function() {
		Mobile.back();
	});
	$("#backTag").click(function() {
		Mobile.back("PageHandler");
	});
	$("#backCallback").click(function() {
		Mobile.backWithCallback("回调：测试数据来自pageB");
	});
	$("#backTagCallback").click(function() {
		Mobile.backWithCallback("回调：测试数据来自pageB","PageHandler");
	});
});