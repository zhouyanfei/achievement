define(["jcl","iScroll","wmWebUI"],function($,iScroll,WmWebUI){
	/*标签菜单构造方法*/
	var WmTabbar = function(id){
		/*常用对象*/
		this.tabbar = WmWebUI.getElement(id);
	
		//this.navs = this.tabbar.find(".m_nav > .wrapper .nav ");
		//this.footers = this.tabbar.find("div[class=m_footer] li");
		//使用children会更加严谨
		this.navs = this.tabbar.children(".m_nav").eq(0).children(".wrapper").eq(0).children(".nav");
		this.footers = this.tabbar.children(".m_footer").eq(0).children("ul").eq(0).children("li");
		this.items = new Array();//子元素
		this.currIndex;//当前页面的索引
		this.isAnimation = true;//是否使用动画
		
		WmWebUI.store(id,this);
	}
	/*标签菜单项构造方法*/
	var WmTabbarItem = function(parent,index,domElement){
		this.parent = parent;	//父对象
		this.index = index;	//菜单项序号
		this.domElement = domElement;	//菜单项dom元素
		this.action;	//菜单项点击事件
		if(domElement.id){
			WmWebUI.store(domElement.id,this);
		}
	}
	/*指定标签菜单项的点击事件*/
	WmTabbarItem.prototype.setAction = function(callback) {
		this.action = callback;
	};
	/*选中标签菜单项*/
	WmTabbarItem.prototype.active = function() {
		this.parent.active(this.index);
	};
	
	WmTabbar.prototype.create = function(){
		var that = this;
		/*构建底部菜单对象*/
		this.footers.each(function(index){
			that.items.push(new WmTabbarItem(that,index,this));
			if("on" == this.className)
				that.currIndex = index;
		});
		/*没有设置classe="on",则默认第一个*/
		if(!this.currIndex){
			this.currIndex = 0;
			this.footers[0].className = "on";
		}
		/*增加iScroll的效果*/
		this.navs.each(function(idx){
			if(this&&this.children[0]){
				var mScroll = new iScroll(this);//存在元素则增加iScroll
                setTimeout(function(){
                    mScroll.refresh();
                },100);
			}
			if(that.currIndex != idx){
				$(this).css("display","none");
			}
		});
		/*设置样式*/
		this.tabbar.find(".m_nav").addClass("m_nav-col-2");//一定是2

		this.footers.each(function(index){
			$(this).tap(function(idx){
				that.active(idx);
			},index)
		});
	}
	
	/*获取标签菜单项*/
	WmTabbar.prototype.getTabbarItem = function(index){
		return this.items[index];
	}
	/*获取标签菜单项集合*/
	WmTabbar.prototype.getTabbarItems = function(){
		return this.items;
	}
	/*设置是否使用动画*/
	WmTabbar.prototype.setAnimation = function(isAnimation){
		this.isAnimation = isAnimation;
	}
	/*选中标签菜单页*/
	WmTabbar.prototype.active = function(index){
		if(!this.navs[index]){
			throw "WmTabbar组件越界";//错误信息如何处理
		}
		var that = this;
		/*获取当前和先前的页面索引*/
		var curIdx = index;
		var prevIdx = that.currIndex;
		if(prevIdx == curIdx) return;
		/*隐藏不需要切换的页面,保证动画只在两个页面切换*/
		that.navs.each(function(idx){
			if(prevIdx != idx && curIdx != idx)
				$(this).css("display","none");
			else 
				$(this).css("display","");
		});

		/*判断是否使用动画*/
		if(this.isAnimation){
			var wrapper = that.tabbar.find(".m_nav > .wrapper");
			$.ui.css3animate(wrapper, {
				x: ((curIdx > prevIdx)?"0":"-50") + "%",
				y: "0%",
				complete:function(){
					$.ui.css3animate(wrapper, {
						x: ((curIdx > prevIdx)?"-50":"0") + "%",
						y: "0%",
						time: $.ui.transitionTime,
						complete:function(){
							var wmTabbarItem = that.getTabbarItem(index);
							if(wmTabbarItem["action"]){
								wmTabbarItem.action();
							}
						}
					});
				}
			});
		}else{
			$(that.navs[prevIdx]).css("display","none");
			var wmTabbarItem = that.getTabbarItem(index);
			if(wmTabbarItem["action"]){
				wmTabbarItem.action();
			}
		}
		
		$(that.footers[prevIdx]).removeClass("on");
		$(that.footers[curIdx]).addClass("on");
		
		that.currIndex = curIdx;
	};
	
	return WmTabbar;
});
