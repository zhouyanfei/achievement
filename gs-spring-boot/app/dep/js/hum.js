;(function($){
  var data = {}, dataAttr = $.fn.data, camelize = $.camelCase,
    exp = $.expando = 'Zepto' + (+new Date()), emptyArray = []

  // Get value from node:
  // 1. first try key as given,
  // 2. then try camelized key,
  // 3. fall back to reading "data-*" attribute.
  function getData(node, name) {
    var id = node[exp], store = id && data[id]
    if (name === undefined) return store || setData(node)
    else {
      if (store) {
        if (name in store) return store[name]
        var camelName = camelize(name)
        if (camelName in store) return store[camelName]
      }
      return dataAttr.call($(node), name)
    }
  }

  // Store value under camelized key on node
  function setData(node, name, value) {
    var id = node[exp] || (node[exp] = ++$.uuid),
      store = data[id] || (data[id] = attributeData(node))
    if (name !== undefined) store[camelize(name)] = value
    return store
  }

  // Read all "data-*" attributes from a node
  function attributeData(node) {
    var store = {}
    $.each(node.attributes || emptyArray, function(i, attr){
      if (attr.name.indexOf('data-') == 0)
        store[camelize(attr.name.replace('data-', ''))] =
          $.zepto.deserializeValue(attr.value)
    })
    return store
  }

  $.fn.data = function(name, value) {
    return value === undefined ?
      // set multiple values via object
      $.isPlainObject(name) ?
        this.each(function(i, node){
          $.each(name, function(key, value){ setData(node, key, value) })
        }) :
        // get value from first element
        (0 in this ? getData(this[0], name) : undefined) :
      // set value on all elements
      this.each(function(){ setData(this, name, value) })
  }

  $.fn.removeData = function(names) {
    if (typeof names == 'string') names = names.split(/\s+/)
    return this.each(function(){
      var id = this[exp], store = id && data[id]
      if (store) $.each(names || store, function(key){
        delete store[names ? camelize(this) : key]
      })
    })
  }

  // Generate extended `remove` and `empty` functions
  ;['remove', 'empty'].forEach(function(methodName){
    var origFn = $.fn[methodName]
    $.fn[methodName] = function() {
      var elements = this.find('*')
      if (methodName === 'remove') elements = elements.add(this)
      elements.removeData()
      return origFn.call(this)
    }
  })
})(window.Zepto);

