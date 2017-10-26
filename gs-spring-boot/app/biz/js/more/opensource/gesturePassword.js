require(["domReady!","common","mobile","jquery","gesturePassword"], function(doc,Common,Mobile,jQuery,GesturePasswd) {
	
	jQuery("#gesturepwd").GesturePasswd({
	    backgroundColor:"#ffffff",  //背景色
	    color:"#d5d5d5",   //主要的控件颜色
	    roundRadii:24,    //大圆点的半径
	    pointRadii:7, //大圆点被选中时显示的圆心的半径
	    space:38,  //大圆点之间的间隙
	    width:260,   //整个组件的宽度
	    height:260,  //整个组件的高度
	    lineColor:"#9f9f9f",   //用户划出线条的颜色
	    zindex :100  //整个组件的css z-index属性
	});
	
	jQuery("#gesturepwd").bind("hasPasswd",function(e,passwd){
		
		if(passwd != "1235789"){
          	//显示一下错误的手势线（红色的，只显示一秒）
          	jQuery("#gesturepwd").trigger("passwdWrong");

          	Mobile.tip("手势锁密码错误，解锁手势为：Z ");
      	} else {
      		//显示一下正确的手势线（绿色的，只显示一秒）
      		jQuery("#gesturepwd").trigger("passwdRight");
      		
      		setTimeout(function() {
      			$("#mainContent").hide();
      	    	$("#resultContent").show();
      		}, 1000)
      	}
	});
});
