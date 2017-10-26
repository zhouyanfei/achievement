define(["jcl","wmWebUI"], function($,WmWebUI){
	var content = (function() {
		return document.body;
	})();
	/*获取像素*/
	var px = (function(){
		var div = document.createElement("div");
		div.style.cssText = "width:1rem; height:1rem; position:absolute; top:-1rem; left:0;";
		document.body.appendChild(div);
		var value = div.offsetWidth / 100;
		document.body.removeChild(div);
		return value;
	})();
	/*WmTab对象定义*/
	function WmTab(id){
		/*常用对象*/
		this.tab = WmWebUI.getElement(id);
		this.items = new Array();//子元素
		this.parLabels = this.tab.children('div .title').eq(0).children("ul");
		this.labels = this.parLabels.children('li');
		this.parentPages = this.tab.children('div .pages');
		this.pages = this.parentPages.children('div .page');
		this.currIndex;//当前页面的索引
		this.isAnimation = true;//是否使用动画
		this.tabContentHeight; //标签页高度?
		
		WmWebUI.store(id,this);
	}
	
	/*标签菜单项构造方法*/
	var WmTabItem = function(parent,index,domElement){
		this.parent = parent;	//父对象
		this.index = index;	//菜单项序号
		this.domElement = domElement;	//菜单项dom元素
		this.action;	//菜单项点击事件
		if(domElement.id){
			WmWebUI.store(domElement.id,this);
		}
		
		this.parent.pages[index].style.height = this.parent.tabContentHeight; //初始化标签页高度
		
		var that = this;
		/*绑定标签切换事件*/
		$(domElement).tap(function() {
			that.active();
		});
	}
	/*指定标签菜单项的点击事件*/
	WmTabItem.prototype.setAction = function(callback) {
		this.action = callback;
	};
	/*选中标签菜单项*/
	WmTabItem.prototype.active = function() {
		this.parent.active(this.index);
	};
	/*删除标签菜单项*/
	WmTabItem.prototype.remove = function() {
		this.parent.remove(this.index);
	};
	/*创建Tab对象*/
	WmTab.prototype.create = function(){
		var that = this;
		if(!this.tab){
			return;
		}
		/*根据页面数量来设置样式*/
		this.parentPages[0].className = this.parentPages[0].className+" pages-"+this.pages.length; //class="pages pages-2"
		
		/*tab页面的高度*/
		space = 12*px;
		var title = this.tab.find("div .title")[0];
		this.tabContentHeight = content.offsetHeight - title.offsetHeight - 3*space + "px";
		
		$.each(this.labels, function(index, label){
			that.items.push(new WmTabItem(that, index, label));
			if("on" == label.className)
				that.currIndex = index;
		});
		
		/*没有设置classe="on",则默认第一个*/
		if(!this.currIndex){
			this.currIndex = 0;
			this.labels[0].className = "on";
		}
		/*显示标签页面*/
		$.each(this.pages, function(index, page){
			if(that.currIndex == index){
				page.style.display="";
			}else{
				page.style.display="none";
			}
		});
	};
	/*获取标签菜单项*/
	WmTab.prototype.getTabItem = function(index){
		return this.items[index];
	}
	/*获取标签菜单项集合*/
	WmTab.prototype.getTabItems = function(){
		return this.items;
	}
	/*设置是否使用动画*/
	WmTab.prototype.setAnimation = function(isAnimation){
		this.isAnimation = isAnimation;
	}
	/*选中标签页*/
	WmTab.prototype.active = function(index){
		//防止传入数据异常
		if(!this.labels[index]){
			throw "WmTab组件越界";//错误信息如何处理
		}
		
		/*获取当前和先前的页面索引*/
		var curIdx = index;
		var prevIdx = this.currIndex;
		if(prevIdx == curIdx) return;
		
		/*隐藏不需要切换的页面,保证动画只在两个页面切换*/
		this.pages.each(function(idx){
			if (prevIdx != idx && curIdx != idx) {
				$(this).css("display", "none");
			} else {
				$(this).css("display", "block");
			}
		});
		
		var that = this;
		var pages = that.tab.find(".pages .page");
		/*判断是否使用动画*/
		if(this.isAnimation){
			$.ui.css3animate(pages, {
				x: ((curIdx > prevIdx)?"0":"-100") + "%",
				y: "0%",
				complete:function(){
					$.ui.css3animate(pages, {
						x: ((curIdx > prevIdx)?"-100":"0") + "%",
						y: "0%",
						time: $.ui.transitionTime,
						complete:function(){
							var wmTabItem = that.getTabItem(index);
							if(wmTabItem["action"]){
								wmTabItem.action();
							}
						}
					});
				}
			});
		}else{
			$(that.pages[prevIdx]).css("display","none");
			var wmTabItem = that.getTabItem(index);
			if(wmTabItem["action"]){
				wmTabItem.action();
			}
		}
		
		$(this.labels[prevIdx]).removeClass("on");
		$(this.labels[curIdx]).addClass("on");
		this.currIndex = index;
	};
	
	/*刷新全局变量*/
	WmTab.prototype.refresh = function(){
		this.parLabels = this.tab.children('div .title').eq(0).children("ul");
		this.labels = this.parLabels.children('li');
		this.parentPages = this.tab.children('div .pages');
		this.pages = this.parentPages.children('div .page');
		this.parentPages[0].className = this.parentPages[0].className+" pages-"+this.pages.length; 
	}
	
	/*添加标签页*/
	WmTab.prototype.add = function(label,content,index){
		if (index!=undefined && !isNaN(index)) {
			$(this.labels[index]).before('<li>' + label + '</li>');
			$(this.pages[index]).before('<div class="page">' + content + '</div>');
		}else{
			this.parLabels.append('<li>'+label+'</li>');
			this.parentPages.append('<div class="page">'+content+'</div>');
			index = this.pages.length;
		}
		this.refresh();
		
		var item = new WmTabItem(this,index,this.labels[index]);
		this.items.push(item);
		return item;
	};
	/*删除标签页*/
	WmTab.prototype.remove = function(index){
		if(!this.labels[index]){
			throw "WmTab组件越界";
		}
		$(this.labels[index]).remove();
		$(this.pages[index]).remove();
		this.refresh();
	};
	
	/*获取标签页的数量*/
	WmTab.prototype.length = function(){
		return this.labels.length;
	}
	/*导出WmTab*/
	return WmTab;
})
