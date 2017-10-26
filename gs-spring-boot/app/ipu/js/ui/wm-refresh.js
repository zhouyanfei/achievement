define(["iScroll"], function(iScroll){
	
	function WmRefresh(id){
		this.id = id;
		this.pullDownAction = null;
		this.pullUpAction = null;
		this.init();
		
	}
	
	/**
	* 下拉刷新 （自定义实现此方法）
	* myScroll.refresh();		// 数据加载完成后，调用界面更新方法
	*/
	
	WmRefresh.prototype.setPullDownAction = function(action){
		if(typeof(action) == "function") {
			this.pullDownAction = action;
		}
		
	}
	
	/**
	* 滚动翻页 （自定义实现此方法）
	* myScroll.refresh();		// 数据加载完成后，调用界面更新方法
	*/
	
	WmRefresh.prototype.setPullUpAction = function(action){
		if(typeof(action) == "function") {
			this.pullUpAction = action;
		}
	}

	/**
	* 初始化iScroll控件
	*/
	WmRefresh.prototype.init = function() { 
		var pullDownEl, pullDownOffset,
		pullUpEl, pullUpOffset;
		var that = this;
		var maxHeight = document.getElementById(that.id).offsetHeight + "px";
		document.getElementById("c-refresh-wrapper").style.height = maxHeight;
		pullDownEl = document.getElementById('pullDown');
		pullDownOffset = pullDownEl.offsetHeight;
		pullUpEl = document.getElementById('pullUp');	
		pullUpOffset = pullUpEl.offsetHeight;
		var myScroll = new iScroll('c-refresh-wrapper', {
		//	scrollbarClass: 'myScrollbar', /* 重要样式 */
			useTransition: true, /* 此属性不知用意，本人从true改为false */
			topOffset: pullDownOffset,
			onRefresh: function () {
				console.log(this.maxScrollY);
				if (pullDownEl.className.match('loading')) {
					pullDownEl.className = '';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
				} else if (pullUpEl.className.match('loading')) {
					pullUpEl.className = '';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
				}
			},
			onScrollMove: function () {
				if (this.y > 5 && !pullDownEl.className.match('flip')) {
					pullDownEl.className = 'flip';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
					this.minScrollY = 0;
				} else if (this.y < 5 && pullDownEl.className.match('flip')) {
					pullDownEl.className = '';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
					this.minScrollY = -pullDownOffset;
				} else{
					var c_height = document.getElementById("c-refresh-wrapper").offsetHeight;
					var s_height = document.getElementById("c-refresh-scroller").offsetHeight;
					var distance;
					if (c_height > s_height) {
						distance = - (1.5 * pullUpOffset);
					}else{
						distance = this.maxScrollY - pullUpOffset;
					}

					if (this.y < distance && !pullUpEl.className.match('flip')) {
						pullUpEl.className = 'flip';
						pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
						this.maxScrollY = this.maxScrollY;
					} else if (this.y > distance && pullUpEl.className.match('flip')) {
						pullUpEl.className = '';
						pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
						// this.maxScrollY = pullUpOffset;
					}
				}
			},
			onScrollEnd: function () {
				if (pullDownEl.className.match('flip')) {
					pullDownEl.className = 'loading';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
					if(that.pullDownAction){
						that.pullDownAction(myScroll);	
					}else{
						console.log("未定义下拉刷新方法");
						myScroll.refresh();	
					}
					
				} else if (pullUpEl.className.match('flip')) {
					pullUpEl.className = 'loading';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
					if(that.pullUpAction){
						that.pullUpAction(myScroll);	
					}else{
						console.log("未定义上拉加载更多");
						myScroll.refresh();	
					}
				}
			}
		});
	}
		
	return WmRefresh;
})
