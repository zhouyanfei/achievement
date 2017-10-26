require(["domReady!","wadeMobile","jcl","iScroll","tap"], function(doc,WadeMobile,$,iScroll) {
	var iscroll = new iScroll("scroll-container");
    if(WadeMobile.isIOS()){
        $('#info_list .title').text('iOS系统(点击获取数据)');
    }else if(WadeMobile.isAndroid()){
        $('#info_list .title').text('Android系统(点击获取数据)');
    }else{
        $('#info_list .title').text('系统信息');
    }
	// 调用手机拨打电话
	$("#call").tap(function() {
		// 电话号码
		var num=$("#num").val();
		WadeMobile.call(num);
	});
	// 调用手机发送短信功能
	$("#sms").tap(function(){
		// 电话号码
		var num=$("#num").val();
		// 短信内容
		var msg=$("#msg").val();
		WadeMobile.sms(num,msg);
	});
	// 调用手机的震动功能
	$("#shock").tap(function(){
		//持续2000ms
		WadeMobile.shock(2000);
	});
	// 调用手机的响铃功能
	$("#beep").tap(function(){
		//重复响铃3次
		WadeMobile.beep(3);
	});
	// 获取系统相关信息
	$("#getInfo").tap(getInfo);
	function getInfo(){
		var infoDivs=$("#info div");
		// OSVERSION：获取操作系统版本；PLATFORM：获取平台类型，Android或者IOS
		WadeMobile.getSysInfo(function(info1){
			WadeMobile.getSysInfo(function(info2){
				infoDivs.eq(0).html(info2+' '+info1);
			},'PLATFORM');
		},'OSVERSION');
		var spans=infoDivs.eq(1).find("span");
        // 频繁调用存在交互丢失的情况，因此加个延迟
        setTimeout(function(){
            // MAC：获取移动设备的MAC地址。
            WadeMobile.getNetInfo(function(info){
                spans.eq(0).html(info);
            },'MAC');

            // IP:获取移动设备的IPV4地址。
            WadeMobile.getNetInfo(function(info){
                spans.eq(1).html(info);
            },'IP');
        },200);


		// IMEI：获取移动设备国际身份码。 
		WadeMobile.getSysInfo(function(info){
			spans.eq(2).html(info);
		},'IMEI');
		// IMSI：获取国际移动用户识别码，区别移动用户的标志，储存在SIM卡中。 
		WadeMobile.getSysInfo(function(info){
			spans.eq(3).html(info);
		},'IMSI');
		// MODEL：获取手机型号。 
		WadeMobile.getSysInfo(function(info){
			spans.eq(4).html(info);
		},'MODEL');
		// UUID：通用唯一识别码，软件唯一标识。 
		WadeMobile.getSysInfo(function(info){
			spans.eq(5).html(info);
		},'UUID');
		// MANUFACTURER：获取制造商信息。 
		WadeMobile.getSysInfo(function(info){
			spans.eq(6).html(info);
		},'MANUFACTURER');
		// BRAND：获取手机品牌。 
		WadeMobile.getSysInfo(function(info){
			spans.eq(7).html(info);
		},'BRAND');
		// SDKVERSION：获取SDK版本。 
		WadeMobile.getSysInfo(function(info){
			spans.eq(8).html(info);
		},'SDKVERSION');
		// SIMNUMBER：SIM卡的序号 
		WadeMobile.getSysInfo(function(info){
			spans.eq(9).html(info);
		},'SIMNUMBER');
		// TIMEZONEID：国际时区 
		WadeMobile.getSysInfo(function(info){
			spans.eq(10).html(info);
		},'TIMEZONEID');
		// PRODUCTNAME：产品名称
		WadeMobile.getSysInfo(function(info){
			spans.eq(11).html(info);
		},'PRODUCTNAME');
		
		$("#info_list").show();
		$("#info_space").hide();
		iscroll.refresh();
	}
	WadeMobile.setKeyListener("back",function(){
		WadeMobile.tip("back物理按键已按下");
	});
	WadeMobile.setKeyListener("menu",function(){
		WadeMobile.tip("menu物理按键已按下");
	});
	WadeMobile.setKeyListener("home",function(){
		WadeMobile.tip("home物理按键已按下");
	});
});