!function ($) {
	var _private = {};
	_private.cache = {};
	$.tpl = function (str, data, env) {
		// 判断str参数，如str为script标签的id，则取该标签的innerHTML，再递归调用自身
		// 如str为HTML文本，则分析文本并构造渲染函数
		var fn = !/[^\w\-\.:]/.test(str)
			? _private.cache[str] = _private.cache[str] || this.get(document.getElementById(str).innerHTML)
			: function (data, env) {
			var i, variable = [], value = []; // variable数组存放变量名，对应data结构的成员变量；value数组存放各变量的值
			for (i in data) {
				variable.push(i);
				value.push(data[i]);
			}
			return (new Function(variable, fn.code))
				.apply(env || data, value); // 此处的new Function是由下面fn.code产生的渲染函数；执行后即返回渲染结果HTML
		};

		fn.code = fn.code || "var $parts=[]; $parts.push('"
			+ str
			.replace(/\\/g, '\\\\') // 处理模板中的\转义
			.replace(/[\r\t\n]/g, " ") // 去掉换行符和tab符，将模板合并为一行
			.split("<%").join("\t") // 将模板左标签<%替换为tab，起到分割作用
			.replace(/(^|%>)[^\t]*/g, function(str) { return str.replace(/'/g, "\\'"); }) // 将模板中文本部分的单引号替换为\'
			.replace(/\t=(.*?)%>/g, "',$1,'") // 将模板中<%= %>的直接数据引用（无逻辑代码）与两侧的文本用'和,隔开，同时去掉了左标签产生的tab符
			.split("\t").join("');") // 将tab符（上面替换左标签产生）替换为'); 由于上一步已经把<%=产生的tab符去掉，因此这里实际替换的只有逻辑代码的左标签
			.split("%>").join("$parts.push('") // 把剩下的右标签%>（逻辑代码的）替换为"$parts.push('"
			+ "'); return $parts.join('');"; // 最后得到的就是一段JS代码，保留模板中的逻辑，并依次把模板中的常量和变量压入$parts数组

		return data ? fn(data, env) : fn; // 如果传入了数据，则直接返回渲染结果HTML文本，否则返回一个渲染函数
	};
	$.adaptObject =  function (element, defaults, option,template,plugin,pluginName) {
    var $this= element;

    if (typeof option != 'string'){
    
    // 获得配置信息
    var context=$.extend({}, defaults,  typeof option == 'object' && option);

    var isFromTpl=false;
    // 如果传入script标签的选择器
    if($.isArray($this) && $this.length && $($this)[0].nodeName.toLowerCase()=="script"){
      // 根据模板获得对象并插入到body中
      $this=$($.tpl($this[0].innerHTML,context)).appendTo("body");
      isFromTpl=true;
    }
    // 如果传入模板字符串
    else if($.isArray($this) && $this.length && $this.selector== ""){
      // 根据模板获得对象并插入到body中
      $this=$($.tpl($this[0].outerHTML,context)).appendTo("body");
      isFromTpl=true;
    }
    // 如果通过$.dialog()的方式调用
    else if(!$.isArray($this)){
      // 根据模板获得对象并插入到body中
      $this=$($.tpl(template,context)).appendTo("body");
      isFromTpl=true;
    }

    }

    return $this.each(function () {

      var el = $(this);
      // 读取对象缓存
  
      var data  = el.data('hum.'+pluginName);
      


      if (!data) el.data('hum.'+pluginName, 
        (data = new plugin(this,$.extend({}, defaults,  typeof option == 'object' && option),isFromTpl)

      ));

      if (typeof option == 'string') data[option]();
    })
  }
}(window.Zepto);



(function($){
	$.fn.dater = function(config){
		var defaults = {
			maxDate : null,
			minDate : new Date(1970, 0, 1)
		};
		var option = $.extend(defaults, config);
		var input = this;

		//通用函数
		var F = {
			//计算某年某月有多少天
			getDaysInMonth : function(year, month){
			    return new Date(year, month+1, 0).getDate();
			},
			//计算某月1号是星期几
			getWeekInMonth : function(year, month){
				return new Date(year, month, 1).getDay();
			},
			getMonth : function(m){
				return ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'][m];
			},
			//计算年某月的最后一天日期
			getLastDayInMonth : function(year, month){
				return new Date(year, month, this.getDaysInMonth(year, month));
			}
		}

		//为$扩展一个方法，以配置的方式代理事件
		$.fn.delegates = function(configs) {
		    el = $(this[0]);
		    for (var name in configs) {
		        var value = configs[name];
		        if (typeof value == 'function') {
		            var obj = {};
		            obj.click = value;
		            value = obj;
		        };
		        for (var type in value) {
		            el.delegate(name, type, value[type]);
		        }
		    }
		    return this;
		}

		var dater = {
			value : {
				year : '',
				month : '',
				date : ''
			},
			lastCheckedDate : '',
			init : function(){
				this.renderHTML();
				this.initListeners();
			},
			renderHTML : function(){
				var $html = $('<div class="ui-dater-mask"></div><div class="ui-dater-panel"><div class="ui-dater-head"><div class="ui-dater-selectarea"><a class="ui-dater-prev change_year" href="javascript:void(0);">&lt;</a> <a class="ui-dater-headtext yeartag" href="javascript:void(0);"></a> <a class="ui-dater-next change_year" href="javascript:void(0);">&gt;</a></div><div class="ui-dater-selectarea"><a class="ui-dater-prev change_month" href="javascript:void(0);">&lt;</a> <a class="ui-dater-headtext monthtag" href="javascript:void(0);">月</a> <a class="ui-dater-next change_month" href="javascript:void(0);">&gt;</a></div></div><div class="ui-dater-body"><ul class="ui-dater-weekarea"><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul><ul class="ui-dater-datearea in"></ul></div><div class="ui-dater-foot"><a href="javascript:void(0);" class="ui-dater-ok">确定</a> <a href="javascript:void(0);" class="ui-dater-cancel">取消</a></div></div>');

				$(document.body).append($html);
			},
			_showPanel : function(container){
				this.refreshView();
				$('.ui-dater-panel, .ui-dater-mask').addClass('show');
			},
			_hidePanel : function(){
				$('.ui-dater-panel, .ui-dater-mask').removeClass('show');
			},
			_changeMonth : function(add, checkDate){

				//先把已选择的日期保存下来
				this.saveCheckedDate();

				var monthTag = $('.ui-dater-selectarea').find('.monthtag'),
					num = ~~monthTag.data('month')+add;
				//月份变动发生了跨年
				if(num>11){
					num = 0;
					this.value.year++;
					$('.yeartag').text(this.value.year).data('year', this.value.year);
				}
				else if(num<0){
					num = 11;
					this.value.year--;
					$('.yeartag').text(this.value.year).data('year', this.value.year);
				}

				var nextMonth = F.getMonth(num)+'月';
				monthTag.text(nextMonth).data('month', num);
				this.value.month = num;
				if(checkDate){
					this.value.date = checkDate;
				}
				else{
					//如果有上次选择的数据，则进行赋值
					this.setCheckedDate();
				}
				this.updateDate(add);
			},
			_changeYear : function(add){
				//先把已选择的日期保存下来
				this.saveCheckedDate();

				var yearTag = $('.ui-dater-selectarea').find('.yeartag'),
					num = ~~yearTag.data('year')+add;
				yearTag.text(num+'年').data('year', num);
				this.value.year = num;
				
				this.setCheckedDate();

				this.updateDate(add);
			},
			//保存上一次选择的数据
			saveCheckedDate : function(){
				if(this.value.date){
					this.lastCheckedDate = {
						year : this.value.year,
						month : this.value.month,
						date : this.value.date
					}
				}
			},
			//将上一次保存的数据恢复到界面
			setCheckedDate : function(){
				if(this.lastCheckedDate && this.lastCheckedDate.year==this.value.year && this.lastCheckedDate.month==this.value.month){
					this.value.date = this.lastCheckedDate.date;
				}
				else{
					this.value.date = '';
				}
			},
			//根据日期得到渲染天数的显示的HTML字符串
			getDateStr : function(y, m, d){
				var dayStr = '';
				//计算1号是星期几，并补上上个月的末尾几天
				var week = F.getWeekInMonth(y, m);
				var lastMonthDays = F.getDaysInMonth(y, m-1);
				for(var j=week-1; j>=0; j--){
					dayStr += '<li class="prevdate" data-day="'+(lastMonthDays-j)+'">'+(lastMonthDays-j)+'</li>';
				}
				//再补上本月的所有天;
				var currentMonthDays = F.getDaysInMonth(y, m);
				//判断是否超出允许的日期范围
				var startDay = 1, 
					endDay = currentMonthDays, 
					thisDate = new Date(y, m, d),
					firstDate = new Date(y, m, 1);
					lastDate =  new Date(y, m, currentMonthDays),
					minDateDay = option.minDate.getDate();
					

				if(option.minDate>lastDate){
					startDay = currentMonthDays+1;
				}
				else if(option.minDate>=firstDate && option.minDate<=lastDate){
					startDay = minDateDay;
				}

				if(option.maxDate){
					var maxDateDay = option.maxDate.getDate();
					if(option.maxDate<firstDate){
						endDay = startDay-1;
					}
					else if(option.maxDate>=firstDate && option.maxDate<=lastDate){
						endDay = maxDateDay;
					}
				}
				

				//将日期按允许的范围分三段拼接
				for(var i=1; i<startDay; i++){
					dayStr += '<li class="disabled" data-day="'+i+'">'+i+'</li>';
				}
				for(var j=startDay; j<=endDay; j++){
					var current = '';
					if(y==this.value.year && m==this.value.month && d==j){
						current = 'current';
					}
					dayStr += '<li class="'+current+'" data-day="'+j+'">'+j+'</li>';
				}
				for(var k=endDay+1; k<=currentMonthDays; k++){
					dayStr += '<li class="disabled" data-day="'+k+'">'+k+'</li>';
				}

				//再补上下个月的开始几天
				var nextMonthStartWeek = (currentMonthDays + week) % 7;
				if(nextMonthStartWeek!==0){
					for(var i=1; i<=7-nextMonthStartWeek; i++){
						dayStr += '<li class="nextdate" data-day="'+i+'">'+i+'</li>';
					}
				}

				return dayStr;
			},
			updateDate : function(add){
				var dateArea = $('.ui-dater-datearea.in');
				if(add == 1){
					var c1 = 'out_left';
					var c2 = 'out_right';
				}
				else{
					var c1 = 'out_right';
					var c2 = 'out_left';	
				}
				var newDateArea = $('<ul class="ui-dater-datearea '+c2+'"></ul>');
				newDateArea.html(this.getDateStr(this.value.year, this.value.month, this.value.date));
				$('.ui-dater-body').append(newDateArea);
				setTimeout(function(){
					newDateArea.removeClass(c2).addClass('in');
					dateArea.removeClass('in').addClass(c1);
				}, 0);
				
			},
			//每次调出panel前，对界面进行重置
			refreshView : function(){
				var initVal = input.val(),
					date = null;
				if(initVal){
					var arr = initVal.split('-');
					date = new Date(arr[0], arr[1]-1 , arr[2]);
				}
				else{
					date = new Date();
				}
				var y = this.value.year = date.getFullYear(),
					m = this.value.month = date.getMonth(),
					d = this.value.date = date.getDate();
				$('.yeartag').text(y).data('year', y);
				$('.monthtag').text(F.getMonth(m)+'月').data('month', m);
				var dayStr = this.getDateStr(y, m, d);
				$('.ui-dater-datearea').html(dayStr);
			},
			initListeners : function(){
				var panel = $('.ui-dater-panel'),
					mask = $('.ui-dater-mask'),
					_this = this;

				input.on('click', function(){
					if(panel.hasClass('show')){
						_this._hidePanel();
					}
					else{
						_this._showPanel();
					}
				});

				mask.on('click', function(){
					_this._hidePanel();
				});

				panel.delegates({
					'.change_month' : function(){
						var add = $(this).hasClass('ui-dater-next') ? 1 : -1;
						_this._changeMonth(add);
					},
					'.change_year' : function(){
						var add = $(this).hasClass('ui-dater-next') ? 1 : -1;
						_this._changeYear(add);	
					},
					'.out_left, .out_right' : {
						'webkitTransitionEnd' : function(){
							$(this).remove();
						}
					},
					'.ui-dater-datearea li' : function(){
						var $this = $(this);
						if($this.hasClass('disabled')){
							return;
						}
						_this.value.date = $this.data('day');
						//判断是否点击的是前一月或后一月的日期
						var add = 0;
						if($this.hasClass('nextdate')){
							add = 1;
						}
						else if($this.hasClass('prevdate')){
							add = -1;
						}

						if(add !== 0){
							_this._changeMonth(add, _this.value.date);
						}
						else{
							$this.addClass('current').siblings('.current').removeClass('current');	
						}						
					},
					'.ui-dater-ok' : function(){
						var monthValue = ~~_this.value.month + 1;
						if(monthValue < 10){
							monthValue = '0' + monthValue;
						}
						var dateValue = _this.value.date;
						if(dateValue === ''){
							dateValue = _this.value.date = 1;
						}
						if(dateValue < 10){
							dateValue = '0' + dateValue;
						}
						input.val(_this.value.year + '-' + monthValue + '-' + dateValue);
						_this._hidePanel();
					},
					'.ui-dater-cancel' : function(){
						_this._hidePanel();
					}
				});

			}
		}
		dater.init();
	}
})(Zepto);
!function($){

	// 默认模板
	var _dialogTpl='<div class="ui-dialog">'+
        '<div class="ui-dialog-cnt">'+
            '<div class="ui-dialog-bd">'+
                '<div>'+
                '<h4><%=title%></h4>'+
                '<div><%=content%></div></div>'+
            '</div>'+
            '<div class="ui-dialog-ft ui-btn-group">'+
            	'<% for (var i = 0; i < button.length; i++) { %>' +
				'<% if (i == select) { %>' +
				'<button type="button" data-role="button"  class="select" id="dialogButton<%=i%>"><%=button[i]%></button>' +
				'<% } else { %>' +
				'<button type="button" data-role="button" id="dialogButton<%=i%>"><%=button[i]%></div>' +
				'<% } %>' +
				'<% } %>' +
            '</div>'+
        '</div>'+        
    '</div>';
	// 默认参数
	var defaults={
		title:'',
		content:'',
		button:['确认'],
		select:0,
		allowScroll:false,
		callback:function(){}
	}
	// 构造函数
	var Dialog  = function (el,option,isFromTpl) {

		this.option=$.extend(defaults,option);
		this.element=$(el);
		this._isFromTpl=isFromTpl;
		this.button=$(el).find('[data-role="button"]');
		this._bindEvent();
		this.toggle();
	}
	Dialog.prototype={
		_bindEvent:function(){
			var self=this;
			self.button.on("click",function(){
				var index=$(self.button).index($(this));
				// self.option.callback("button",index);
				var e=$.Event("dialog:action");
				e.index=index;
				self.element.trigger(e);
				self.hide.apply(self);
			});
		},
		toggle:function(){
			if(this.element.hasClass("show")){
				this.hide();
			}else{
				this.show();
			}
		},
		show:function(){
			var self=this;
			// self.option.callback("show");
			self.element.trigger($.Event("dialog:show"));
			self.element.addClass("show");
			this.option.allowScroll && self.element.on("touchmove" , _stopScroll);

		},
		hide :function () {
			var self=this;
			// self.option.callback("hide");
			self.element.trigger($.Event("dialog:hide"));
			self.element.off("touchmove" , _stopScroll);
			self.element.removeClass("show");
			
			self._isFromTpl&&self.element.remove();
		}
	}
	// 禁止冒泡
	function _stopScroll(){
		return false;
	}
	function Plugin(option) {

		return $.adaptObject(this, defaults, option,_dialogTpl,Dialog,"dialog");
	}
	$.fn.dialog=$.dialog= Plugin;
}(window.Zepto)
	


;(function($){
    'use strict';
    var win = window;
    var doc = document;
    var $win = $(win);
    var $doc = $(doc);
    $.fn.dropload = function(options){
        return new MyDropLoad(this, options);
    };
    var MyDropLoad = function(element, options){
        var me = this;
        me.$element = $(element);
        // 上方是否插入DOM
        me.upInsertDOM = false;
        // loading状态
        me.loading = false;
        // 是否锁定
        me.isLockUp = false;
        me.isLockDown = false;
        // 是否有数据
        me.isData = true;
        me._scrollTop = 0;
        me.init(options);
    };

    // 初始化
    MyDropLoad.prototype.init = function(options){
        var me = this;
        me.opts = $.extend({}, {
            scrollArea : me.$element,                                            // 滑动区域
            domUp : {                                                            // 上方DOM
                domClass   : 'ui-dropload-up',
                domRefresh : '<div class="ui-dropload-refresh">↓ 下拉刷新</div>',
                domUpdate  : '<div class="ui-dropload-update">↑释放更新</div>',
                domLoad    : '<div class="ui-dropload-load"><span class="loading"></span>加载中...</div>'
            },
            domDown : {                                                          // 下方DOM
                domClass   : 'ui-dropload-down',
                domRefresh : '<div class="ui-dropload-refresh">↑ 上拉加载更多</div>',
                domLoad    : '<div class="ui-dropload-load"><span class="loading"></span>加载中...</div>',
                domNoData  : '<div class="ui-dropload-noData">暂无数据</div>'
            },
            distance : 50,                                                       // 拉动距离
            threshold : '',                                                      // 提前加载距离
            loadUpFn : '',                                                       // 上方function
            loadDownFn : ''                                                      // 下方function
        }, options);

        // 如果加载下方，事先在下方插入DOM
        if(me.opts.loadDownFn != ''){
            me.$element.append('<div class="'+me.opts.domDown.domClass+'">'+me.opts.domDown.domRefresh+'</div>');
            me.$domDown = $('.'+me.opts.domDown.domClass);
        }

        // 判断滚动区域
        if(me.opts.scrollArea == win){
            me.$scrollArea = $win;
            // 获取文档高度
            me._scrollContentHeight = $doc.height();
            // 获取win显示区高度  —— 这里有坑
            me._scrollWindowHeight = doc.documentElement.clientHeight;
        }else{
            me.$scrollArea = me.opts.scrollArea;
            me._scrollContentHeight = me.$element[0].scrollHeight;
            me._scrollWindowHeight = me.$element.height();
        }

        // 如果文档高度不大于窗口高度，数据较少，自动加载下方数据
        if(me._scrollContentHeight <= me._scrollWindowHeight){
            fnLoadDown();
        }

        // 窗口调整
        $win.on('resize',function(){
            if(me.opts.scrollArea == win){
                // 重新获取win显示区高度
                me._scrollWindowHeight = win.innerHeight;
            }else{
                me._scrollWindowHeight = me.$element.height();
            }
        });

        // 绑定触摸
        me.$element.on('touchstart',function(e){
            if(!me.loading){
                fnTouches(e);
                fnTouchstart(e, me);
            }
        });
        me.$element.on('touchmove',function(e){
            if(!me.loading){
                fnTouches(e, me);
                fnTouchmove(e, me);
            }
        });
        me.$element.on('touchend',function(){
            if(!me.loading){
                fnTouchend(me);
            }
        });

        // 加载下方
        me.$scrollArea.on('scroll',function(){
            me._scrollTop = me.$scrollArea.scrollTop();
            if(me.opts.threshold === ''){
                // 默认滑到加载区2/3处时加载
                me._threshold = Math.floor(me.$domDown.height()*1/3);
            }else{
                me._threshold = me.opts.threshold;
            }
            
            if(me.opts.loadDownFn != '' && !me.loading && !me.isLockDown && (me._scrollContentHeight - me._threshold) <= (me._scrollWindowHeight + me._scrollTop)){
                fnLoadDown();
            }
        });

        // 加载下方方法
        function fnLoadDown(){
            me.direction = 'up';
            me.$domDown.html(me.opts.domDown.domLoad);
            me.loading = true;
            me.opts.loadDownFn(me);
        }
    };

    // touches
    function fnTouches(e){
        if(!e.touches){
            e.touches = e.originalEvent.touches;
        }
    }

    // touchstart
    function fnTouchstart(e, me){
        me._startY = e.touches[0].pageY;
        // 记住触摸时的scrolltop值
        me.touchScrollTop = me.$scrollArea.scrollTop();
    }

    // touchmove
    function fnTouchmove(e, me){
        me._curY = e.touches[0].pageY;
        me._moveY = me._curY - me._startY;

        if(me._moveY > 0){
            me.direction = 'down';
        }else if(me._moveY < 0){
            me.direction = 'up';
        }

        var _absMoveY = Math.abs(me._moveY);

        // 加载上方
        if(me.opts.loadUpFn != '' && me.touchScrollTop <= 0 && me.direction == 'down' && !me.isLockUp){
            e.preventDefault();

            me.$domUp = $('.'+me.opts.domUp.domClass);
            // 如果加载区没有DOM
            if(!me.upInsertDOM){
                me.$element.prepend('<div class="'+me.opts.domUp.domClass+'"></div>');
                me.upInsertDOM = true;
            }
            
            fnTransition(me.$domUp,0);

            // 下拉
            if(_absMoveY <= me.opts.distance){
                me._offsetY = _absMoveY;
                // todo：move时会不断清空、增加dom，有可能影响性能，下同
                me.$domUp.html(me.opts.domUp.domRefresh);
            // 指定距离 < 下拉距离 < 指定距离*2
            }else if(_absMoveY > me.opts.distance && _absMoveY <= me.opts.distance*2){
                me._offsetY = me.opts.distance+(_absMoveY-me.opts.distance)*0.5;
                me.$domUp.html(me.opts.domUp.domUpdate);
            // 下拉距离 > 指定距离*2
            }else{
                me._offsetY = me.opts.distance+me.opts.distance*0.5+(_absMoveY-me.opts.distance*2)*0.2;
            }

            me.$domUp.css({'height': me._offsetY});
        }
    }

    // touchend
    function fnTouchend(me){
        var _absMoveY = Math.abs(me._moveY);
        if(me.opts.loadUpFn != '' && me.touchScrollTop <= 0 && me.direction == 'down' && !me.isLockUp){
            fnTransition(me.$domUp,300);

            if(_absMoveY > me.opts.distance){
                me.$domUp.css({'height':me.$domUp.children().height()});
                me.$domUp.html(me.opts.domUp.domLoad);
                me.loading = true;
                me.opts.loadUpFn(me);
            }else{
                me.$domUp.css({'height':'0'}).on('webkitTransitionEnd transitionend',function(){
                    me.upInsertDOM = false;
                    $(this).remove();
                });
            }
            me._moveY = 0;
        }
    }

    // 重新获取文档高度
    function fnRecoverContentHeight(me){
        if(me.opts.scrollArea == win){
            me._scrollContentHeight = $doc.height();
        }else{
            me._scrollContentHeight = me.$element[0].scrollHeight;
        }
    }

    // 锁定
    MyDropLoad.prototype.lock = function(direction){
        var me = this;
        // 如果不指定方向
        if(direction === undefined){
            // 如果操作方向向上
            if(me.direction == 'up'){
                me.isLockDown = true;
            // 如果操作方向向下
            }else if(me.direction == 'down'){
                me.isLockUp = true;
            }else{
                me.isLockUp = true;
                me.isLockDown = true;
            }
        // 如果指定锁上方
        }else if(direction == 'up'){
            me.isLockUp = true;
        // 如果指定锁下方
        }else if(direction == 'down'){
            me.isLockDown = true;
        }
    };

    // 解锁
    MyDropLoad.prototype.unlock = function(){
        var me = this;
        // 简单粗暴解锁
        me.isLockUp = false;
        me.isLockDown = false;
    };

    // 无数据
    MyDropLoad.prototype.noData = function(){
        var me = this;
        me.isData = false;
    };

    // 重置
    MyDropLoad.prototype.resetload = function(){
        var me = this;
        if(me.direction == 'down' && me.upInsertDOM){
            me.$domUp.css({'height':'0'}).on('webkitTransitionEnd mozTransitionEnd transitionend',function(){
                me.loading = false;
                me.upInsertDOM = false;
                $(this).remove();
                fnRecoverContentHeight(me);
            });
        }else if(me.direction == 'up'){
            me.loading = false;
            // 如果有数据
            if(me.isData){
                // 加载区修改样式
                me.$domDown.html(me.opts.domDown.domRefresh);
                fnRecoverContentHeight(me);
            }else{
                // 如果没数据
                me.$domDown.html(me.opts.domDown.domNoData);
            }
        }
    };

    // css过渡
    function fnTransition(dom,num){
        dom.css({
            '-webkit-transition':'all '+num+'ms',
            'transition':'all '+num+'ms'
        });
    }
})(window.Zepto || window.jQuery);
!function($){

	// 默认模板
	var _loadingTpl='<div class="ui-loading-block show">'+
		    '<div class="ui-loading-cnt">'+
		      '<i class="ui-loading-bright"></i>'+
		      '<p><%=content%></p>'+
		   '</div>'+
		 '</div>';
	
	// 默认参数
	var defaults={
		content:'加载中...'
	}
	// 构造函数
	var Loading   = function (el,option,isFromTpl) {
		var self=this;
		this.element=$(el);
		this._isFromTpl=isFromTpl;
		this.option=$.extend(defaults,option);
		this.show();
	}
	Loading.prototype={
		show:function(){
			var e=$.Event('loading:show');
			this.element.trigger(e);
			this.element.show();
			
		},
		hide :function () {
			var e=$.Event('loading:hide');
			this.element.trigger(e);
			this.element.remove();
		}
	}
	function Plugin(option) {

		return $.adaptObject(this, defaults, option,_loadingTpl,Loading,"loading");
	}
	$.fn.loading=$.loading= Plugin;
}(window.Zepto)
	


;(function ($) {

var rAF = window.requestAnimationFrame	||
	window.webkitRequestAnimationFrame	||
	window.mozRequestAnimationFrame		||
	window.oRequestAnimationFrame		||
	window.msRequestAnimationFrame		||
	function (callback) { window.setTimeout(callback, 1000 / 60); };


/*
 * 工具类
 */
var utils = (function () {

	var me = {};

	var _elementStyle = document.createElement('div').style;

	var _vendor = (function () {
		var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
			transform,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			transform = vendors[i] + 'ransform';
			if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
		}
		return false;
	})();

	function _prefixStyle (style) {
		if ( _vendor === false ) return false;
		if ( _vendor === '' ) return style;
		return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
	}


	me.getTime = Date.now || function getTime () { return new Date().getTime(); };


	me.extend = function (target, obj) {
		for ( var i in obj ) {
			target[i] = obj[i];
		}
	};


	me.addEvent = function (el, type, fn, capture) {
		el.addEventListener(type, fn, !!capture);	
	};


	me.removeEvent = function (el, type, fn, capture) {
		el.removeEventListener(type, fn, !!capture);
	};


	me.prefixPointerEvent = function (pointerEvent) {
		return window.MSPointerEvent ? 
			'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10):
			pointerEvent;
	};


	/**
     * 根据一定时间内的滑动距离计算出最终停止距离和时间。
     * @param current：当前滑动位置
     * @param start：touchStart 时候记录的开始位置，但是在touchmove时候可能被重写
     * @param time：touchstart 到手指离开时候经历的时间，同样可能被touchmove重写
     * @param lowerMargin：可移动的最大距离，这个一般为计算得出 this.wrapperHeight - this.scrollerHeight
     * @param wrapperSize：如果有边界距离的话就是可拖动，不然碰到0的时候便停止
     * @param deceleration：匀减速
     * @returns {{destination: number, duration: number}}
     */
	me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
		var distance = current - start,
			speed = Math.abs(distance) / time,
			destination,
			duration;

		deceleration = deceleration === undefined ? 0.0006 : deceleration;

		destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
		duration = speed / deceleration;

		if ( destination < lowerMargin ) {
			destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
			distance = Math.abs(destination - current);
			duration = distance / speed;
		} else if ( destination > 0 ) {
			destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
			distance = Math.abs(current) + destination;
			duration = distance / speed;
		}

		return {
			destination: Math.round(destination),
			duration: duration
		};
	};

	var _transform = _prefixStyle('transform');

	me.extend(me, {
		hasTransform: _transform !== false,
		hasPerspective: _prefixStyle('perspective') in _elementStyle,
		hasTouch: 'ontouchstart' in window,
		hasPointer: window.PointerEvent || window.MSPointerEvent, // IE10 is prefixed
		hasTransition: _prefixStyle('transition') in _elementStyle
	});

	// This should find all Android browsers lower than build 535.19 (both stock browser and webview)
	me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion));

	me.extend(me.style = {}, {
		transform: _transform,
		transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
		transitionDuration: _prefixStyle('transitionDuration'),
		transitionDelay: _prefixStyle('transitionDelay'),
		transformOrigin: _prefixStyle('transformOrigin'),
		transitionProperty: _prefixStyle('transitionProperty')
	});


	me.offset = function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;

		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}
		return {
			left: left,
			top: top
		};
	};


	/* 
	 * 配合 config 里面的 preventDefaultException 属性
	 * 不对匹配到的 element 使用 e.preventDefault()
	 * 默认阻止所有事件的冒泡，包括 click 或 tap
	 */
	me.preventDefaultException = function (el, exceptions) {
		for ( var i in exceptions ) {
			if ( exceptions[i].test(el[i]) ) {
				return true;
			}
		}
		return false;
	};


	me.extend(me.eventType = {}, {
		touchstart: 1,
		touchmove: 1,
		touchend: 1,

		mousedown: 2,
		mousemove: 2,
		mouseup: 2,

		pointerdown: 3,
		pointermove: 3,
		pointerup: 3,

		MSPointerDown: 3,
		MSPointerMove: 3,
		MSPointerUp: 3
	});


	me.extend(me.ease = {}, {
		quadratic: {
			style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			fn: function (k) {
				return k * ( 2 - k );
			}
		},
		circular: {
			style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
			fn: function (k) {
				return Math.sqrt( 1 - ( --k * k ) );
			}
		},
		back: {
			style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
			fn: function (k) {
				var b = 4;
				return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
			}
		},
		bounce: {
			style: '',
			fn: function (k) {
				if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
					return 7.5625 * k * k;
				} else if ( k < ( 2 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
				} else if ( k < ( 2.5 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
				} else {
					return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
				}
			}
		},
		elastic: {
			style: '',
			fn: function (k) {
				var f = 0.22,
					e = 0.4;

				if ( k === 0 ) { return 0; }
				if ( k == 1 ) { return 1; }

				return ( e * Math.pow( 2, - 10 * k ) * Math.sin( ( k - f / 4 ) * ( 2 * Math.PI ) / f ) + 1 );
			}
		}
	});

	me.tap = function (e, eventName) {
		var ev = document.createEvent('Event');
		ev.initEvent(eventName, true, true);
		ev.pageX = e.pageX;
		ev.pageY = e.pageY;
		e.target.dispatchEvent(ev);
	};

	me.click = function (e) {
		var target = e.target,
			ev;
		if ( !(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName) ) {
			ev = document.createEvent('MouseEvents');
			ev.initMouseEvent('click', true, true, e.view, 1,
				target.screenX, target.screenY, target.clientX, target.clientY,
				e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
				0, null);

			ev._constructed = true;
			target.dispatchEvent(ev);
		}
	};

	return me;
})();



