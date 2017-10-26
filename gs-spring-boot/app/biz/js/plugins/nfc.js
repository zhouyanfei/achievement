require(["domReady!","mobile","jcl","tap"],function(doc, Mobile, $) {
	/* 欢迎分享公共的NFC数据读取 */
	$("#read").tap(function(){
		// 默认已经支持北京公交卡信息的读取（即读取北京公交卡的数据不需要解析）
		// 发送的指令，byte[]数组转换成string
		// 可以使用wade-mobile-com.jar包中的com.wade.mobile.common.nfc.util.Util的toHexString转换成字符串
		var cmds1 = new $.DataMap();
		cmds1.put("cmd1","00A404000E315041592E5359532E444446303100");
		cmds1.put("cmd2","00B0840000");
		cmds1.put("cmd3","00B0850000");
		cmds1.put("cmd4","00A4000002100100");
		cmds1.put("cmd5","805C000204");
		var cmds = new $.DataMap();
		cmds.put("cmds1",cmds1);
		Mobile.initNfc(cmds,"getNfcData");
	});
	
	/* 读取NFC的信息的回调 */ 
	window.getNfcData = function(data){
		$("#cash").text("");
		$("#log").text("");
		
		var result = new $.DataMap(data);
		if(result.get("isOk") == "true" && result.get("type") == "string") {
			var msgStr = result.get("msg");
			var msg = new $.DataMap(msgStr);
			// 余额
			$("#cash").text(msg.get("cash"));
			
			// 日志
			var log = msg.get("log");
			var list = new $.DatasetList(log);
			for(var i=0;i<list.length;i++){
				var item = new $.DataMap(list.get(i).toString());
				var $div = $("<div>").text(item.get("date")+"	"+item.get("cashType")+item.get("cash")+"	"+"["+item.get("processNumber")+"]");
				$("#log").append($div);
			}
			
			$("#result").show();
		}
	}
});
