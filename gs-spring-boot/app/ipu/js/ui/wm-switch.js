/**
 * 开关组件
 */
define(["jcl","wmWebUI"],function($,WmWebUI){
	function WmSwitch(id) {
		this.entity = WmWebUI.getElement(id);
		this.input = this.entity.find("input");// 存储开关状态的值
		this.span = this.entity.find("span");// 三个span，用来存储开、关、及开关滑块
		var space = 0;// 根据开关的默认状态，计算开关滑块到开关控件最边缘的间隙
		space = this.span[2].offsetLeft - this.span[2].offsetWidth;
		this.distance = this.entity[0].offsetWidth - this.span[2].offsetWidth - 2 * space;// 计算滑块左右应当移动的距离
		this.disabled = false;// 设置开关非禁用
		this.onAction;	// 开关打开事件
		this.offAction;	// 开关关闭事件
		this.changeAction;// 开关状态变化时的事件
		this.clickAction;// 开关点击事件
		
		WmWebUI.store(id,this);
	}

	WmSwitch.prototype.create=function(){
		dragEvent(this);
	};
	
	function getX(event){
		return event.touches?event.touches[0].pageX:event.clientX;
	};
	/*鼠标拖拽事件*/
	function dragEvent(that){
		var obj = that.entity[0];// 开关控件本身
		var blockObj = obj.children[2];// 滑块
		// 判断是否为触屏
		var hasTouch = "ontouchstart" in window;
		var START_EVENT = hasTouch ? "touchstart" : "mousedown";
		var MOVE_EVENT = hasTouch ? "touchmove" : "mousemove";
		var END_EVENT = hasTouch ? "touchend" : "mouseup";
		var CANCEL_EVENT = hasTouch ? "touchcancel" : "mouseup";
		
		var startX = -1;// 开始移动的位置
		var currElement;// 当前被操作的元素
		var isMoving = false;// 是否在移动
		var reg = /\-?[0-9]+/g;// 正则，用于获取translateX的数值
		var moveFlag = false;// 移动标志，用于区分是单击，还是移动事件
		// body上的鼠标结束移动回调函数
		var handler = function(event){
			switchEvent(event);
		}
		// body上的鼠标移动回调函数
		var moveHandler = function(event){
			moveEvent(event);
		}
		// 滑块上添加拖拽开始事件
		blockObj.addEventListener(START_EVENT,function(event){
			// 如果正在移动，则忽略
			if(!isMoving){
				// 记录当前被单击的对象
				currElement = obj;
				startX= getX(event);
				document.body.addEventListener(CANCEL_EVENT,handler,false);// 使用touchcancel事件
				document.body.addEventListener(MOVE_EVENT,moveHandler,false);
			}
		},false);
		// 在开关上添加移动事件
		obj.addEventListener(MOVE_EVENT,function(event){
			moveEvent(event);
		},false);
		// 在开关上添加移动结束事件
		obj.addEventListener(END_EVENT,function(event){
			if(currElement!=obj){
				if(!that.disabled){
					that.setValue(!that.getValue());
				}
				if(that.clickAction){
					that.clickAction(that.disabled);
				}
			}
			switchEvent(event);
		},false);
		// 在开关上添加移动取消事件
		obj.addEventListener(CANCEL_EVENT,function(event){
			switchEvent(event);
		},false);
		// 移动事件
		function moveEvent(event){
			if(currElement==obj){
				if(!that.disabled){
					moveFlag = true; //设置移动状态为true，区分单击事件
					var leftX = getX(event)-startX; // 鼠标当前位置与起始位置的偏移量
					// 如果开关为打开状态，则leftX为负数，that.distance为正数，并且不会执行下面一段逻辑
					// 如果开关为关闭状态，则leftX为正数，that.distance为正数，得到一个绝对值较小的负数
					if(!that.getValue()){
						leftX = leftX-that.distance;
					}
					// 计算出界
					if(leftX>=-that.distance && leftX<=0 ){
						blockObj.style.webkitTransform = "translateX(" + leftX + "px)"
					}
				}
			}
		}
		/*松开滑块自动执行动画*/
		function switchEvent(event){
			if(currElement==obj){
				// 使用currElement判断事件是否执行,同时也用来获取事件源
				currElement = null;	//currElement置空，表示一次操作结束。
				if(!that.disabled){
					if(moveFlag){
						isMoving = true;	//粘滞动画时锁定移动状态
						blockObj.style.webkitTransition="none";// 关闭css3动画
						// 获取到当前translateX的值
						var translateX=parseInt(blockObj.style.webkitTransform.match(reg));
						// 判断此时滑块在哪一边
						if(translateX<-that.distance/2 && translateX<0){
							blockObj.style.webkitTransition="-webkit-transform 0.1s ease";// 粘滞时长0.1秒
							blockObj.style.webkitTransform="translateX(-"+that.distance+"px)";
							if(that.getValue()){
								that.changeAction && that.changeAction();
								that.offAction && that.offAction();
							}
							that.input.val(false);
						}else{
							blockObj.style.webkitTransition="-webkit-transform 0.1s ease";// 粘滞时长0.1秒
							blockObj.style.webkitTransform="translateX(0px)";
							if(!that.getValue()){
								that.changeAction && that.changeAction();
								that.onAction && that.onAction();
							}
							that.input.val(true);
						}
						setTimeout(function(){
							blockObj.style.webkitTransition="none";// 关闭动画
							isMoving = false;// 动画完成时自动解除锁定
						},200);
					}else{
						that.setValue(!that.getValue());// 单击则改变开关状态
					}
				}
				document.body.removeEventListener(END_EVENT,handler,false);
				document.body.removeEventListener(MOVE_EVENT,moveHandler,false);
				moveFlag = false;
			}
		}
	}
	/*设置开关是否可用*/
	WmSwitch.prototype.setDisabled = function(disabled){
		if(disabled==undefined){
			return this.disabled;
		}
		
		if(disabled){
			this.disabled = true;
			this.entity.addClass("e_dis");
		}else{
			this.disabled = false;
			this.entity.removeClass("e_dis");
		}
	};
	/*设置开关文本*/
	WmSwitch.prototype.setLabel = function(label) {
		var strs = label.split("|");
		this.span[0].innerHTML = strs[0];
		this.span[1].innerHTML = strs[1];
	};
	/*获取开关文本*/
	WmSwitch.prototype.getLabel = function() {
		return this.span[0].innerHTML + "|" + this.span[1].innerHTML;
	};
	/*设置开关的值*/
	WmSwitch.prototype.setValue = function(value) {
		if (this.getValue() != value) {
			if (value) {
				this.onAction && this.onAction();
				this.changeAction && this.changeAction();
				this.span[2].style.webkitTransition = "-webkit-transform 0.2s ease";// 滑动时长0.1秒
				this.span[2].style.webkitTransform = "translateX(0px)";
			} else {
				this.offAction && this.offAction();
				this.changeAction && this.changeAction();
				this.span[2].style.webkitTransition = "-webkit-transform 0.2s ease";// 滑动时长0.1秒
				this.span[2].style.webkitTransform = "translateX(-" + this.distance + "px)";
			}
			this.input.val(value);
		}
	};
	/*获取开关的值*/
	WmSwitch.prototype.getValue = function(){
		return this.input.val()=="true";
	};
	/*指定开关打开事件*/
	WmSwitch.prototype.setOnAction=function(callback){
		this.onAction = callback;	
	};
	/*指定开关关闭事件*/
	WmSwitch.prototype.setOffAction=function(callback){
		this.offAction = callback;
	};
	/*指定开关状态变化时的事件*/
	WmSwitch.prototype.setChangeAction=function(callback){
		this.changeAction = callback;
	}
	return WmSwitch;
});
