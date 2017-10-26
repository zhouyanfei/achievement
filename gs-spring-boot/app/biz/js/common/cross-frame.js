define(function(require) {
	
	// 给子窗口回消息，参数是收到消息时的参数
	function sendMsg(event) {
		event.source.postMessage(event.data, event.origin);
	}

	function receiveMessage(event) {
//		confirm('01ireceive'+event);
		
		// 来源验证，可以用来判断消息来源是否是一个可信任的源，可根据情况是否需要处理，来源是一个domain地址到端口
		// if (event.origin !== "http://example.com:8080")
		//  return;

		var data = event.data;
//		confirm('idata'+data);

		if (!data) {
			data = {};
			data.code = -1;
			data.result = "event没有data";
			sendMsg(event);
			return;
		}

		var objName = data.objName;
		var method = data.method;
		var paras = data.paras;
		var callBackIndexs = data.callBackIndexs;
//		confirm(objName+'--'+method+'--'+paras+'--'+callBackIndexs);

		// todo检查参数
		if (!method) {
			data.code = -1;
			data.result = "data没有method";
			sendMsg(event);
			return;
		}

		// 不支持没参数的插件调用
		if (!paras || !paras.length) {
			data.code = -1;
			data.result = "data没有paras";
			sendMsg(event);
			return;
		}

		var localParas = paras.slice(0); // 复制数组，用来做本地调用

		// 将参数中原来函数位置值，替换成函数
		for ( var key in callBackIndexs) {
			var index = callBackIndexs[key];
			localParas[index] = (function(code) { // 将所有callBackIndexs对应索引定义成回调函数
				return function (){
					data.code = code;
					data.result = [];
					for (var i = 0, j = arguments.length; i < j; i++) {
						data.result.push(arguments[i]);
					}
					sendMsg(event);
				}
			})(index);
		}

		// TODO: 这个地方实现，怎么找到对象然后调用方法，可自定义相关实现，
		// 如果业务复杂，可专门定义一个模块，提供方法给子窗口调用
//		confirm('yes');
		var WadeMobile = require("wadeMobile");
		
		/*
		WadeMobile.getSysInfo.apply(WadeMobile, [function(info1){
			confirm("success"+info1);
		},'OSVERSION',function(){
			confirm();
		}]);
		*/
		
		var callObj = require(objName); 
		var callMethod = callObj[method];
		callMethod.apply(callObj, localParas);

		// 测试代码
		// var tempIndex = callBackIndexs[1];
		// localParas[tempIndex]("test", 12);
	}

	window.addEventListener("message", receiveMessage, false);
});
