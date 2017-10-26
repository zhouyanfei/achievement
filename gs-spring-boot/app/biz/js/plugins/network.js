require(["domReady!","wadeMobile","jcl","iScroll","tap"], function(doc,WadeMobile,$,iScroll) {
	//此处注意，绝不允许省略协议头。即http不允许省略。
	$("#getDataContent").tap(function(){
		WadeMobile.loadingStart('正在获取股票信息……', '等待');
		WadeMobile.httpGet(function(data) {
			WadeMobile.loadingStop();
			var arr=data.substring('var hq_str_s_sh000001="'.length,data.length-3).split(',');
			var br="<br />"
			$("#dataContent").html(
					"名称:"+arr[0]+br
					+"价格:"+arr[1]+br
					+"涨跌:"+arr[2]+br
					+"涨跌率:"+arr[3]+br
					+"成交量(手):"+arr[4]+br
					+"成交额(万元):"+arr[5]+br
			);
			$("#dataContent").show();
		}, "http://hq.sinajs.cn/list=s_sh000001", true); //第三个参数true,由于需要escape传输
	});
	
	//蓝牙分享
	$("#share").tap(function(){
		WadeMobile.shareByBluetooth();
	});
});