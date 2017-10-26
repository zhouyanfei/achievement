require(["mobile","wadeMobile","common","Hammer","handlebars","jcl","iScroll","tap"],function(Mobile,WadeMobile,Common,Hammer,Handlebars,$,iScroll){	
	var iscroll;
	
	// 注册
	$("#register").tap(function() {
		// 昵称
		var alias = $('#alias').val();
		if (escape(alias).indexOf("%u") >= 0){
			Mobile.tip("昵称不能含有中文，请重新输入！");
			return;
		}
		//订阅主题/频道
		WadeMobile.registerForPushWithYunba(alias, function(obj){
			if(obj != 'SUC'){
				alert('频道订阅失败！');
				return;
			}
			
			$("#registerWrap").hide();
			$("#main").show();
			$("#logoutWrap .user-alias").text(alias);
			iscroll = new iScroll("scroll-container");
		});
	});
	
	// 注销
	$("#logout").tap(function() {
		//退订主题/频道
		WadeMobile.unregisterForPushWithYunba();
		$("#registerWrap").show();
		$("#main").hide();
	});
	
	// 发送消息
	$("#send").tap(function() {
		//发送内容
		var sendInfo = $('#msgInfo').val();
		// 发送到的用户，默认给全体人员发送消息
		var users = "ALL";
		
		//发送消息
		WadeMobile.sendTextWithYunba(users, sendInfo, function(obj){
			console.log('发送结果：' + obj);
			if(obj != 'SUC'){
				Mobile.alert('消息发送失败！');
			} else {
				$('#msgInfo').val("");
			}
		});
	});
	
	window.receiveMessage = function(result){
		//处理IOS返回值为对象的情况
		if(typeof(result) == "object" ){
			result = JSON.stringify(result);
		}
		// 接收格式为: {"MSG":"内容", "ALIAS":"昵称"}
		var json = eval("(" + result+ ")");
		var html = "";
		// 自己发言
		if(json.ALIAS == $("#alias").val()){
			html = Handlebars.compile($("#T_myChat").val())(json);
			
		} else {
			html = Handlebars.compile($("#T_othersChat").val())(json);
		}
		$("#chatContent").append($(html));
		iscroll.refresh();
		iscroll.scrollToElement($("#chatContent>div").get($("#chatContent>div").length-1), 200);
	}
	
	//设置回调函数
	if(WadeMobile.isApp()){
		WadeMobile.setCallbackForPushWithYunba("receiveMessage");
	}
	
});