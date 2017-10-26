define([ "jcl", "tap", "wmUI", "wmBase", "wmAnimate" ], function($) {
	// 一个页面只会加载一次
	var wmWebUI = {};
	wmWebUI.tags = {}

	wmWebUI.store = function(id, tag) {
		wmWebUI.tags[id] = tag;
	}

	/* 标签初始化方法 */
	wmWebUI.initTags = function(ids, initFunction) {
		var count = 0;// 尝试次数
		var bo;// 尝试10次的状态
		var intervalId;
		var tempFunc = function() {
			count++;// 计数器加1
			if (count > 10) {
				bo = true;// 尝试10次后返回结果
			}
			console.log("尝试次数:" + count);
			var tags = new Array();
			for ( var index in ids) {
				if (wmWebUI.tags[ids[index]] || bo) {
					tags.push(wmWebUI.tags[ids[index]]);
				} else {
					return true;
				}
			}
			window.clearInterval(intervalId);// 获取成功以后停止尝试
			initFunction.apply(null, tags);
		}
		
		if(tempFunc()){// 不延迟即尝试
			intervalId = setInterval(tempFunc, 20);// 20毫秒每次
		}
	}
	/* 根据标签id查询标签对象 */
	wmWebUI.select = function(id) {
		var tag = $("#" + id);
		if (tag.length > 0 && wmWebUI.tags[id])
			return wmWebUI.tags[id];
	}

	/* 公共方法：根据id或者元素查询zepto对象 */
	wmWebUI.getElement = function(obj) {
		if (typeof (obj) == "object") {
			obj = $(obj);
		} else if (typeof (obj) == "string") {
			obj = $("#" + obj);
		} else {
			throw "没有匹配类型";
		}
		return obj;
	}

	return wmWebUI;
});

/*
initTags方法测试代码
require(["wmTabbar"], function(WmTabbar) {
	setTimeout(function(){
		var wmTabbar = new WmTabbar("tabbar1");
		wmTabbar.create();
	},100);
});
require(["wmWebUI"], function(WmWebUI) {
	console.log(WmWebUI.select("tabbar1"))
	WmWebUI.initTags(["tabbar1","aaaa"],function(tabbar1,aaa){
		console.log(tabbar1);
		console.log(aaa);
	});
});
*/