/*
 * 构造函数
 */
function Scroll(el, options) {

	this.wrapper = typeof el == 'string' ? $(el)[0] : el;

	this.options = {
		startX: 0,					// 初始化 X 坐标
		startY: 0,					// 初始化 Y 坐标
		scrollY: true,				// 竖向滚动
		scrollX: false,				// 默认非水平
		directionLockThreshold: 5,	// 确定滚动方向的阈值
		momentum: true,				// 是否开启惯性滚动

		duration: 300,				// transition 过渡时间

		bounce: true,				// 是否有反弹动画
		bounceTime: 600,			// 反弹动画时间
		bounceEasing: '',			// 反弹动画类型：'circular'(default), 'quadratic', 'back', 'bounce', 'elastic'

		preventDefault: true,		// 是否阻止默认滚动事件（和冒泡有区别）
		eventPassthrough: true,		// 穿透，是否触发原生滑动（取值 true、false、vertical、horizental）

		freeScroll: false,			// 任意方向的滚动。若 scrollX 和 scrollY 同时开启，则相当于 freeScroll

	    bindToWrapper : true,		// 事件是否绑定到 wrapper 元素上，否则大部分绑定到 window（若存在嵌套，则绑定在元素上最好）
    	resizePolling : 60,			// resize 时候隔 60ms 就执行 refresh 方法重新获取位置信息(事件节流)
    	
    	disableMouse : false,		// 是否禁用鼠标
	    disableTouch : false,		// 是否禁用touch事件
	    disablePointer : false,		// 是否禁用win系统的pointer事件

		tap: true,					// 是否模拟 tap 事件
		click: false,				// 是否模拟点击事件（false 则使用原生click事件）

		preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ }, // 当遇到正则内的元素则不阻止冒泡

		HWCompositing: true, 		// Hardware acceleration
		useTransition: true,		// Transition || requestAnimationFrame
		useTransform: true			// Translate || Left/Top
	};


	for ( var i in options ) {
		this.options[i] = options[i];
	}


	// scroller
	// ==================================

	if (!this.options.role && this.options.scrollX === false) {
		this.options.eventPassthrough = 'horizontal';	// 竖直滚动的 scroller 不拦截横向原生滚动
	}

	// slide
	// ==================================

	if (this.options.role === 'slider') {

		this.options.scrollX = true;
		this.options.scrollY = false;
		this.options.momentum = false;

		this.scroller = $('.ui-slider-content',this.wrapper)[0];
		$(this.scroller.children[0]).addClass('current');

		this.currentPage = 0;
		this.count = this.scroller.children.length;

		this.scroller.style.width = this.count+"00%";

		this.itemWidth = this.scroller.children[0].clientWidth;
		this.scrollWidth = this.itemWidth * this.count;

		

		if (this.options.indicator) {
			var temp = '<ul class="ui-slider-indicators">';

			for (var i=1; i<=this.count; i++) {
				if (i===1) {
					temp += '<li class="current">'+i+'</li>';
				}
				else {
					temp += '<li>'+i+'</li>';
				}
			}
			temp += '</ul>';
			$(this.wrapper).append(temp);
			this.indicator = $('.ui-slider-indicators',this.wrapper)[0];
		}
	}


	// tab
	// ==================================

	else if (this.options.role === 'tab') {

		this.options.scrollX = true;
		this.options.scrollY = false;
		this.options.momentum = false;

		this.scroller = $('.ui-tab-content',this.wrapper)[0];
		this.nav = $('.ui-tab-nav',this.wrapper)[0];

		$(this.scroller.children[0]).addClass('current');
		$(this.nav.children[0]).addClass('current');

		this.currentPage = 0;
		this.count = this.scroller.children.length;

		this.scroller.style.width = this.count+"00%";

		this.itemWidth = this.scroller.children[0].clientWidth;
		this.scrollWidth = this.itemWidth * this.count;


	}
	else {
		this.scroller = this.wrapper.children[0];
	}
	this.scrollerStyle = this.scroller.style;


	this.translateZ = utils.hasPerspective && this.options.HWCompositing ? ' translateZ(0)' : '';
	this.options.useTransition = utils.hasTransition && this.options.useTransition;
	this.options.useTransform = utils.hasTransform && this.options.useTransform;
	this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
	this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;
	// If you want eventPassthrough I have to lock one of the axes
	this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;
	this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
	// With eventPassthrough we also need lockDirection mechanism
	this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
	this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;
	this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;
	this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

	if (this.options.tap === true) {
		this.options.tap = 'tap';
	}
	if (this.options.useTransform === false) {
		this.scroller.style.position = 'relative';
	}

	// Some defaults
	this.x = 0;
	this.y = 0;
	this.directionX = 0;
	this.directionY = 0;
	this._events = {};

	this._init();	// 绑定各种事件
	this.refresh();

	this.scrollTo(this.options.startX, this.options.startY);
	this.enable();

	// 自动播放
	if (this.options.autoplay) {
		var context = this;
		this.options.interval = this.options.interval || 2000;
		this.options.flag = setTimeout(function(){
			context._autoplay.apply(context)
		}, context.options.interval);
	}
}



