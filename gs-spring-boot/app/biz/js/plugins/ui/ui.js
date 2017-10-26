require(["domReady!","wadeMobile","mobile","jcl","iScroll","tap"], function(doc,WadeMobile,Mobile,$,iScroll) {
	new iScroll("scroll-container");
	$("#progressBar").tap(function() {
		WadeMobile.loadingStart('加载中……', '进度条');
		// 关闭进度条
		setTimeout(function(){
			WadeMobile.loadingStop();
		}, 2000);
	});
	
	$("#progressBar2").tap(function() {
		WadeMobile.loadingStart('加载中……', '进度条','true');
	});
	
	$("#toastLong").tap(function() {
		// 1：此提示信息会在较长时间后渐渐隐去
		WadeMobile.tip('我是一条提示信息！', 1);
	});
	
	$("#toastShort").tap(function() {
		// 0：此提示信息会在较短时间后渐渐隐去；
		WadeMobile.tip('我是一条提示信息！', 0);
	});
	
	//年月日：date为空，默认选中系统当前时间；format为空，默认yyyy-MM-dd
	$("#date1").tap(function() {
		WadeMobile.getDate(function(time) {
			$("#dateContent1").html(time);
		});
	});
	
	//年月
	$("#date2").tap(function() {
		WadeMobile.getDate(function(time) {
			$("#dateContent2").html(time);
		}, '2012年12月', 'yyyy年MM月');
	});
	
	//时分
	$("#date3").tap(function() {
		WadeMobile.getDate(function(time) {
			$("#dateContent3").html(time);
		}, '19:12', 'HH:mm');
	});

	// 年月日时分
	$("#date4").tap(function() {
		WadeMobile.getDate(function(date) {
			WadeMobile.getDate(function(time) {
				date += " "+time;
				$("#dateContent4").html(date);
			}, '19:12', 'HH:mm');
		}, '2012/12/19', 'yyyy/MM/dd');
	});
	
	$("#customDialog").tap(function() {
		Mobile.openDialog("UI-CustomDialog", null, function(result) {
			alert(result);
		},0.6,0.6);
	});
	
	$("#customWindow").tap(function() {
		var param = $.DataMap();
		param.put("LEVEL", 1);
		Mobile.openWindow("UI-CustomWindow", param, function(result) {
			alert(result);
		});
	});

		//提示对话框
	$("#customAlertDialog").tap(function()
		{
			Mobile.openPage("UI-CustomAlertDialog",null);
		}
	);
	
	$("#slidingMenu").tap(function() {
		Mobile.openSlidingMenu("UI-SlidingMenu",null,function(result){
			alert(result);
		});
	});
	
	$("#getContactsView").tap(function(){
		//1.
		//2.异常情况的优化，比如，颜色传入错误时，无法正常转换出的时候，空指针。(类似这种异常情况的优化，暂时可以缓一下。明显的可以处理一下)
		//3.最好可以加一些注释
		//4.侧边的字母索引可以外围控制显示(弄成配置项)
		var list1=new $.DatasetList();
		var data1=new $.DataMap();
		data1.put("ID",1);
		data1.put("VALUE", "新的朋友1124");
		data1.put("COLOR", "#FF0000");
		list1.add(data1);
		data1=new $.DataMap();
		data1.put("ID",2);
		data1.put("VALUE", "群聊");
		list1.add(data1);
		data1=new $.DataMap();
		data1.put("ID",3);
		data1.put("VALUE", "标签");
		list1.add(data1);
		data1=new $.DataMap();
		data1.put("ID",4);
		data1.put("VALUE", "公众号");
		list1.add(data1);
		
		var list2=new $.DatasetList();
		var data2=new $.DataMap();
		data2.put("ID",999);
		data2.put("VALUE", "LLL");
		data2.put("COLOR", "#000080");
		list2.add(data2);
		data2=new $.DataMap();
		data2.put("VALUE", "芙兰");
		list2.add(data2);
		data2=new $.DataMap();
		data2.put("VALUE", "妹妹");
		list2.add(data2);
		data2=new $.DataMap();
		data2.put("VALUE", "你好");
		list2.add(data2);
		data2=new $.DataMap();
		data2.put("VALUE", "林小姐");
		list2.add(data2);
		data2=new $.DataMap();
		data2.put("VALUE", "联盟");
		list2.add(data2);
		data2=new $.DataMap();
		data2.put("VALUE", "L");
		list2.add(data2);
		data2=new $.DataMap();
		data2.put("VALUE", "xdsfsdggsdsf");
		list2.add(data2);
		data2=new $.DataMap();
		data2.put("VALUE", "星星");
		list2.add(data2);
		data2=new $.DataMap();
		data2.put("VALUE", "靴刀誓死");
		list2.add(data2);
		data2=new $.DataMap();
		data2.put("VALUE", "Java");
		list2.add(data2);
		data2=new $.DataMap();
		data2.put("VALUE", "倒塌");
		list2.add(data2);
		data2=new $.DataMap();
		data2.put("VALUE", "黑人");
		list2.add(data2);
		data2=new $.DataMap();
		data2.put("VALUE", "~~在");
		list2.add(data2);
		data2=new $.DataMap();
		data2.put("VALUE", "这个人");
		list2.add(data2);
		
		var data = new $.DataMap();
		data.put("noneTypeRecordList", list1); //无类型的list（上面）
		data.put("recordList", list2);     // 有类型list（下面）
		data.put("noneTypeText", "内容");   // 最上面的lable
		data.put("hasCustomeID", true);    // 是否自动创建id。true：使用自带的id，如果没有则为null；false：系统统一创建id。
		
		var setting = new $.DataMap();
		setting.put("withImage", true);  // 左侧图片是否显示
		setting.put("childTextColor", "#393939"); // 每一条记录的字体颜色
		setting.put("childViewNormalBgColor", "#FFFFFF");// 每一条记录的背景色
		setting.put("groupTextColor", "#A6A6A6");  // 每一组的字体颜色，例如：D、E、F
		setting.put("groupViewbgColor", "#EAEAEA"); //每一组的颜色的背景色
		setting.put("dividerColor", "#A0A0A0");  // 每条记录之间的分隔线的颜色
		
		WadeMobile.getContactsView(function(result){
			var data = new $.DataMap(result);
			alert("详情是：ID：" + data.get("ID") + ", VALUE：" + data.get("VALUE"));
			}, data.toString(), setting.toString()
		);
	});
});
