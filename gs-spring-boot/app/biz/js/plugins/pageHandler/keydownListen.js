require(["domReady!","wadeMobile","mobile","util"], function(doc,WadeMobile,Mobile){
	WadeMobile.setKeyListener("back",function(){
		WadeMobile.tip("back物理按键已按下");
		WadeMobile.cleanKeyDownFlag("back");
	},true);
	WadeMobile.setKeyListener("menu",function(){
		WadeMobile.tip("menu物理按键已按下");
	},false);
	WadeMobile.setKeyListener("home",function(){
		WadeMobile.tip("home物理按键已按下");
	},true);
});