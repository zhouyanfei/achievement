require(["domReady!","ipu", "jquery", "iScroll","mobile"], function (doc,ipu, $, iScroll,Mobile) {
	/*首页被其他iframe嵌入时，需要加入这一行代码*/
	ipu.page.options.target = window;
	
	var navBar = ipu.navBar(".ipu-navbar", {
        animate: true,
        callBack: function (index, lastIndex) {
            console.log(index + "," + "last:" + lastIndex);
        }
    });
    navBar.show(0);
    
    $("#plugin-index,#js-Plugin,#static-Plugin,#more-Plugin").children().click(function(){
    	var action = $(this).data("action");
    	if(action && action != ""){
    		Mobile.openPage(action);
    	}else{
    		Mobile.alert("This element doesn't bind the attribute of 'data-action'");
    	}
    });

});