Scroll.prototype = {

	_init: function () {
		this._initEvents();
	},

	_initEvents: function (remove) {
		var eventType = remove ? utils.removeEvent : utils.addEvent,
			target = this.options.bindToWrapper ? this.wrapper : window;

		/*
		 * 给 addEventListener 传递 this
		 * 程序会自动找到 handleEvent 方法作为回调函数
		 */
		eventType(window, 'orientationchange', this);
		eventType(window, 'resize', this);

		if ( this.options.click ) {
			eventType(this.wrapper, 'click', this, true);
		}

		if ( !this.options.disableMouse ) {
			eventType(this.wrapper, 'mousedown', this);
			eventType(target, 'mousemove', this);
			eventType(target, 'mousecancel', this);
			eventType(target, 'mouseup', this);
		}

		if ( utils.hasPointer && !this.options.disablePointer ) {
			eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
			eventType(target, utils.prefixPointerEvent('pointermove'), this);
			eventType(target, utils.prefixPointerEvent('pointercancel'), this);
			eventType(target, utils.prefixPointerEvent('pointerup'), this);
		}

		if ( utils.hasTouch && !this.options.disableTouch ) {
			eventType(this.wrapper, 'touchstart', this);
			eventType(target, 'touchmove', this);
			eventType(target, 'touchcancel', this);
			eventType(target, 'touchend', this);
		}

		eventType(this.scroller, 'transitionend', this);
		eventType(this.scroller, 'webkitTransitionEnd', this);
		eventType(this.scroller, 'oTransitionEnd', this);
		eventType(this.scroller, 'MSTransitionEnd', this);

		// tab
		// =============================
		if (this.options.role === 'tab') {
			eventType(this.nav, 'touchend', this);
			eventType(this.nav, 'mouseup', this);
			eventType(this.nav, 'pointerup', this);
		}
	},

	
	refresh: function () {
		var rf = this.wrapper.offsetHeight;	// Force reflow

		// http://jsfiddle.net/y8Y32/25/
		// clientWidth = content + padding
		this.wrapperWidth	= this.wrapper.clientWidth;
		this.wrapperHeight	= this.wrapper.clientHeight;


		// 添加 wrapper 的 padding 值到 scroller 身上，更符合使用预期
		var matrix = window.getComputedStyle(this.wrapper, null); 
		var pt = matrix['padding-top'].replace(/[^-\d.]/g, ''),
			pb = matrix['padding-bottom'].replace(/[^-\d.]/g, ''),
			pl = matrix['padding-left'].replace(/[^-\d.]/g, ''),
			pr = matrix['padding-right'].replace(/[^-\d.]/g, '');

		var matrix2 = window.getComputedStyle(this.scroller, null);
		var	mt2 = matrix2['margin-top'].replace(/[^-\d.]/g, ''),
			mb2 = matrix2['margin-bottom'].replace(/[^-\d.]/g, ''),
			ml2 = matrix2['margin-left'].replace(/[^-\d.]/g, ''),
			mr2 = matrix2['margin-right'].replace(/[^-\d.]/g, '');


		// offsetWidth = content + padding + border
		this.scrollerWidth	= this.scroller.offsetWidth+parseInt(pl)+parseInt(pr)+parseInt(ml2)+parseInt(mr2);
		this.scrollerHeight	= this.scroller.offsetHeight+parseInt(pt)+parseInt(pb)+parseInt(mt2)+parseInt(mb2);


		// slide
		// ==================================
		if (this.options.role === 'slider' || this.options.role === 'tab') {
			this.itemWidth = this.scroller.children[0].clientWidth;
            this.scrollWidth = this.itemWidth * this.count;
			this.scrollerWidth = this.scrollWidth;
		}

		this.maxScrollX		= this.wrapperWidth - this.scrollerWidth;
		this.maxScrollY		= this.wrapperHeight - this.scrollerHeight;

		this.hasHorizontalScroll	= this.options.scrollX && this.maxScrollX < 0;
		this.hasVerticalScroll		= this.options.scrollY && this.maxScrollY < 0;

		if ( !this.hasHorizontalScroll ) {
			this.maxScrollX = 0;
			this.scrollerWidth = this.wrapperWidth;
		}

		if ( !this.hasVerticalScroll ) {
			this.maxScrollY = 0;
			this.scrollerHeight = this.wrapperHeight;
		}

		this.endTime = 0;
		this.directionX = 0;
		this.directionY = 0;

		this.wrapperOffset = utils.offset(this.wrapper);
		this.resetPosition();
	},
	
	
	handleEvent: function (e) {
		switch ( e.type ) {
			case 'touchstart':
			case 'pointerdown':
			case 'MSPointerDown':
			case 'mousedown':
				this._start(e);
				break;
			case 'touchmove':
			case 'pointermove':
			case 'MSPointerMove':
			case 'mousemove':
				this._move(e);
				break;
			case 'touchend':
			case 'pointerup':
			case 'MSPointerUp':
			case 'mouseup':
			case 'touchcancel':
			case 'pointercancel':
			case 'MSPointerCancel':
			case 'mousecancel':
				this._end(e);
				break;
			case 'orientationchange':
			case 'resize':
				this._resize();
				break;
			case 'transitionend':
			case 'webkitTransitionEnd':
			case 'oTransitionEnd':
			case 'MSTransitionEnd':
				this._transitionEnd(e);
				break;
			case 'wheel':
			case 'DOMMouseScroll':
			case 'mousewheel':
				this._wheel(e);
				break;
			case 'keydown':
				this._key(e);
				break;
			case 'click':
				if ( !e._constructed ) {
					e.preventDefault();
					e.stopPropagation();
				}
				break;
		}
	},



	_start: function (e) {

		if ( utils.eventType[e.type] != 1 ) {	// 如果是鼠标点击，则只响应鼠标左键
			if ( e.button !== 0 ) {
				return;
			}
		}

		if ( !this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated) ) {
			return;
		}

		// 如果 preventDefault === true 且 不是落后的安卓版本 且 不是需要过滤的 target 就阻止默认的行为
		if ( this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
			e.preventDefault();
		}

		var point = e.touches ? e.touches[0] : e,	// 检验是触摸事件对象还是鼠标事件对象
			pos;

		this.initiated	= utils.eventType[e.type];	// 初始化事件类型（1：触摸，2：鼠标，3：pointer）
		this.moved		= false;
		this.distX		= 0;
		this.distY		= 0;
		this.directionX = 0;
		this.directionY = 0;
		this.directionLocked = 0;

		this._transitionTime();
		this.startTime = utils.getTime();

		// 定住正在滑动的 scroller，slider/tab 不这么做
		if ( this.options.useTransition && this.isInTransition && this.options.role !== 'slider' && this.options.role !== 'tab') {
			this.isInTransition = false;
			pos = this.getComputedPosition();
			this._translate(Math.round(pos.x), Math.round(pos.y));
		}
		// 场景：（没有使用 Transition 属性）
		else if ( !this.options.useTransition && this.isAnimating ) {
			this.isAnimating = false;
		}

		this.startX    = this.x;
		this.startY    = this.y;
		this.absStartX = this.x;
		this.absStartY = this.y;
		this.pointX    = point.pageX;
		this.pointY    = point.pageY;

		// throttle
		// ======================
		if (this.options.autoplay) {
			var context = this;

			clearTimeout(this.options.flag);
			this.options.flag = setTimeout(function() {
				context._autoplay.apply(context);
			}, context.options.interval);
		}

		event.stopPropagation();
	},



	_move: function (e) {

		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {	// 如果事件类型和 touchstart 初始化的事件类型不一致，退出
			return;
		}
		if ( this.options.preventDefault ) {	// 这么做才能确保 Android 下 touchend 能被正常触发（需测试）
			e.preventDefault();
		}
		var point		= e.touches ? e.touches[0] : e,
			deltaX		= point.pageX - this.pointX,
			deltaY		= point.pageY - this.pointY,
			timestamp	= utils.getTime(),
			newX, newY,
			absDistX, absDistY;

		this.pointX		= point.pageX;
		this.pointY		= point.pageY;

		this.distX		+= deltaX;
		this.distY		+= deltaY;
		absDistX		= Math.abs(this.distX);
		absDistY		= Math.abs(this.distY);
		

		// 如果在很长的时间内只移动了少于 10 像素的距离，那么不会触发惯性滚动
		if ( timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10) ) {
			return;
		}

		// 屏蔽滚动方向的另外一个方向（可配置）
		if ( !this.directionLocked && !this.options.freeScroll ) {
			if ( absDistX > absDistY + this.options.directionLockThreshold ) {
				this.directionLocked = 'h';		// lock horizontally
			} else if ( absDistY >= absDistX + this.options.directionLockThreshold ) {
				this.directionLocked = 'v';		// lock vertically
			} else {
				this.directionLocked = 'n';		// no lock
			}
		}
		if ( this.directionLocked == 'h' ) {
			// slider/tab 外层高度自适应
			if (this.options.role === 'tab') {
				$(this.scroller).children('li').height('auto');	
			}
			if ( this.options.eventPassthrough == 'vertical' ) {
				e.preventDefault();
			} else if ( this.options.eventPassthrough == 'horizontal' ) {
				this.initiated = false;
				return;
			}
			deltaY = 0;	// 不断重置垂直偏移量为 0
		}
		else if ( this.directionLocked == 'v' ) {
			if ( this.options.eventPassthrough == 'horizontal' ) {
				e.preventDefault();
			} else if ( this.options.eventPassthrough == 'vertical' ) {
				this.initiated = false;
				return;
			}
			deltaX = 0;	// 不断重置水平偏移量为 0
		}

		deltaX = this.hasHorizontalScroll ? deltaX : 0;
		deltaY = this.hasVerticalScroll ? deltaY : 0;
		
		newX = this.x + deltaX;
		newY = this.y + deltaY;

		// Slow down if outside of the boundaries
		if ( newX > 0 || newX < this.maxScrollX ) {
			newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
		}
		if ( newY > 0 || newY < this.maxScrollY ) {
			newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
		}

		this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		this.moved = true;	// 滚动开始
		this._translate(newX, newY);

		if ( timestamp - this.startTime > 300 ) {	// 每 300 毫秒重置一次初始值
			this.startTime = timestamp;
			this.startX = this.x;
			this.startY = this.y;
		}
	},



	_end: function (e) {

		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
			return;
		}

		if ( this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
			e.preventDefault();
		}

		var point = e.changedTouches ? e.changedTouches[0] : e,	// 移开屏幕的那个触摸点，只会包含在 changedTouches 列表中，而不会包含在 touches 或 targetTouches 列表中
			momentumX,
			momentumY,
			duration = utils.getTime() - this.startTime,
			newX = Math.round(this.x),
			newY = Math.round(this.y),
			distanceX = Math.abs(newX - this.startX),
			distanceY = Math.abs(newY - this.startY),
			time = 0,
			easing = '';

		this.isInTransition = 0;
		this.initiated = 0;
		this.endTime = utils.getTime();
	

		if ( this.resetPosition(this.options.bounceTime) ) {	// reset if we are outside of the boundaries
			if (this.options.role === 'tab') {
				$(this.scroller.children[this.currentPage]).siblings('li').height(0);	
			}
			return;
		}

		this.scrollTo(newX, newY);	// ensures that the last position is rounded

		if (!this.moved) {	// we scrolled less than 10 pixels
			if (this.options.tap && utils.eventType[e.type] === 1) {
				utils.tap(e, this.options.tap);
			}
			if ( this.options.click) {
				utils.click(e);
			}
		}

		// 300ms 内的滑动要启动惯性滚动
		if ( this.options.momentum && duration < 300 ) {
			momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
			momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
			newX = momentumX.destination;
			newY = momentumY.destination;
			time = Math.max(momentumX.duration, momentumY.duration);
			this.isInTransition = 1;
		}

		if ( newX != this.x || newY != this.y ) {
			// change easing function when scroller goes out of the boundaries
			if ( newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY ) {
				easing = utils.ease.quadratic;
			}
			this.scrollTo(newX, newY, time, easing);
			return;
		}


		// tab
		// ==========================
		if (this.options.role === 'tab' && $(event.target).closest('ul').hasClass('ui-tab-nav')) {
			$(this.nav).children().removeClass('current');
			$(event.target).addClass('current');
			var tempCurrentPage = this.currentPage;
			this.currentPage = $(event.target).index();

			$(this.scroller).children().height('auto');	// tab 外层高度自适应
			this._execEvent('beforeScrollStart', tempCurrentPage, this.currentPage);
		}



		// slider & tab
		// ==============================
		if (this.options.role === 'slider' || this.options.role === 'tab') {

			if (distanceX < 30) {
				this.scrollTo(-this.itemWidth*this.currentPage, 0, this.options.bounceTime, this.options.bounceEasing);
			}
			else if (newX-this.startX<0) {	// 向前
				this._execEvent('beforeScrollStart', this.currentPage, this.currentPage+1);
				this.scrollTo(-this.itemWidth*++this.currentPage, 0, this.options.bounceTime, this.options.bounceEasing);
			}
			else if (newX-this.startX>=0) {	// 向后
				this._execEvent('beforeScrollStart', this.currentPage, this.currentPage-1);
				this.scrollTo(-this.itemWidth*--this.currentPage, 0, this.options.bounceTime, this.options.bounceEasing);
			}

			// tab 外层高度自适应
			if (this.options.role === 'tab') {
				$(this.scroller.children[this.currentPage]).siblings('li').height(0);
			}

			if (this.indicator && distanceX >= 30) {
				$(this.indicator).children().removeClass('current');
				$(this.indicator.children[this.currentPage]).addClass('current');
			}
			else if (this.nav && distanceX >= 30) {
				$(this.nav).children().removeClass('current');
				$(this.nav.children[this.currentPage]).addClass('current');
			}

			$(this.scroller).children().removeClass('current');
			$(this.scroller.children[this.currentPage]).addClass('current');
		}
	},


	_resize: function () {
		var that = this;
		clearTimeout(this.resizeTimeout);
		this.resizeTimeout = setTimeout(function () {
			that.refresh();
		}, this.options.resizePolling);
	},


	_transitionEnd: function (e) {
		if ( e.target != this.scroller || !this.isInTransition ) {
			return;
		}
		this._transitionTime();

		if ( !this.resetPosition(this.options.bounceTime) ) {
			this.isInTransition = false;
			this._execEvent('scrollEnd', this.currentPage);
		}
	},


	destroy: function () {
		this._initEvents(true);		// 去除事件绑定
	},


	resetPosition: function (time) {
		var x = this.x,
			y = this.y;

		time = time || 0;

		if ( !this.hasHorizontalScroll || this.x > 0 ) {
			x = 0;
		} else if ( this.x < this.maxScrollX ) {
			x = this.maxScrollX;
		}

		if ( !this.hasVerticalScroll || this.y > 0 ) {
			y = 0;
		} else if ( this.y < this.maxScrollY ) {
			y = this.maxScrollY;
		}

		if ( x == this.x && y == this.y ) {
			return false;
		}
		this.scrollTo(x, y, time, this.options.bounceEasing);
		return true;
	},



	disable: function () {
		this.enabled = false;
	},

	enable: function () {
		this.enabled = true;
	},



	on: function (type, fn) {
		if ( !this._events[type] ) {
			this._events[type] = [];
		}
		this._events[type].push(fn);
	},
	off: function (type, fn) {
		if ( !this._events[type] ) {
			return;
		}

		var index = this._events[type].indexOf(fn);

		if ( index > -1 ) {
			this._events[type].splice(index, 1);
		}
	},


	_execEvent: function (type) {
		if ( !this._events[type] ) {
			return;
		}
		var i = 0,
			l = this._events[type].length;

		if ( !l ) {
			return;
		}
		for ( ; i < l; i++ ) {
			this._events[type][i].apply(this, [].slice.call(arguments, 1));
		}
	},


	scrollTo: function (x, y, time, easing) {
		easing = easing || utils.ease.circular;

		this.isInTransition = this.options.useTransition && time > 0;

		if ( !time || (this.options.useTransition && easing.style) ) {

			if (this.options.role === 'slider' || this.options.role === 'tab') {	// 不添加判断会影响 left/top 的过渡
				time = this.options.duration;
				this.scrollerStyle[utils.style.transitionProperty] = utils.style.transform;	
			}
			this.scrollerStyle[utils.style.transitionTimingFunction] = easing.style;
			this._transitionTime(time);
			this._translate(x, y);
		} else {
			this._animate(x, y, time, easing.fn);
		}
	},


	scrollToElement: function (el, time, offsetX, offsetY, easing) {
		el = el.nodeType ? el : this.scroller.querySelector(el);

		if ( !el ) {
			return;
		}
		var pos = utils.offset(el);
		pos.left -= this.wrapperOffset.left;
		pos.top  -= this.wrapperOffset.top;

		// if offsetX/Y are true we center the element to the screen
		// 若 offsetX/Y 都是 true，则会滚动到元素在屏幕中间的位置
		if ( offsetX === true ) {
			offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
		}
		if ( offsetY === true ) {
			offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
		}
		pos.left -= offsetX || 0;
		pos.top  -= offsetY || 0;
		pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
		pos.top  = pos.top  > 0 ? 0 : pos.top  < this.maxScrollY ? this.maxScrollY : pos.top;

		time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x-pos.left), Math.abs(this.y-pos.top)) : time;

		this.scrollTo(pos.left, pos.top, time, easing);
	},


	_transitionTime: function (time) {
		time = time || 0;
		this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';

		if ( !time && utils.isBadAndroid ) {
			this.scrollerStyle[utils.style.transitionDuration] = '0.001s';
		}
	},


	_translate: function (x, y) {
		if ( this.options.useTransform ) {
			this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;
		} else {
			x = Math.round(x);
			y = Math.round(y);
			this.scrollerStyle.left = x + 'px';
			this.scrollerStyle.top = y + 'px';
		}
		this.x = x;
		this.y = y;
	},


	getComputedPosition: function () {
		var matrix = window.getComputedStyle(this.scroller, null),
			x, y;

		if ( this.options.useTransform ) {
			matrix = matrix[utils.style.transform].split(')')[0].split(', ');
			x = +(matrix[12] || matrix[4]);
			y = +(matrix[13] || matrix[5]);
		} else {
			x = +matrix.left.replace(/[^-\d.]/g, '');
			y = +matrix.top.replace(/[^-\d.]/g, '');
		}

		return { x: x, y: y };
	},

	
	_animate: function (destX, destY, duration, easingFn) {	// 当浏览器不支持 transition 时提供的退化方案 requestAnimationFrame
		var that = this,
			startX = this.x,
			startY = this.y,
			startTime = utils.getTime(),
			destTime = startTime + duration;

		function step () {
			var now = utils.getTime(),
				newX, newY,
				easing;

			if ( now >= destTime ) {
				that.isAnimating = false;
				that._translate(destX, destY);

				if ( !that.resetPosition(that.options.bounceTime) ) {
					that._execEvent('scrollEnd', this.currentPage);
				}
				return;
			}

			now = ( now - startTime ) / duration;
			easing = easingFn(now);
			newX = ( destX - startX ) * easing + startX;
			newY = ( destY - startY ) * easing + startY;
			that._translate(newX, newY);

			if ( that.isAnimating ) {
				rAF(step);
			}
		}
		this.isAnimating = true;
		step();
	},


	_autoplay: function() {
		var self = this,
			curPage = self.currentPage;
		
		self.currentPage = self.currentPage >= self.count-1 ? 0 : ++self.currentPage;
		self._execEvent('beforeScrollStart', curPage, self.currentPage);	// 对于自动播放的 slider/tab，这个时机就是 beforeScrollStart

		// tab 外层高度自适应
		if (this.options.role === 'tab') {
			$(this.scroller).children().height('auto');
			document.body.scrollTop = 0;
		}
		self.scrollTo(-self.itemWidth*self.currentPage, 0, self.options.bounceTime, self.options.bounceEasing);

		if (self.indicator) {
			$(self.indicator).children().removeClass('current');
			$(self.indicator.children[self.currentPage]).addClass('current');
			$(self.scroller).children().removeClass('current');
			$(self.scroller.children[self.currentPage]).addClass('current');
		}
		else if (self.nav) {
			$(self.nav).children().removeClass('current');
			$(self.nav.children[self.currentPage]).addClass('current');
			$(self.scroller).children().removeClass('current');
			$(self.scroller.children[self.currentPage]).addClass('current');
		}

		self.options.flag = setTimeout(function() {
			self._autoplay.apply(self);
		}, self.options.interval);
	}


};

