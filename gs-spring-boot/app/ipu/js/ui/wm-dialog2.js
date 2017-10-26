/*引入util对应的js文件*/
define(['util'], function(){
	var isClose = true;
	/*WmNavBar对象定义*/
	function WmDialog2(id){
		this.listeners = new Array(); //存储监听事件
		this.id = id;
		/*常用对象*/
		this.box = (function(obj){
			if(typeof(obj)=="object"){
				obj = $(obj);
			}else if(typeof(obj)=="string"){
				obj = $("#"+obj);
			}else{
				alert("没有匹配类型");
				return null;
			}
			return obj;
		})(id);
		this.negativeButton = this.box.find(".s-dialog-cancle");
		this.positiveButton = this.box.find(".s-dialog-ok");
		this.title = this.box.find('.s-dialog-title');
		this.mainView = this.box.find('.s-dialog-mainview');
		
		var that = this;
		this.negativeButton.tap(function(){
			that.hide();
		});
	}
	
	WmDialog2.prototype.show = function(){
		this.box.addClass('s-dialog-show');
	}
	
	WmDialog2.prototype.hide = function(){
		this.box.removeClass('s-dialog-show');
	}
	
	WmDialog2.prototype.setPositiveAction = function(action,isHide){
		var that = this;
		if(this.positiveButton.length != 0){
			this.positiveButton.tap(function(){
				if(typeof(action) == "function") {
					action();
				}
				if(isHide){
					that.hide();
				}
			});
		}
	}
	
	WmDialog2.prototype.setNegativeAction = function(action,isHide){
		var that = this;
		if(this.negativeButton.length != 0){
			this.negativeButton.tap(function(){
				if(typeof(action) == "function") {
					action();
				}
				if(isHide){
					that.hide();
				}
			});
		}
	}
	
	WmDialog2.prototype.setTitle = function(title){
		this.title.text(title);
	}
	/*设置内容*/
	WmDialog2.prototype.setContentView = function(str,setBy) {
		if (setBy == "html") {
			this.mainView.html($("#" + str).html());
		} else {
			this.mainView.html("<div>" + str + "</div>");
		}
	}
	
	return WmDialog2;
});
