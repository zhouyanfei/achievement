define(["jcl"],function($) {
	"use strict";
	var toString = Object.prototype.toString;
	var expando = "tap" + (new Date()).valueOf(), uuid = 0;

	/*使用如下全局变量可以支持绑定多个tap方法*/
	var tapHandlersCache = {};	//存储引用
	var tapParamsCache = {};	//存储参数
	function addTapHandler(elem, callback, params){
		var id = elem[expando];
		if(!id){
			id = ++ uuid;
			elem[expando] = id;
		}
		//存储传入的方法handler
		var handlersCache = tapHandlersCache[id];
		if(!handlersCache){
			handlersCache = tapHandlersCache[id] = [];
		}
		handlersCache.push(callback);
		//存储传入的方法参数,依靠下标对应
		var paramsCache = tapParamsCache[id];
		if(!paramsCache){
			paramsCache = tapParamsCache[id] = [];
		}
		paramsCache.push(params);
	}
	/*获取绑定方法的引用*/
	function getTapHandler(elem){
		var id = elem[expando];
		if(id && tapHandlersCache[id]){
			return tapHandlersCache[id];
		}
		return [];
	}
	/*获取绑定方法的参数*/
	function getTapParam(elem){
		var id = elem[expando];
		if(id && tapParamsCache[id]){
			return tapParamsCache[id];
		}
		return [];
	}

	/*向父级节点查找ontap属性,以此判断是否存在触感*/
	var parentByTap = function(node){
		if(!node || !node.nodeType) return;
		var i = 0;
		while((!("tagName" in node) || (!("ontap" in node.attributes) && !getTapHandler(node).length)) && i < 10){
			if(!node.parentNode || 1 != node.parentNode.nodeType)
				break;
			node = node.parentNode;
			i ++;
		}
		
		if("ontap" in node.attributes || getTapHandler(node).length)
			return node;
	};

    var preventAll = function (e) {
        e.preventDefault();
        e.stopPropagation();
    };

	var getXY = function(e){
		var x = e.touches ? e.touches[0].pageX : e.clientX;
		var y = e.touches ? e.touches[0].pageY : e.clientY;
		return [x, y];
	};

	//根据不同浏览器获取不同原生事件event
	var hasTouch     = "ontouchstart" in window, 
		START_EVENT  = hasTouch ? 'touchstart': 'mousedown',
		MOVE_EVENT   = hasTouch ? 'touchmove' : 'mousemove', 
		END_EVENT    = hasTouch ? 'touchend' : 'mouseup',
		CANCEL_EVENT = hasTouch ? 'touchcancel' : 'mouseup';
	
	var distanceAllow = 10;
	var startXY,tapEl,activeTimer;
	var isListener;//是否监听
	
	$(document).ready(function(){
		
		$(document.body).bind(START_EVENT, function(e){
			if (e.originalEvent)
                e = e.originalEvent;
			
			startXY = getXY(e);
			tapEl = parentByTap(e.target);
			if(tapEl){
				activeTimer = setTimeout(function(){
					$(tapEl).addClass("active");
				}, 100);
				isListener = true;
			}
		});

		$(document.body).bind(MOVE_EVENT, function(e){
			//标记
			if(!isListener)
				return;
			if (e.originalEvent)
                e = e.originalEvent;
			
			var xy = getXY(e);
			if(startXY && (Math.abs(xy[0] - startXY[0]) > distanceAllow 
				|| Math.abs(xy[1] - startXY[1]) > distanceAllow)){
				clearTimeout(activeTimer);
				if(tapEl){
					$(tapEl).removeClass("active");
				}
				startXY = null;
				tapEl = null;
			}
		});

		$(document.body).bind(END_EVENT, function(e){
			isListener = false;
			
			if (e.originalEvent)
                e = e.originalEvent;
			
			setTimeout(function(){
				if(tapEl){
					$(tapEl).removeClass("active");
					var strFn = $(tapEl).attr("ontap");
					if(strFn){
						(new Function(strFn)).call(tapEl);
					}
					var handlersCache = getTapHandler(tapEl);
					var paramsCache = getTapParam(tapEl);
					for(var i=0;i<handlersCache.length;i++){
						handlersCache[i].apply(tapEl,paramsCache[i]);
					}
				}
				clearTimeout(activeTimer);
				startXY = null;
				tapEl = null;
			}, 120);
			
		});
	});

	/*
	 * 绑定到zepto对象上,支持方法传入动态参数。 
	 */
	$.fn["tap"] = function(callback) {
		if(typeof(callback) == "string"){
			this.attr("ontap", callback);
		}else if(toString.call(callback) === "[object Function]"){
			var params;
			//第一个参数是函数体或函数名
			if (arguments.length > 1) {
				params = new Array();
				for ( var i = 1; i < arguments.length; i++) {
					params[i - 1] = arguments[i];
				}
			}
			this.each(function(){
				addTapHandler(this, callback, params);
			});
		}
	};
});