// Scroll.utils = utils;  
window.hum = window.hum || {};
window.hum.Scroll = Scroll;

/*
 * 兼容 RequireJS 和 Sea.js
 */
/*if (typeof define === "function") {
	define(function(require, exports, module) {
		module.exports = Scroll;
	})
}*/

})(window.Zepto);
/*iscroll*/
(function(g, n, f) {
    function p(a, b) {
        this.wrapper = "string" == typeof a ? n.querySelector(a) : a;
        this.scroller = this.wrapper.children[0];
        this.scrollerStyle = this.scroller.style;
        this.options = { resizeScrollbars: !0, mouseWheelSpeed: 20, snapThreshold: .334, startX: 0, startY: 0, scrollY: !0, directionLockThreshold: 5, momentum: !0, bounce: !0, bounceTime: 600, bounceEasing: "", preventDefault: !0, preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ }, HWCompositing: !0, useTransition: !0, useTransform: !0 };
        for (var c in b) this.options[c] =
            b[c];
        this.translateZ = this.options.HWCompositing && d.hasPerspective ? " translateZ(0)" : "";
        this.options.useTransition = d.hasTransition && this.options.useTransition;
        this.options.useTransform = d.hasTransform && this.options.useTransform;
        this.options.eventPassthrough = !0 === this.options.eventPassthrough ? "vertical" : this.options.eventPassthrough;
        this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;
        this.options.scrollY = "vertical" == this.options.eventPassthrough ? !1 : this.options.scrollY;
        this.options.scrollX = "horizontal" == this.options.eventPassthrough ? !1 : this.options.scrollX;
        this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
        this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;
        this.options.bounceEasing = "string" == typeof this.options.bounceEasing ? d.ease[this.options.bounceEasing] || d.ease.circular : this.options.bounceEasing;
        this.options.resizePolling = void 0 === this.options.resizePolling ? 60 : this.options.resizePolling;
        !0 === this.options.tap && (this.options.tap = "tap");
        "scale" == this.options.shrinkScrollbars && (this.options.useTransition = !1);
        this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;
        3 == this.options.probeType && (this.options.useTransition = !1);
        this.directionY = this.directionX = this.y = this.x = 0;
        this._events = {};
        this._init();
        this.refresh();
        this.scrollTo(this.options.startX, this.options.startY);
        this.enable()
    }

    function s(a, b, c) {
        var e = n.createElement("div"),
            d = n.createElement("div");
        !0 === c && (e.style.cssText =
            "position:absolute;z-index:9999", d.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px");
        d.className = "iScrollIndicator";
        "h" == a ? (!0 === c && (e.style.cssText += ";height:7px;left:2px;right:2px;bottom:0", d.style.height = "100%"), e.className = "iScrollHorizontalScrollbar") : (!0 === c && (e.style.cssText += ";width:7px;bottom:2px;top:2px;right:1px", d.style.width = "100%"), e.className =
            "iScrollVerticalScrollbar");
        e.style.cssText += ";overflow:hidden";
        b || (e.style.pointerEvents = "none");
        e.appendChild(d);
        return e
    }

    function t(a, b) {
        this.wrapper = "string" == typeof b.el ? n.querySelector(b.el) : b.el;
        this.wrapperStyle = this.wrapper.style;
        this.indicator = this.wrapper.children[0];
        this.indicatorStyle = this.indicator.style;
        this.scroller = a;
        this.options = { listenX: !0, listenY: !0, interactive: !1, resize: !0, defaultScrollbars: !1, shrink: !1, fade: !1, speedRatioX: 0, speedRatioY: 0 };
        for (var c in b) this.options[c] = b[c];
        this.sizeRatioY = this.sizeRatioX = 1;
        this.maxPosY = this.maxPosX = 0;
        this.options.interactive && (this.options.disableTouch || (d.addEvent(this.indicator, "touchstart", this), d.addEvent(g, "touchend", this)), this.options.disablePointer || (d.addEvent(this.indicator, d.prefixPointerEvent("pointerdown"), this), d.addEvent(g, d.prefixPointerEvent("pointerup"), this)), this.options.disableMouse || (d.addEvent(this.indicator, "mousedown", this), d.addEvent(g, "mouseup", this)));
        this.options.fade && (this.wrapperStyle[d.style.transform] =
            this.scroller.translateZ, this.wrapperStyle[d.style.transitionDuration] = d.isBadAndroid ? "0.001s" : "0ms", this.wrapperStyle.opacity = "0")
    }
    var u = g.requestAnimationFrame || g.webkitRequestAnimationFrame || g.mozRequestAnimationFrame || g.oRequestAnimationFrame || g.msRequestAnimationFrame || function(a) { g.setTimeout(a, 1E3 / 60) },
        d = function() {
            function a(a) {
                return !1 === e ? !1 : "" === e ? a : e + a.charAt(0).toUpperCase() + a.substr(1) }
            var b = {},
                c = n.createElement("div").style,
                e = function() {
                    for (var a = ["t", "webkitT", "MozT", "msT", "OT"], b,
                            e = 0, d = a.length; e < d; e++)
                        if (b = a[e] + "ransform", b in c) return a[e].substr(0, a[e].length - 1);
                    return !1
                }();
            b.getTime = Date.now || function() {
                return (new Date).getTime() };
            b.extend = function(a, b) {
                for (var c in b) a[c] = b[c] };
            b.addEvent = function(a, b, c, e) { a.addEventListener(b, c, !!e) };
            b.removeEvent = function(a, b, c, e) { a.removeEventListener(b, c, !!e) };
            b.prefixPointerEvent = function(a) {
                return g.MSPointerEvent ? "MSPointer" + a.charAt(9).toUpperCase() + a.substr(10) : a };
            b.momentum = function(a, b, c, e, d, k) {
                b = a - b;
                c = f.abs(b) / c;
                var g;
                k = void 0 ===
                    k ? 6E-4 : k;
                g = a + c * c / (2 * k) * (0 > b ? -1 : 1);
                k = c / k;
                g < e ? (g = d ? e - d / 2.5 * (c / 8) : e, b = f.abs(g - a), k = b / c) : 0 < g && (g = d ? d / 2.5 * (c / 8) : 0, b = f.abs(a) + g, k = b / c);
                return { destination: f.round(g), duration: k }
            };
            var d = a("transform");
            b.extend(b, { hasTransform: !1 !== d, hasPerspective: a("perspective") in c, hasTouch: "ontouchstart" in g, hasPointer: g.PointerEvent || g.MSPointerEvent, hasTransition: a("transition") in c });
            b.isBadAndroid = /Android /.test(g.navigator.appVersion) && !/Chrome\/\d/.test(g.navigator.appVersion);
            b.extend(b.style = {}, {
                transform: d,
                transitionTimingFunction: a("transitionTimingFunction"),
                transitionDuration: a("transitionDuration"),
                transitionDelay: a("transitionDelay"),
                transformOrigin: a("transformOrigin")
            });
            b.hasClass = function(a, b) {
                return (new RegExp("(^|\\s)" + b + "(\\s|$)")).test(a.className) };
            b.addClass = function(a, c) {
                if (!b.hasClass(a, c)) {
                    var e = a.className.split(" ");
                    e.push(c);
                    a.className = e.join(" ") } };
            b.removeClass = function(a, c) { b.hasClass(a, c) && (a.className = a.className.replace(new RegExp("(^|\\s)" + c + "(\\s|$)", "g"), " ")) };
            b.offset =
                function(a) {
                    for (var b = -a.offsetLeft, c = -a.offsetTop; a = a.offsetParent;) b -= a.offsetLeft, c -= a.offsetTop;
                    return { left: b, top: c } };
            b.preventDefaultException = function(a, b) {
                for (var c in b)
                    if (b[c].test(a[c])) return !0;
                return !1 };
            b.extend(b.eventType = {}, { touchstart: 1, touchmove: 1, touchend: 1, mousedown: 2, mousemove: 2, mouseup: 2, pointerdown: 3, pointermove: 3, pointerup: 3, MSPointerDown: 3, MSPointerMove: 3, MSPointerUp: 3 });
            b.extend(b.ease = {}, {
                quadratic: {
                    style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    fn: function(a) {
                        return a * (2 -
                            a)
                    }
                },
                circular: { style: "cubic-bezier(0.1, 0.57, 0.1, 1)", fn: function(a) {
                        return f.sqrt(1 - --a * a) } },
                back: { style: "cubic-bezier(0.175, 0.885, 0.32, 1.275)", fn: function(a) {
                        return (a -= 1) * a * (5 * a + 4) + 1 } },
                bounce: { style: "", fn: function(a) {
                        return (a /= 1) < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375 } },
                elastic: { style: "", fn: function(a) {
                        return 0 === a ? 0 : 1 == a ? 1 : .4 * f.pow(2, -10 * a) * f.sin(2 * (a - .055) * f.PI / .22) + 1 } }
            });
            b.tap = function(a, b) {
                var c = n.createEvent("Event");
                c.initEvent(b, !0, !0);
                c.pageX = a.pageX;
                c.pageY = a.pageY;
                a.target.dispatchEvent(c)
            };
            b.click = function(a) {
                var b = a.target,
                    c; /(SELECT|INPUT|TEXTAREA)/i.test(b.tagName) || (c = n.createEvent("MouseEvents"), c.initMouseEvent("click", !0, !0, a.view, 1, b.screenX, b.screenY, b.clientX, b.clientY, a.ctrlKey, a.altKey, a.shiftKey, a.metaKey, 0, null), c._constructed = !0, b.dispatchEvent(c)) };
            return b
        }();
    p.prototype = {
        version: "5.1.3",
        _init: function() {
            this._initEvents();
            (this.options.scrollbars || this.options.indicators) && this._initIndicators();
            this.options.mouseWheel && this._initWheel();
            this.options.snap && this._initSnap();
            this.options.keyBindings && this._initKeys()
        },
        destroy: function() { this._initEvents(!0);
            this._execEvent("destroy") },
        _transitionEnd: function(a) { a.target == this.scroller && this.isInTransition && (this._transitionTime(), this.resetPosition(this.options.bounceTime) || (this.isInTransition = !1, this._execEvent("scrollEnd"))) },
        _start: function(a) {
            if (!(1 != d.eventType[a.type] && 0 !== a.button || !this.enabled || this.initiated && d.eventType[a.type] !==
                    this.initiated)) {
                !this.options.preventDefault || d.isBadAndroid || d.preventDefaultException(a.target, this.options.preventDefaultException) || a.preventDefault();
                var b = a.touches ? a.touches[0] : a;
                this.initiated = d.eventType[a.type];
                this.moved = !1;
                this.directionLocked = this.directionY = this.directionX = this.distY = this.distX = 0;
                this._transitionTime();
                this.startTime = d.getTime();
                this.options.useTransition && this.isInTransition ? (this.isInTransition = !1, a = this.getComputedPosition(), this._translate(f.round(a.x), f.round(a.y)),
                    this._execEvent("scrollEnd")) : !this.options.useTransition && this.isAnimating && (this.isAnimating = !1, this._execEvent("scrollEnd"));
                this.startX = this.x;
                this.startY = this.y;
                this.absStartX = this.x;
                this.absStartY = this.y;
                this.pointX = b.pageX;
                this.pointY = b.pageY;
                this._execEvent("beforeScrollStart")
            }
        },
        _move: function(a) {
            if (this.enabled && d.eventType[a.type] === this.initiated) {
                this.options.preventDefault && a.preventDefault();
                var b = a.touches ? a.touches[0] : a,
                    c = b.pageX - this.pointX,
                    e = b.pageY - this.pointY,
                    k = d.getTime(),
                    h;
                this.pointX = b.pageX;
                this.pointY = b.pageY;
                this.distX += c;
                this.distY += e;
                b = f.abs(this.distX);
                h = f.abs(this.distY);
                if (!(300 < k - this.endTime && 10 > b && 10 > h)) {
                    this.directionLocked || this.options.freeScroll || (this.directionLocked = b > h + this.options.directionLockThreshold ? "h" : h >= b + this.options.directionLockThreshold ? "v" : "n");
                    if ("h" == this.directionLocked) {
                        if ("vertical" == this.options.eventPassthrough) a.preventDefault();
                        else if ("horizontal" == this.options.eventPassthrough) { this.initiated = !1;
                            return }
                        e = 0 } else if ("v" == this.directionLocked) {
                        if ("horizontal" ==
                            this.options.eventPassthrough) a.preventDefault();
                        else if ("vertical" == this.options.eventPassthrough) { this.initiated = !1;
                            return }
                        c = 0
                    }
                    c = this.hasHorizontalScroll ? c : 0;
                    e = this.hasVerticalScroll ? e : 0;
                    a = this.x + c;
                    b = this.y + e;
                    if (0 < a || a < this.maxScrollX) a = this.options.bounce ? this.x + c / 3 : 0 < a ? 0 : this.maxScrollX;
                    if (0 < b || b < this.maxScrollY) b = this.options.bounce ? this.y + e / 3 : 0 < b ? 0 : this.maxScrollY;
                    this.directionX = 0 < c ? -1 : 0 > c ? 1 : 0;
                    this.directionY = 0 < e ? -1 : 0 > e ? 1 : 0;
                    this.moved || this._execEvent("scrollStart");
                    this.moved = !0;
                    this._translate(a,
                        b);
                    300 < k - this.startTime && (this.startTime = k, this.startX = this.x, this.startY = this.y, 1 == this.options.probeType && this._execEvent("scroll"));
                    1 < this.options.probeType && this._execEvent("scroll")
                }
            }
        },
        _end: function(a) {
            if (this.enabled && d.eventType[a.type] === this.initiated) {
                this.options.preventDefault && !d.preventDefaultException(a.target, this.options.preventDefaultException) && a.preventDefault();
                var b, c;
                c = d.getTime() - this.startTime;
                var e = f.round(this.x),
                    k = f.round(this.y),
                    h = f.abs(e - this.startX),
                    g = f.abs(k - this.startY);
                b = 0;
                var l = "";
                this.initiated = this.isInTransition = 0;
                this.endTime = d.getTime();
                if (!this.resetPosition(this.options.bounceTime))
                    if (this.scrollTo(e, k), this.moved)
                        if (this._events.flick && 200 > c && 100 > h && 100 > g) this._execEvent("flick");
                        else if (this.options.momentum && 300 > c && (b = this.hasHorizontalScroll ? d.momentum(this.x, this.startX, c, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: e, duration: 0 }, c = this.hasVerticalScroll ? d.momentum(this.y, this.startY, c, this.maxScrollY,
                        this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: k, duration: 0 }, e = b.destination, k = c.destination, b = f.max(b.duration, c.duration), this.isInTransition = 1), this.options.snap && (this.currentPage = l = this._nearestSnap(e, k), b = this.options.snapSpeed || f.max(f.max(f.min(f.abs(e - l.x), 1E3), f.min(f.abs(k - l.y), 1E3)), 300), e = l.x, k = l.y, this.directionY = this.directionX = 0, l = this.options.bounceEasing), e != this.x || k != this.y) {
                    if (0 < e || e < this.maxScrollX || 0 < k || k < this.maxScrollY) l = d.ease.quadratic;
                    this.scrollTo(e, k, b, l)
                } else this._execEvent("scrollEnd");
                else this.options.tap && d.tap(a, this.options.tap), this.options.click && d.click(a), this._execEvent("scrollCancel")
            }
        },
        _resize: function() {
            var a = this;
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(function() { a.refresh() }, this.options.resizePolling) },
        resetPosition: function(a) {
            var b = this.x,
                c = this.y;
            !this.hasHorizontalScroll || 0 < this.x ? b = 0 : this.x < this.maxScrollX && (b = this.maxScrollX);
            !this.hasVerticalScroll || 0 < this.y ? c = 0 : this.y < this.maxScrollY &&
                (c = this.maxScrollY);
            if (b == this.x && c == this.y) return !1;
            this.scrollTo(b, c, a || 0, this.options.bounceEasing);
            return !0
        },
        disable: function() { this.enabled = !1 },
        enable: function() { this.enabled = !0 },
        refresh: function() {
            this.wrapperWidth = this.wrapper.clientWidth;
            this.wrapperHeight = this.wrapper.clientHeight;
            this.scrollerWidth = this.scroller.offsetWidth;
            this.scrollerHeight = this.scroller.offsetHeight;
            this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
            this.maxScrollY = this.wrapperHeight - this.scrollerHeight;
            this.hasHorizontalScroll =
                this.options.scrollX && 0 > this.maxScrollX;
            this.hasVerticalScroll = this.options.scrollY && 0 > this.maxScrollY;
            this.hasHorizontalScroll || (this.maxScrollX = 0, this.scrollerWidth = this.wrapperWidth);
            this.hasVerticalScroll || (this.maxScrollY = 0, this.scrollerHeight = this.wrapperHeight);
            this.directionY = this.directionX = this.endTime = 0;
            this.wrapperOffset = d.offset(this.wrapper);
            this._execEvent("refresh");
            this.resetPosition()
        },
        on: function(a, b) { this._events[a] || (this._events[a] = []);
            this._events[a].push(b) },
        off: function(a,
            b) {
            if (this._events[a]) {
                var c = this._events[a].indexOf(b); - 1 < c && this._events[a].splice(c, 1) } },
        _execEvent: function(a) {
            if (this._events[a]) {
                var b = 0,
                    c = this._events[a].length;
                if (c)
                    for (; b < c; b++) this._events[a][b].apply(this, [].slice.call(arguments, 1)) } },
        scrollBy: function(a, b, c, e) { a = this.x + a;
            b = this.y + b;
            this.scrollTo(a, b, c || 0, e) },
        scrollTo: function(a, b, c, e) {
            e = e || d.ease.circular;
            this.isInTransition = this.options.useTransition && 0 < c;
            !c || this.options.useTransition && e.style ? (this._transitionTimingFunction(e.style),
                this._transitionTime(c), this._translate(a, b)) : this._animate(a, b, c, e.fn)
        },
        scrollToElement: function(a, b, c, e, k) {
            /*if (a = a.nodeType ? a : this.scroller.querySelector(a)) {
                var h = d.offset(a);
                h.left -= this.wrapperOffset.left;
                h.top -= this.wrapperOffset.top;
                !0 === c && (c = f.round(a.offsetWidth / 2 - this.wrapper.offsetWidth / 2));
                !0 === e && (e = f.round(a.offsetHeight / 2 - this.wrapper.offsetHeight / 2));
                h.left -= c || 0;
                h.top -= e || 0;
                h.left = 0 < h.left ? 0 : h.left < this.maxScrollX ? this.maxScrollX : h.left;
                h.top = 0 < h.top ? 0 : h.top < this.maxScrollY ? this.maxScrollY :
                    h.top;
                b = void 0 === b || null === b || "auto" === b ? f.max(f.abs(this.x - h.left), f.abs(this.y - h.top)) : b;
                this.scrollTo(h.left, h.top, b, k)
            }*/
        },
        _transitionTime: function(a) { a = a || 0;
            this.scrollerStyle[d.style.transitionDuration] = a + "ms";!a && d.isBadAndroid && (this.scrollerStyle[d.style.transitionDuration] = "0.001s");
            if (this.indicators)
                for (var b = this.indicators.length; b--;) this.indicators[b].transitionTime(a) },
        _transitionTimingFunction: function(a) {
            this.scrollerStyle[d.style.transitionTimingFunction] = a;
            if (this.indicators)
                for (var b =
                        this.indicators.length; b--;) this.indicators[b].transitionTimingFunction(a)
        },
        _translate: function(a, b) { this.options.useTransform ? this.scrollerStyle[d.style.transform] = "translate(" + a + "px," + b + "px)" + this.translateZ : (a = f.round(a), b = f.round(b), this.scrollerStyle.left = a + "px", this.scrollerStyle.top = b + "px");
            this.x = a;
            this.y = b;
            if (this.indicators)
                for (var c = this.indicators.length; c--;) this.indicators[c].updatePosition() },
        _initEvents: function(a) {
            a = a ? d.removeEvent : d.addEvent;
            var b = this.options.bindToWrapper ? this.wrapper :
                g;
            a(g, "orientationchange", this);
            a(g, "resize", this);
            this.options.click && a(this.wrapper, "click", this, !0);
            this.options.disableMouse || (a(this.wrapper, "mousedown", this), a(b, "mousemove", this), a(b, "mousecancel", this), a(b, "mouseup", this));
            d.hasPointer && !this.options.disablePointer && (a(this.wrapper, d.prefixPointerEvent("pointerdown"), this), a(b, d.prefixPointerEvent("pointermove"), this), a(b, d.prefixPointerEvent("pointercancel"), this), a(b, d.prefixPointerEvent("pointerup"), this));
            d.hasTouch && !this.options.disableTouch &&
                (a(this.wrapper, "touchstart", this), a(b, "touchmove", this), a(b, "touchcancel", this), a(b, "touchend", this));
            a(this.scroller, "transitionend", this);
            a(this.scroller, "webkitTransitionEnd", this);
            a(this.scroller, "oTransitionEnd", this);
            a(this.scroller, "MSTransitionEnd", this)
        },
        getComputedPosition: function() {
            var a = g.getComputedStyle(this.scroller, null),
                b;
            this.options.useTransform ? (a = a[d.style.transform].split(")")[0].split(", "), b = +(a[12] || a[4]), a = +(a[13] || a[5])) : (b = +a.left.replace(/[^-\d.]/g, ""), a = +a.top.replace(/[^-\d.]/g,
                ""));
            return { x: b, y: a }
        },
        _initIndicators: function() {
            function a(a) {
                for (var b = f.indicators.length; b--;) a.call(f.indicators[b]) }
            var b = this.options.interactiveScrollbars,
                c = "string" != typeof this.options.scrollbars,
                e = [],
                d, f = this;
            this.indicators = [];
            this.options.scrollbars && (this.options.scrollY && (d = { el: s("v", b, this.options.scrollbars), interactive: b, defaultScrollbars: !0, customStyle: c, resize: this.options.resizeScrollbars, shrink: this.options.shrinkScrollbars, fade: this.options.fadeScrollbars, listenX: !1 }, this.wrapper.appendChild(d.el),
                e.push(d)), this.options.scrollX && (d = { el: s("h", b, this.options.scrollbars), interactive: b, defaultScrollbars: !0, customStyle: c, resize: this.options.resizeScrollbars, shrink: this.options.shrinkScrollbars, fade: this.options.fadeScrollbars, listenY: !1 }, this.wrapper.appendChild(d.el), e.push(d)));
            this.options.indicators && (e = e.concat(this.options.indicators));
            for (b = e.length; b--;) this.indicators.push(new t(this, e[b]));
            this.options.fadeScrollbars && (this.on("scrollEnd", function() { a(function() { this.fade() }) }), this.on("scrollCancel",
                function() { a(function() { this.fade() }) }), this.on("scrollStart", function() { a(function() { this.fade(1) }) }), this.on("beforeScrollStart", function() { a(function() { this.fade(1, !0) }) }));
            this.on("refresh", function() { a(function() { this.refresh() }) });
            this.on("destroy", function() { a(function() { this.destroy() });
                delete this.indicators })
        },
        _initWheel: function() {
            d.addEvent(this.wrapper, "wheel", this);
            d.addEvent(this.wrapper, "mousewheel", this);
            d.addEvent(this.wrapper, "DOMMouseScroll", this);
            this.on("destroy", function() {
                d.removeEvent(this.wrapper,
                    "wheel", this);
                d.removeEvent(this.wrapper, "mousewheel", this);
                d.removeEvent(this.wrapper, "DOMMouseScroll", this)
            })
        },
        _wheel: function(a) {
            if (this.enabled) {
                a.preventDefault();
                a.stopPropagation();
                var b, c, e, d = this;
                void 0 === this.wheelTimeout && d._execEvent("scrollStart");
                clearTimeout(this.wheelTimeout);
                this.wheelTimeout = setTimeout(function() { d._execEvent("scrollEnd");
                    d.wheelTimeout = void 0 }, 400);
                if ("deltaX" in a) 1 === a.deltaMode ? (b = -a.deltaX * this.options.mouseWheelSpeed, a = -a.deltaY * this.options.mouseWheelSpeed) :
                    (b = -a.deltaX, a = -a.deltaY);
                else if ("wheelDeltaX" in a) b = a.wheelDeltaX / 120 * this.options.mouseWheelSpeed, a = a.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
                else if ("wheelDelta" in a) b = a = a.wheelDelta / 120 * this.options.mouseWheelSpeed;
                else if ("detail" in a) b = a = -a.detail / 3 * this.options.mouseWheelSpeed;
                else return;
                b *= this.options.invertWheelDirection;
                a *= this.options.invertWheelDirection;
                this.hasVerticalScroll || (b = a, a = 0);
                this.options.snap ? (c = this.currentPage.pageX, e = this.currentPage.pageY, 0 < b ? c-- : 0 > b && c++, 0 < a ?
                    e-- : 0 > a && e++, this.goToPage(c, e)) : (c = this.x + f.round(this.hasHorizontalScroll ? b : 0), e = this.y + f.round(this.hasVerticalScroll ? a : 0), 0 < c ? c = 0 : c < this.maxScrollX && (c = this.maxScrollX), 0 < e ? e = 0 : e < this.maxScrollY && (e = this.maxScrollY), this.scrollTo(c, e, 0), 1 < this.options.probeType && this._execEvent("scroll"))
            }
        },
        _initSnap: function() {
            this.currentPage = {};
            "string" == typeof this.options.snap && (this.options.snap = this.scroller.querySelectorAll(this.options.snap));
            this.on("refresh", function() {
                var a = 0,
                    b, c = 0,
                    e, d, h, g = 0,
                    l;
                e = this.options.snapStepX ||
                    this.wrapperWidth;
                var m = this.options.snapStepY || this.wrapperHeight;
                this.pages = [];
                if (this.wrapperWidth && this.wrapperHeight && this.scrollerWidth && this.scrollerHeight) {
                    if (!0 === this.options.snap)
                        for (d = f.round(e / 2), h = f.round(m / 2); g > -this.scrollerWidth;) { this.pages[a] = [];
                            for (l = b = 0; l > -this.scrollerHeight;) this.pages[a][b] = { x: f.max(g, this.maxScrollX), y: f.max(l, this.maxScrollY), width: e, height: m, cx: g - d, cy: l - h }, l -= m, b++;
                            g -= e;
                            a++ } else
                            for (m = this.options.snap, b = m.length, e = -1; a < b; a++) {
                                if (0 === a || m[a].offsetLeft <=
                                    m[a - 1].offsetLeft) c = 0, e++;
                                this.pages[c] || (this.pages[c] = []);
                                g = f.max(-m[a].offsetLeft, this.maxScrollX);
                                l = f.max(-m[a].offsetTop, this.maxScrollY);
                                d = g - f.round(m[a].offsetWidth / 2);
                                h = l - f.round(m[a].offsetHeight / 2);
                                this.pages[c][e] = { x: g, y: l, width: m[a].offsetWidth, height: m[a].offsetHeight, cx: d, cy: h };
                                g > this.maxScrollX && c++
                            }
                    this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);
                    0 === this.options.snapThreshold % 1 ? this.snapThresholdY = this.snapThresholdX = this.options.snapThreshold : (this.snapThresholdX =
                        f.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold), this.snapThresholdY = f.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold))
                }
            });
            this.on("flick", function() {
                var a = this.options.snapSpeed || f.max(f.max(f.min(f.abs(this.x - this.startX), 1E3), f.min(f.abs(this.y - this.startY), 1E3)), 300);
                this.goToPage(this.currentPage.pageX + this.directionX, this.currentPage.pageY + this.directionY, a) })
        },
        _nearestSnap: function(a, b) {
            if (!this.pages.length) return {
                x: 0,
                y: 0,
                pageX: 0,
                pageY: 0
            };
            var c = 0,
                e = this.pages.length,
                d = 0;
            if (f.abs(a - this.absStartX) < this.snapThresholdX && f.abs(b - this.absStartY) < this.snapThresholdY) return this.currentPage;
            0 < a ? a = 0 : a < this.maxScrollX && (a = this.maxScrollX);
            0 < b ? b = 0 : b < this.maxScrollY && (b = this.maxScrollY);
            for (; c < e; c++)
                if (a >= this.pages[c][0].cx) { a = this.pages[c][0].x;
                    break }
            for (e = this.pages[c].length; d < e; d++)
                if (b >= this.pages[0][d].cy) { b = this.pages[0][d].y;
                    break }
            c == this.currentPage.pageX && (c += this.directionX, 0 > c ? c = 0 : c >= this.pages.length && (c = this.pages.length -
                1), a = this.pages[c][0].x);
            d == this.currentPage.pageY && (d += this.directionY, 0 > d ? d = 0 : d >= this.pages[0].length && (d = this.pages[0].length - 1), b = this.pages[0][d].y);
            return { x: a, y: b, pageX: c, pageY: d }
        },
        goToPage: function(a, b, c, d) {
            d = d || this.options.bounceEasing;
            a >= this.pages.length ? a = this.pages.length - 1 : 0 > a && (a = 0);
            b >= this.pages[a].length ? b = this.pages[a].length - 1 : 0 > b && (b = 0);
            var g = this.pages[a][b].x,
                h = this.pages[a][b].y;
            c = void 0 === c ? this.options.snapSpeed || f.max(f.max(f.min(f.abs(g - this.x), 1E3), f.min(f.abs(h - this.y),
                1E3)), 300) : c;
            this.currentPage = { x: g, y: h, pageX: a, pageY: b };
            this.scrollTo(g, h, c, d)
        },
        next: function(a, b) {
            var c = this.currentPage.pageX,
                d = this.currentPage.pageY;
            c++;
            c >= this.pages.length && this.hasVerticalScroll && (c = 0, d++);
            this.goToPage(c, d, a, b) },
        prev: function(a, b) {
            var c = this.currentPage.pageX,
                d = this.currentPage.pageY;
            c--;
            0 > c && this.hasVerticalScroll && (c = 0, d--);
            this.goToPage(c, d, a, b) },
        _initKeys: function(a) {
            a = { pageUp: 33, pageDown: 34, end: 35, home: 36, left: 37, up: 38, right: 39, down: 40 };
            var b;
            if ("object" == typeof this.options.keyBindings)
                for (b in this.options.keyBindings) "string" ==
                    typeof this.options.keyBindings[b] && (this.options.keyBindings[b] = this.options.keyBindings[b].toUpperCase().charCodeAt(0));
            else this.options.keyBindings = {};
            for (b in a) this.options.keyBindings[b] = this.options.keyBindings[b] || a[b];
            d.addEvent(g, "keydown", this);
            this.on("destroy", function() { d.removeEvent(g, "keydown", this) })
        },
        _key: function(a) {
            if (this.enabled) {
                var b = this.options.snap,
                    c = b ? this.currentPage.pageX : this.x,
                    e = b ? this.currentPage.pageY : this.y,
                    g = d.getTime(),
                    h = this.keyTime || 0,
                    n;
                this.options.useTransition &&
                    this.isInTransition && (n = this.getComputedPosition(), this._translate(f.round(n.x), f.round(n.y)), this.isInTransition = !1);
                this.keyAcceleration = 200 > g - h ? f.min(this.keyAcceleration + .25, 50) : 0;
                switch (a.keyCode) {
                    case this.options.keyBindings.pageUp:
                        this.hasHorizontalScroll && !this.hasVerticalScroll ? c += b ? 1 : this.wrapperWidth : e += b ? 1 : this.wrapperHeight;
                        break;
                    case this.options.keyBindings.pageDown:
                        this.hasHorizontalScroll && !this.hasVerticalScroll ? c -= b ? 1 : this.wrapperWidth : e -= b ? 1 : this.wrapperHeight;
                        break;
                    case this.options.keyBindings.end:
                        c =
                            b ? this.pages.length - 1 : this.maxScrollX;
                        e = b ? this.pages[0].length - 1 : this.maxScrollY;
                        break;
                    case this.options.keyBindings.home:
                        e = c = 0;
                        break;
                    case this.options.keyBindings.left:
                        c += b ? -1 : 5 + this.keyAcceleration >> 0;
                        break;
                    case this.options.keyBindings.up:
                        e += b ? 1 : 5 + this.keyAcceleration >> 0;
                        break;
                    case this.options.keyBindings.right:
                        c -= b ? -1 : 5 + this.keyAcceleration >> 0;
                        break;
                    case this.options.keyBindings.down:
                        e -= b ? 1 : 5 + this.keyAcceleration >> 0;
                        break;
                    default:
                        return
                }
                b ? this.goToPage(c, e) : (0 < c ? this.keyAcceleration = c = 0 : c < this.maxScrollX &&
                    (c = this.maxScrollX, this.keyAcceleration = 0), 0 < e ? this.keyAcceleration = e = 0 : e < this.maxScrollY && (e = this.maxScrollY, this.keyAcceleration = 0), this.scrollTo(c, e, 0), this.keyTime = g)
            }
        },
        _animate: function(a, b, c, e) {
            function f() {
                var q = d.getTime(),
                    r;
                q >= p ? (g.isAnimating = !1, g._translate(a, b), g.resetPosition(g.options.bounceTime) || g._execEvent("scrollEnd")) : (q = (q - m) / c, r = e(q), q = (a - n) * r + n, r = (b - l) * r + l, g._translate(q, r), g.isAnimating && u(f), 3 == g.options.probeType && g._execEvent("scroll")) }
            var g = this,
                n = this.x,
                l = this.y,
                m = d.getTime(),
                p = m + c;
            this.isAnimating = !0;
            f()
        },
        handleEvent: function(a) {
            switch (a.type) {
                case "touchstart":
                case "pointerdown":
                case "MSPointerDown":
                case "mousedown":
                    this._start(a);
                    break;
                case "touchmove":
                case "pointermove":
                case "MSPointerMove":
                case "mousemove":
                    this._move(a);
                    break;
                case "touchend":
                case "pointerup":
                case "MSPointerUp":
                case "mouseup":
                case "touchcancel":
                case "pointercancel":
                case "MSPointerCancel":
                case "mousecancel":
                    this._end(a);
                    break;
                case "orientationchange":
                case "resize":
                    this._resize();
                    break;
                case "transitionend":
                case "webkitTransitionEnd":
                case "oTransitionEnd":
                case "MSTransitionEnd":
                    this._transitionEnd(a);
                    break;
                case "wheel":
                case "DOMMouseScroll":
                case "mousewheel":
                    this._wheel(a);
                    break;
                case "keydown":
                    this._key(a);
                    break;
                case "click":
                    a._constructed || (a.preventDefault(), a.stopPropagation())
            }
        }
    };
    t.prototype = {
        handleEvent: function(a) {
            switch (a.type) {
                case "touchstart":
                case "pointerdown":
                case "MSPointerDown":
                case "mousedown":
                    this._start(a);
                    break;
                case "touchmove":
                case "pointermove":
                case "MSPointerMove":
                case "mousemove":
                    this._move(a);
                    break;
                case "touchend":
                case "pointerup":
                case "MSPointerUp":
                case "mouseup":
                case "touchcancel":
                case "pointercancel":
                case "MSPointerCancel":
                case "mousecancel":
                    this._end(a) } },
        destroy: function() { this.options.interactive && (d.removeEvent(this.indicator, "touchstart", this), d.removeEvent(this.indicator, d.prefixPointerEvent("pointerdown"), this), d.removeEvent(this.indicator, "mousedown", this), d.removeEvent(g, "touchmove", this), d.removeEvent(g, d.prefixPointerEvent("pointermove"), this), d.removeEvent(g, "mousemove", this), d.removeEvent(g, "touchend", this), d.removeEvent(g, d.prefixPointerEvent("pointerup"), this), d.removeEvent(g, "mouseup", this));
            this.options.defaultScrollbars && this.wrapper.parentNode.removeChild(this.wrapper) },
        _start: function(a) {
            var b = a.touches ? a.touches[0] : a;
            a.preventDefault();
            a.stopPropagation();
            this.transitionTime();
            this.initiated = !0;
            this.moved = !1;
            this.lastPointX = b.pageX;
            this.lastPointY = b.pageY;
            this.startTime = d.getTime();
            this.options.disableTouch || d.addEvent(g, "touchmove", this);
            this.options.disablePointer || d.addEvent(g, d.prefixPointerEvent("pointermove"), this);
            this.options.disableMouse || d.addEvent(g, "mousemove", this);
            this.scroller._execEvent("beforeScrollStart") },
        _move: function(a) {
            var b = a.touches ? a.touches[0] :
                a,
                c, e, f = d.getTime();
            this.moved || this.scroller._execEvent("scrollStart");
            this.moved = !0;
            c = b.pageX - this.lastPointX;
            this.lastPointX = b.pageX;
            e = b.pageY - this.lastPointY;
            this.lastPointY = b.pageY;
            this._pos(this.x + c, this.y + e);
            1 == this.scroller.options.probeType && 300 < f - this.startTime ? (this.startTime = f, this.scroller._execEvent("scroll")) : 1 < this.scroller.options.probeType && this.scroller._execEvent("scroll");
            a.preventDefault();
            a.stopPropagation()
        },
        _end: function(a) {
            if (this.initiated) {
                this.initiated = !1;
                a.preventDefault();
                a.stopPropagation();
                d.removeEvent(g, "touchmove", this);
                d.removeEvent(g, d.prefixPointerEvent("pointermove"), this);
                d.removeEvent(g, "mousemove", this);
                if (this.scroller.options.snap) {
                    a = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);
                    var b = this.options.snapSpeed || f.max(f.max(f.min(f.abs(this.scroller.x - a.x), 1E3), f.min(f.abs(this.scroller.y - a.y), 1E3)), 300);
                    if (this.scroller.x != a.x || this.scroller.y != a.y) this.scroller.directionX = 0, this.scroller.directionY = 0, this.scroller.currentPage = a, this.scroller.scrollTo(a.x,
                        a.y, b, this.scroller.options.bounceEasing)
                }
                this.moved && this.scroller._execEvent("scrollEnd")
            }
        },
        transitionTime: function(a) { a = a || 0;
            this.indicatorStyle[d.style.transitionDuration] = a + "ms";!a && d.isBadAndroid && (this.indicatorStyle[d.style.transitionDuration] = "0.001s") },
        transitionTimingFunction: function(a) { this.indicatorStyle[d.style.transitionTimingFunction] = a },
        refresh: function() {
            this.transitionTime();
            this.indicatorStyle.display = this.options.listenX && !this.options.listenY ? this.scroller.hasHorizontalScroll ?
                "block" : "none" : this.options.listenY && !this.options.listenX ? this.scroller.hasVerticalScroll ? "block" : "none" : this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? "block" : "none";
            this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ? (d.addClass(this.wrapper, "iScrollBothScrollbars"), d.removeClass(this.wrapper, "iScrollLoneScrollbar"), this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ? this.wrapper.style.right = "8px" : this.wrapper.style.bottom = "8px")) :
                (d.removeClass(this.wrapper, "iScrollBothScrollbars"), d.addClass(this.wrapper, "iScrollLoneScrollbar"), this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ? this.wrapper.style.right = "2px" : this.wrapper.style.bottom = "2px"));
            this.options.listenX && (this.wrapperWidth = this.wrapper.clientWidth, this.options.resize ? (this.indicatorWidth = f.max(f.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8), this.indicatorStyle.width = this.indicatorWidth +
                "px") : this.indicatorWidth = this.indicator.clientWidth, this.maxPosX = this.wrapperWidth - this.indicatorWidth, "clip" == this.options.shrink ? (this.minBoundaryX = -this.indicatorWidth + 8, this.maxBoundaryX = this.wrapperWidth - 8) : (this.minBoundaryX = 0, this.maxBoundaryX = this.maxPosX), this.sizeRatioX = this.options.speedRatioX || this.scroller.maxScrollX && this.maxPosX / this.scroller.maxScrollX);
            this.options.listenY && (this.wrapperHeight = this.wrapper.clientHeight, this.options.resize ? (this.indicatorHeight = f.max(f.round(this.wrapperHeight *
                    this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8), this.indicatorStyle.height = this.indicatorHeight + "px") : this.indicatorHeight = this.indicator.clientHeight, this.maxPosY = this.wrapperHeight - this.indicatorHeight, "clip" == this.options.shrink ? (this.minBoundaryY = -this.indicatorHeight + 8, this.maxBoundaryY = this.wrapperHeight - 8) : (this.minBoundaryY = 0, this.maxBoundaryY = this.maxPosY), this.maxPosY = this.wrapperHeight - this.indicatorHeight, this.sizeRatioY = this.options.speedRatioY || this.scroller.maxScrollY &&
                this.maxPosY / this.scroller.maxScrollY);
            this.updatePosition()
        },
        updatePosition: function() {
            var a = this.options.listenX && f.round(this.sizeRatioX * this.scroller.x) || 0,
                b = this.options.listenY && f.round(this.sizeRatioY * this.scroller.y) || 0;
            this.options.ignoreBoundaries || (a < this.minBoundaryX ? ("scale" == this.options.shrink && (this.width = f.max(this.indicatorWidth + a, 8), this.indicatorStyle.width = this.width + "px"), a = this.minBoundaryX) : a > this.maxBoundaryX ? "scale" == this.options.shrink ? (this.width = f.max(this.indicatorWidth -
                (a - this.maxPosX), 8), this.indicatorStyle.width = this.width + "px", a = this.maxPosX + this.indicatorWidth - this.width) : a = this.maxBoundaryX : "scale" == this.options.shrink && this.width != this.indicatorWidth && (this.width = this.indicatorWidth, this.indicatorStyle.width = this.width + "px"), b < this.minBoundaryY ? ("scale" == this.options.shrink && (this.height = f.max(this.indicatorHeight + 3 * b, 8), this.indicatorStyle.height = this.height + "px"), b = this.minBoundaryY) : b > this.maxBoundaryY ? "scale" == this.options.shrink ? (this.height = f.max(this.indicatorHeight -
                3 * (b - this.maxPosY), 8), this.indicatorStyle.height = this.height + "px", b = this.maxPosY + this.indicatorHeight - this.height) : b = this.maxBoundaryY : "scale" == this.options.shrink && this.height != this.indicatorHeight && (this.height = this.indicatorHeight, this.indicatorStyle.height = this.height + "px"));
            this.x = a;
            this.y = b;
            this.scroller.options.useTransform ? this.indicatorStyle[d.style.transform] = "translate(" + a + "px," + b + "px)" + this.scroller.translateZ : (this.indicatorStyle.left = a + "px", this.indicatorStyle.top = b + "px")
        },
        _pos: function(a,
            b) { 0 > a ? a = 0 : a > this.maxPosX && (a = this.maxPosX);
            0 > b ? b = 0 : b > this.maxPosY && (b = this.maxPosY);
            a = this.options.listenX ? f.round(a / this.sizeRatioX) : this.scroller.x;
            b = this.options.listenY ? f.round(b / this.sizeRatioY) : this.scroller.y;
            this.scroller.scrollTo(a, b) },
        fade: function(a, b) {
            if (!b || this.visible) {
                clearTimeout(this.fadeTimeout);
                this.fadeTimeout = null;
                var c = a ? 250 : 500,
                    e = a ? 0 : 300;
                this.wrapperStyle[d.style.transitionDuration] = c + "ms";
                this.fadeTimeout = setTimeout(function(a) { this.wrapperStyle.opacity = a;
                    this.visible = +a }.bind(this,
                    a ? "1" : "0"), e)
            }
        }
    };
    p.utils = d;
    "undefined" != typeof module && module.exports ? module.exports = p : g.IScroll = p
})(window, document, Math);

