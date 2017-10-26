require(["domReady!","mobile","iScroll","tap"], function(doc,Mobile,$,iScroll) {
	$("#return").tap(function() {
		Mobile.closeSlidingMenu("侧滑菜单返回");
	});
	$("#cancel").tap(function() {
		Mobile.closeSlidingMenu();
	});
});