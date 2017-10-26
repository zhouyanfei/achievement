/*!
 * touch events handler
 * http://www.wadecn.com/
 * auth:xiedx@asiainfo.com
 * Copyright 2015, WADE
 */
define(["jcl"],function($) {
	"use strict";
	
	$.tapPressedClassName = "active";
	
	var toString = Object.prototype.toString,
		push = Array.prototype.push,
		splice = Array.prototype.slice,//TODO splice方法存在异议
		indexOf = Array.prototype.indexOf;
	var expando = "touchevents" + (new Date()).valueOf(), uuid = 0;

	//event
	var hasTouch     = "ontouchstart" in window;
	var START_EVENT  = hasTouch ? 'touchstart': 'mousedown',
		MOVE_EVENT   = hasTouch ? 'touchmove' : 'mousemove', 
		END_EVENT    = hasTouch ? 'touchend' : 'mouseup',
		CANCEL_EVENT = hasTouch ? 'touchcancel' : 'mouseup';

	var handleCache = {};

	function addHandle(type, elem, callback){
		if(!type || !elem)
			return;
			
		var id = elem[expando];
		if(!id){
			id = ++ uuid;
			elem[expando] = id;
		}
		var handles = handleCache[type][id];
		if(!handles){
			handles = handleCache[type][id] = [];
		}
		push.call(handles, callback);
	}
	
	function removeHandle(type, elem, callback){
		if(!type || !elem)
			return;
			
		var id = elem[expando];
		if(!id){
			id = ++ uuid;
			elem[expando] = id;
		}
		
		var handles = handleCache[type][id];
		if(handles){
			var idx = indexOf.call(handles, callback);
			//TODO splice方法存在异议
			if(idx > -1) splice.call(handles, callback);
		}
	}

	function getHandle(type, elem){
		if(!type || !elem)
			return;
			
		var id = elem[expando];
		if(id && handleCache[type][id]){
			return handleCache[type][id];
		}
		return [];
	}
	
	function triggerHandle(type, elem, e){
		if(!type || !elem)
			return;
			
		var handles = getHandle(type, elem);
		if(!handles) return;
		for(var i = 0; i < handles.length; i++){
			handles[i].call(elem, e);
		}
	}
	
	function parentIfText(node) {
        return "tagName" in node ? node : node.parentNode;
    }

	function parentByEventType(type, node){
		if(!type || !node || !node.nodeType) return;
		var i = 0;
		while((!("tagName" in node) || (!("tap" == type && "ontap" in node.attributes) && !getHandle(type, node).length)) && i < 10){
			if(!node.parentNode || 1 != node.parentNode.nodeType)
				break;
			node = node.parentNode;
			i ++;
		}
		
		if(("tap" == type && "ontap" in node.attributes) || getHandle(type, node).length)
			return node;
	}

    function preventAll(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function getTarget(e){
    	return hasTouch ? e.touches[0].target : e.target;
    }

	function getXY(e){
		var x = hasTouch ? e.touches[0].pageX : e.clientX;
		var y = hasTouch ? e.touches[0].pageY : e.clientY;
		return [x,y];
	}
	
	function formNode(el){
		return $.nodeName(el, "input") || $.nodeName(el, "textarea") || $.nodeName("select");
	}
	
	var isMoved = false;
	var touch = {};
	var pressMaxDist = 10; //触发pressed事件的最大距离
	var swipeMinDist = 30; //触发swipe事件最小距离
	var longTapDelay = 500; //长点击时间值
	var tapEl;
	var pressTimer, longTapTimer, touchTimer;
	
	function swipeDirection(x1, x2, y1, y2) {
        var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
        if (xDelta >= yDelta) {
            return (x1 - x2 > 0 ? "Left" : "Right");
        } else {
            return (y1 - y2 > 0 ? "Up" : "Down");
        }
    }
    
	function longTap() {
        if (touch.last && (Date.now() - touch.last >= longTapDelay)) {
        	triggerHandle("longTap", touch.el);
            //touch = {};
        }
    }
    
	function docMoveEvent(e){
		if (e.originalEvent)
		   e = e.originalEvent;
		
		var xy = getXY(e);
		touch.x2 = xy[0];
		touch.y2 = xy[1];

		if(tapEl && touch.x1 && touch.y1 && 
			xy && xy.length && xy[0] && (Math.abs(xy[0] - touch.x1) > pressMaxDist 
			|| Math.abs(xy[1] - touch.y1) > pressMaxDist)){
			
			isMoved = true;
			clearTimeout(longTapTimer);
			clearTimeout(pressTimer);
			
			if(tapEl){
				$(tapEl).removeClass($.tapPressedClassName);
				tapEl = null;
			}
		}
	}

	function tapEndEvent(e){
		if(isMoved) return;
		
		e.touch = touch;
				
		touchTimer = setTimeout((function(event){
			return function(){
				touchTimer = null;
				if(tapEl){
					$(tapEl).removeClass($.tapPressedClassName);
					var strFn = $(tapEl).attr("ontap");
					if(strFn){
						(new Function(strFn)).call(tapEl, event);
					}
					triggerHandle("tap", tapEl);
				}
				clearTimeout(pressTimer);
				tapEl = null;
			};
		})(e), 120);
	}

	$(document).ready(function(){
		
		$(document.body).bind(START_EVENT, function(e){
			if (e.originalEvent)
           		e = e.originalEvent;

			var target = getTarget(e);
			if(!target) return;

			$(document.body).bind(MOVE_EVENT, docMoveEvent);

			if(formNode(target)){
				preventAll(e);
				return;
			}
					
			var now = Date.now(), delta = now - (touch.last || now);
			var xy = getXY(e);
			if(xy && xy.length && xy[0]){
				
				pressTimer && clearTimeout(pressTimer);
				touchTimer && clearTimeout(touchTimer);
				
				touch.el = parentIfText(target);
				touch.x1 = xy[0];
				touch.y1 = xy[1];
				touch.x2 = touch.y2 = 0;
				touch.last = now;

				if (delta > 0 && delta <= 300)
                	touch.isDoubleTap = true;
                	
            	longTapTimer = setTimeout(longTap, longTapDelay);
            
				var findTapEl = parentByEventType("tap", target);
				if(findTapEl){
					pressTimer = setTimeout(function(){
						$(tapEl).addClass($.tapPressedClassName);
					}, 100);
					if(tapEl && findTapEl != tapEl){
						$(tapEl).removeClass($.tapPressedClassName);
					}
				}
				tapEl = findTapEl;

				//排除双击时触发单击
				if(tapEl && !touch.isDoubleTap){
					$(tapEl).bind(END_EVENT, tapEndEvent);
				}
			}
		});

		$(document.body).bind(END_EVENT, function(e){
			if (e.originalEvent)
                e = e.originalEvent;

			setTimeout(function(){
				isMoved = false;
			}, 100);

			$(document.body).unbind(MOVE_EVENT, docMoveEvent);

			if(!touch.el || !touch.el.nodeType)
				return;
			
			touch.originalEvent = e;

			if (touch.isDoubleTap) {
				triggerHandle("doubleTap", touch.el, e);
				touch = {};
			}else if( (touch.x2 > 0 || touch.y2 > 0)
					&& (Math.abs(touch.x1 - touch.x2) > swipeMinDist || Math.abs(touch.y1 - touch.y2) > swipeMinDist)){
				
				var direct = swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2);
				e.touch = touch;
				
				triggerHandle("swipe", parentByEventType("swipe", touch.el), e);
				triggerHandle("swipe" + direct,  parentByEventType("swipe" + direct, touch.el), e);	

				touch = {};
                //touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0;
			}else if(tapEl && "last" in touch){
				//清除timer
				(Date.now() - touch.last >= longTapDelay) ? clearTimeout(touchTimer) : clearTimeout(longTapTimer);
				
				if(tapEl){
					$(tapEl).unbind(END_EVENT, tapEndEvent);
				}
			}
		});
		
		if(hasTouch){
			$(document.body).bind("touchcancel", function(e){
				touch = {};
				clearTimeout(longTapTimer);
			});
		}
	});
	
	var bindFn = $.fn["bind"];
	var unbindFn = $.fn["unbind"];
	var events = ["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "tap", "doubleTap", "longTap"];
	
	$.fn["bind"] = function(type, data, fn){
		if(arguments.length === 2 || data === false){
			fn = data;
			data = undefined;
		}
		
		if(indexOf.call(events, type) > -1){
			if("tap" == type && typeof(fn) == "string"){
				this.attr("ontap", callback);
			}else if(toString.call(fn) === "[object Function]"){
				this.each(function(){
					addHandle(type, this, fn);
				});
			}
			return this;
		}
		
		return bindFn.call(this, type, data, fn);
	};

	$.fn["unbind"] = function(type, fn){
		if(indexOf.call(events, type) > -1){
			if("tap" == type && typeof(fn) == "string"){
				this.attr("ontap", null);
			}else if(toString.call(fn) === "[object Function]"){
				this.each(function(){
					removeHandle(type, this, fn);
				});
			}
			return this;
		}
		
		return unbindFn.call(this, type, fn);
	};

    $.each(events, function(i, m) {
    	handleCache[m] = {};
        $.fn[m] = function(callback) {
            return this.bind(m, callback);
        };
    });
    
	$(document).bind("drag", preventAll);
	$(document).bind("dragstart", preventAll);
	$(document).bind("dragenter", preventAll);
	$(document).bind("dragover", preventAll);
	$(document).bind("dragleave", preventAll);
	$(document).bind("dragend", preventAll);
	$(document).bind("drop", preventAll);
	
});