(function ($) {
    $.fn.timer = function(opts){
		var defaults = {
			dateStart : new Date(),
			dateNum : 10,
			timeStart : 9,
			timeNum : 12,
			onOk : null,
			onCancel : null,
		};
		var option = $.extend(defaults, opts);

		var input = $(this),
			itemHeight = 48;
		var picker = {
			init : function(){
				var _this = this;

				_this.renderHTML();

				var container = $('.ui-timer-poppanel'),
					mpDate = $('.ui-timer-date', container),
					mpTime = $('.ui-timer-time', container);
				//初始化date
				var dateStr = '',
					dateStart = option.dateStart,
					sYear = dateStart.getFullYear(),
					sMonth = dateStart.getMonth(),
					sDate = dateStart.getDate();
				for(var i=0; i<option.dateNum; i++){
					var nextDate = new Date(sYear, sMonth, sDate+i),
						m = nextDate.getMonth(),
						d = nextDate.getDate(),
						da = nextDate.getDay(),
						w = '日一二三四五六'.charAt(da),
						sel = i == 0 ? 'selected' : '';
					if(m < 10){
						m = '0' + m;
					}
					if(d < 10){
						d = '0' + d;
					}
					dateStr += '<li class="'+sel+'" data-date="'+m+'-'+d+'">'+m+'月'+d+'日&nbsp;星期'+w+'</li>';
				}
				dateStr += '<li></li><li></li>';
				mpDate.find('ul').append(dateStr);

				//初始化time
				var timeStr = '';
				for(var j=0; j<option.timeNum; j++){
					var t = option.timeStart + j,
						sel = j == 0 ? 'selected' : '';
					timeStr += '<li class="'+sel+'" data-time="'+t+':00">'+t+':00</li><li data-time="'+t+':30">'+t+':30</li>';
					if(j==option.timeNum - 1){
						timeStr += '<li data-time="'+(t+1)+':00">'+(t+1)+':00</li>';
					}
				}
				timeStr += '<li></li><li></li>';
				mpTime.find('ul').append(timeStr);

				document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
				//初始化scroll
				var elHeight = itemHeight;
				var dateScroll = new IScroll('.ui-timer-date', {
					snap : 'li',
					probeType : 2,
					tap : true
				});
				dateScroll.on('scroll', function(){
					_this.updateSelected(mpDate, this);
				});
				dateScroll.on('scrollEnd', function(){
					_this.updateSelected(mpDate, this);
				});
				var timeScroll = new IScroll('.ui-timer-time', {
					snap : 'li',
					probeType : 2,
					tap : true
				});
				timeScroll.on('scroll', function(){
					_this.updateSelected(mpTime, this);
				});
				timeScroll.on('scrollEnd', function(){
					_this.updateSelected(mpTime, this);
				});

				this.dateScroll = dateScroll;
				this.timeScroll = timeScroll;

				//初始化点击input事件
				input.on('click', function(){
					if(container.hasClass('show')){
						_this.hidePanel();
					}
					else{
						_this.showPanel();
					}
				});

				//初始化点击li
				mpDate.find('li').on('click', function(){
					_this.checkDate($(this));
				});
				mpTime.find('li').on('click', function(){
					_this.checkTime($(this));
				});

				//初始化点击事件
				$('.ui-timer-ok', container).on('click', function(){
					var date = mpDate.find('.selected').data('date');
					var time = mpTime.find('.selected').data('time');
					input.val(date + ' ' + time);
					_this.hidePanel();
					option.onOk && typeof option.onOk=='function' && option.onOk(container);
				});
				$('.ui-timer-cancel', container).on('click', function(){
					_this.hidePanel();
					option.onCancel && typeof option.onCancel=='function' && option.onCancel(container);
				});
				$('.ui-timer-mask').on('click', function(){
					_this.hidePanel();
				});

				//初始化原有的数据
				this.setValue();
			},
			renderHTML : function(){
				var stime = option.timeStart + ':00';
				var etime = option.timeStart + option.timeNum + ':00';
				var html = '<div class="ui-timer-mask"></div><div id="timer" class="ui-timer-poppanel"><div class="ui-timer-panel"><h3 class="ui-timer-title">请选择时间</h3><div class="ui-timer-body"><div class="ui-timer-date"><ul><li class="ui-timer-note">上下滚动选取时间</li><li></li></ul></div><div class="ui-timer-time"><ul><li class="ui-timer-note">可选时间：'+stime+'-'+etime+'</li><li></li></ul></div><div class="ui-timer-indicate"></div></div><div class="ui-timer-confirm"><a href="javascript:void(0);" class="ui-timer-ok">确定</a> <a href="javascript:void(0);" class="ui-timer-cancel">取消</a></div></div></div>';
				$(document.body).append(html);
			},
			updateSelected : function(container, iscroll){
				var index = (-iscroll.y) / itemHeight + 2;
				var current = container.find('li').eq(index);
				current.addClass('selected').siblings().removeClass('selected');
			},
			showPanel : function(container){
				$('.ui-timer-poppanel, .ui-timer-mask').addClass('show');
			},
			hidePanel : function(){
				$('.ui-timer-poppanel, .ui-timer-mask').removeClass('show');
			},
			setValue : function(){
				var value = input.val();
				var dateArr = value.split(' '),
					date = dateArr[0],
					time = dateArr[1],
					dateItem = $('.ui-timer-date li[data-date="'+date+'"]'),
					timeItem = $('.ui-timer-time li[data-time="'+time+'"]');
				this.checkDate(dateItem);
				this.checkTime(timeItem);

			},
			checkDate : function(el){
				var target = el.prev('li').prev('li');
				this.dateScroll.scrollToElement(target[0]);
			},
			checkTime : function(el){
				var target = el.prev('li').prev('li');
				this.timeScroll.scrollToElement(target[0]);
			}
		}
		picker.init();
		return picker;
	}
	return $.fn.timer;
})(Zepto);


!function($){

	// 默认模板
	var _tipsTpl='<div class="ui-poptips ui-poptips-<%=type%>">'+
					'<div class="ui-poptips-cnt">'+
    				'<i></i><%=content%>'+
					'</div>'+
				'</div>';
	
	// 默认参数
	var defaults={
		content:'',
		stayTime:1000,
		type:'info',
		callback:function(){}
	}
	// 构造函数
	var Tips   = function (el,option,isFromTpl) {
		var self=this;
		this.element=$(el);
		this._isFromTpl=isFromTpl;
		this.elementHeight=$(el).height();

		this.option=$.extend(defaults,option);
		$(el).css({
			"-webkit-transform":"translateY(-"+this.elementHeight+"px)"
		});
		setTimeout(function(){
			$(el).css({
				"-webkit-transition":"all .5s"
			});
			self.show();
		},20);
		
	}
	Tips.prototype={
		show:function(){
			var self=this;
			// self.option.callback("show");
			self.element.trigger($.Event("tips:show"));
			this.element.css({
				"-webkit-transform":"translateY(0px)"
			});
			if(self.option.stayTime>0){
				setTimeout(function(){
					self.hide();
				},self.option.stayTime)
			}
		},
		hide :function () {
			var self=this;
			self.element.trigger($.Event("tips:hide"));
			this.element.css({
				"-webkit-transform":"translateY(-"+this.elementHeight+"px)"
			});
			setTimeout(function(){
				self._isFromTpl&&self.element.remove();
			},500)
				
			
		}
	}
	function Plugin(option) {

		return $.adaptObject(this, defaults, option,_tipsTpl,Tips,"tips");
	}
	$.fn.tips=$.tips= Plugin;
}(window.Zepto)
	

