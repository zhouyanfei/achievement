(function () {
    function setup(jQuery, iScroll, Hammer, FastClick) {
        var ipu = {};

// Carousel
(function (ipu, $, iscroll) {
// carouselSlt应该是唯一的，否则怎么支撑多个回调，如果用户不需要多个回调，也不主动调用，则可以，先不管吧？？？
    function Carousel(slt, options) {
        this.options = options = $.extend({}, this.defaultOpt, options);
        this.el = $(slt).eq(0);  // 一次只能实例化一个
        this.autoPlay = options.autoPlay;
         this.hasIndicator = options.indicator;
        this.callBack = options.callBack;
        this.currentIndex = null;

        this._init();
        this.play();
    }

    Carousel.prototype = {
        defaultOpt: {
            index: null,            // 默认显示索引，未设置时先查找对就active,未找到时是0
            autoPlay: false,       //  是否自动播放
            duration: 3000,         //  自动播放延时
            indicator: false,       // 是否生成指示器
            indicatorPosition: 'center',  // left|right|center;暂不支持，不知道怎么支持在中间显示，用全宽度，配合point-event:none,可能ok
            callBack: null           // 变更时回调函数
        },
        _init: function () {
            var wrapper = $(">.ipu-carousel-wrapper", this.el);
            var carouselItems = $(">li", wrapper);
            this.carouselItems = carouselItems;
            this.size = carouselItems.size();
            that = this;

            if (this.options.index == null) {
                var activeIndex = carouselItems.filter(".ipu-current").index();
                this.options.index = activeIndex != -1 ? activeIndex : 0;
            }

            if (this.hasIndicator) {
                this._addIndicator();
            }
            $(window).resize(function () {
                that.refresh();
            });
            var scrollOpt = {
                snap: "li",          // carousel效果
                momentum: false,     // 移除惯性处理
                scrollX: true,       // X轴移动
                scrollY:false,
                hScrollbar: false,   // 没有纵向滚动条
                onScrollStart: function () {
                    that._pause();
                },
                onTouchEnd: function () {
                    // 后面优化
                    /*
                     if (that.iscroll.currPageX == that.size - 1) {
                     that.show(that.size - 2);
                     }
                     */
                },
                onScrollEnd: function () {
                    that._end();
                }
            };
            this.iscroll = new iscroll(this.el.get(0), scrollOpt);
            this.show(this.options.index, 0);
        },
        stop: function () {
            this._pause();
            this.autoPlay=false;
        },
        _pause: function () {
            if (this.autoPlay && this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
        },
        prev: function () {
            var index = this.currentIndex == 0 ? this.size - 1 : this.currentIndex - 1;
            this.show(index);
        },
        next: function () {
            var index = this.currentIndex == this.size - 1 ? 0 : this.currentIndex + 1;
            this.show(index);
        },
        show: function (index, time) {
            this._pause();
            this.iscroll.scrollToPage(index, 0, time);
        },
        play: function () {
            this.autoPlay=true;
            this._play();
        },
        refresh: function () {
            var that = this;
            that.show(this.currentIndex);
        },
        _play: function () {
            if (this.autoPlay && !this.timeoutId) {
                var that = this;
                this.timeoutId = setTimeout(function () {
                    this.timeoutId = null;
                    that.next();
                }, that.options.duration);
            }
        },
        _end: function () {
            var currentIndex = this.iscroll.currPageX;
            if (currentIndex != this.currentIndex) {
                if (this.callBack) {
                    this.callBack(currentIndex, this.currentIndex);
                }
                this.currentIndex = currentIndex;

                if (this.hasIndicator) {
                    this.indicatorIndexs.eq(currentIndex).addClass("ipu-current").siblings().removeClass("ipu-current");
                }
                this.carouselItems.eq(currentIndex).addClass("ipu-current").siblings().removeClass("ipu-current");
            }
            this._play();
        },
        _addIndicator: function () {
            var html = "";
            for (var i = 0; i < this.size; i++) {
                html += "<li></li>";
            }
            html = "<ul class='ipu-carousel-indicator'>" + html + "</ul>";
            this.indicator = $(html).appendTo(this.el);
            this.indicatorIndexs = $("li", this.indicator);
        },
        destroy: function () {
            // 自己怎么销毁，相关事件移除？？
            this.iscroll.destroy();
        }
    };

    ipu.carousel =  function (slt, options) {
        return new Carousel(slt, options);
    };

})(ipu || window, jQuery, iScroll);

// dtPicker  此版本最大值与最小值，存在问题，当时间跨过一天时
(function (ipu, $) {
    var Picker = ipu.Picker;
    var defaultPickerDate = new Date();   // 有些时间不齐全。如time，需要一个默认日期来运算


    // show方法调用时，若没有值，则为当前值，还是有值就不变动了，点了确认按钮后，就不再变动了
    // 日期范围的选择处理
    function DtPicker(options) {
        this.options = $.extend({}, this.defaultOptions, options);

        if(!Picker){
            Picker = ipu.Picker;
        }
        this._init();
    }

    DtPicker.prototype.defaultOptions = {
        template: '<div class="ipu-poppicker ipu-dtpicker">\
                        <div class="ipu-poppicker-header">\
                            <button class="ipu-btn ipu-btn-s ipu-poppicker-btn-cancel">取消</button>\
                            <button class="ipu-btn ipu-btn-s ipu-poppicker-btn-ok">确定</button>\
                            <button class="ipu-btn ipu-btn-s ipu-poppicker-btn-clear">清除</button>\
                        </div>\
                        <div class="ipu-poppicker-title">\
                            <label class="ipu-dtpicker-y"></label>\
                            <label class="ipu-dtpicker-m"></label>\
                            <label class="ipu-dtpicker-d"></label>\
                            <label class="ipu-dtpicker-h"></label>\
                            <label class="ipu-dtpicker-mi"></label>\
                        </div>\
                        <div>\
                        <div class="ipu-poppicker-body">\
                            <div class="ipu-picker" data-id="picker-y">\
                                <div class="ipu-picker-selectbox"></div>\
                                <ul></ul>\
                            </div>\
                             <div class="ipu-picker" data-id="picker-m">\
                                <div class="ipu-picker-selectbox"></div>\
                                <ul></ul>\
                            </div>\
                             <div class="ipu-picker" data-id="picker-d">\
                                <div class="ipu-picker-selectbox"></div>\
                                <ul></ul>\
                            </div>\
                             <div class="ipu-picker" data-id="picker-h">\
                                <div class="ipu-picker-selectbox"></div>\
                                <ul></ul>\
                            </div>\
                             <div class="ipu-picker" data-id="picker-mi">\
                                <div class="ipu-picker-selectbox"></div>\
                                <ul></ul>\
                            </div>\
                        </div>\
                    </div>',
        buttons: ['取消', '确认', '清除'],
        labels: ['年', '月', '日', '时', '分'],
        type: 'datetime',       // date, time, datetime, hour, month
        customData: {},  // 自定义数据
        hasClear: false,    // 是否显示清除按钮
        callBack: function () { // 选择数据时的回调函数
        }
        // beginDate: Date类型，或毫秒值
        // endDate: 同上
    };

    DtPicker.prototype._init = function () {
        var self = this;
        this.mask = this.createMask();

        var _picker = this.holder = $(this.options.template).appendTo("body");
        var ui = self.ui = {
            picker: this.holder,
            ok: $('.ipu-poppicker-btn-ok', _picker),
            cancel: $('.ipu-poppicker-btn-cancel', _picker),
            clear: $('.ipu-poppicker-btn-clear', _picker),
            buttons: $('.ipu-poppicker-header .ipu-btn', _picker),
            labels: $('.ipu-poppicker-title label', _picker)
        };


        ui.i = new Picker($('[data-id="picker-mi"]', _picker), {listen: false}); // 分钟变更无需要处理

        ui.h = new Picker($('[data-id="picker-h"]', _picker), {         // 小时变更，有最小值或最大值，需要变更分钟
            listen: false,
            onChange: function (item, index) {
                if (index !== null && (self.options.beginMonth || self.options.endMonth)) {
                    self._createMinutes();
                }
            }
        });

        ui.d = new Picker($('[data-id="picker-d"]', _picker), { //仅提供了beginDate时，触发day,hours,minutes的change
            listen: false,
            onChange: function (item, index) {
                if (index !== null && (self.options.beginMonth || self.options.endMonth)) {
                    self._createHours();
                }
            }
        });

        ui.m = new Picker($('[data-id="picker-m"]', _picker), { // 月变更时，总要变更day
            listen: false,
            onChange: function (item, index) {
                if (index !== null) {
                    self._createDay();
                }
            }
        });

        ui.y = new Picker($('[data-id="picker-y"]', _picker), { // 年发生变更，如果没有结束月，此时有所有的月，是不需要变更月的，只需要变更day
            listen: false,
            onChange: function (item, index) {
                if (index != null) {
                    if (self.options.beginMonth || self.options.endMonth) {
                        self._createMonth();
                    } else {
                        self._createDay();
                    }
                }
            }
        });




        self._create();

        var ui = self.ui;
        //设定label
        self._setLabels();
        self._setButtons();
        //设定类型
        ui.picker.attr('data-type', this.options.type);

        //设定默认值

        self._setSelectedValue(this.options.value);

        //防止滚动穿透 TODO:待确认情况
        /* self.ui.picker.addEventListener($.EVENT_START, function (event) {
         event.preventDefault();
         }, false);
         self.ui.picker.addEventListener($.EVENT_MOVE, function (event) {
         event.preventDefault();
         }, false);*/
    };

    DtPicker.prototype.getSelected = function () {
        var self = this;
        var ui = self.ui;
        var type = self.options.type;
        var selected = {
            type: type,
            y: ui.y.getSelectedItem(),
            m: ui.m.getSelectedItem(),
            d: ui.d.getSelectedItem(),
            h: ui.h.getSelectedItem(),
            i: ui.i.getSelectedItem(),
            toString: function () {
                return this.value;
            }
        };
        switch (type) {
            case 'datetime':
                selected.value = selected.y.value + '-' + selected.m.value + '-' + selected.d.value + ' ' + selected.h.value + ':' + selected.i.value;
                selected.text = selected.y.text + '-' + selected.m.text + '-' + selected.d.text + ' ' + selected.h.text + ':' + selected.i.text;
                break;
            case 'date':
                selected.value = selected.y.value + '-' + selected.m.value + '-' + selected.d.value;
                selected.text = selected.y.text + '-' + selected.m.text + '-' + selected.d.text;
                break;
            case 'time':
                selected.value = selected.h.value + ':' + selected.i.value;
                selected.text = selected.h.text + ':' + selected.i.text;
                break;
            case 'month':
                selected.value = selected.y.value + '-' + selected.m.value;
                selected.text = selected.y.text + '-' + selected.m.text;
                break;
            case 'hour':
                selected.value = selected.y.value + '-' + selected.m.value + '-' + selected.d.value + ' ' + selected.h.value;
                selected.text = selected.y.text + '-' + selected.m.text + '-' + selected.d.text + ' ' + selected.h.text;
                break;
        }
        return selected;
    };

    DtPicker.prototype._setSelectedValue = function (value) {
        var self = this;
        var ui = self.ui;

        if(!value){
            if(this.options.type == 'time'){
                value = '00:00';
            }else{
                value = defaultPickerDate.getFullYear()+'-'+(defaultPickerDate.getMonth()+1)+'-'+defaultPickerDate.getDate()+' '
                    + defaultPickerDate.getHours() + ':' + defaultPickerDate.getMinutes();
            }
        }
        var parsedValue = self._parseSetValue(value);

        ui.y.setListen(true);
        ui.m.setListen(false);
        ui.d.setListen(false);
        ui.h.setListen(false);
        ui.i.setListen(false);
        ui.y.setSelectedValue(parsedValue.y);

        ui.m.setListen(true);
        ui.m.setSelectedValue(parsedValue.m);

        ui.d.setListen(true);
        ui.d.setSelectedValue(parsedValue.d);

        ui.h.setListen(true);
        ui.h.setSelectedValue(parsedValue.h);

        ui.i.setListen(true);
        ui.i.setSelectedValue(parsedValue.i);

        this.value = this.getSelected().value;
    };

    DtPicker.prototype.setSelectedValue = function (value) {
        this._setSelectedValue(value);
    };

    DtPicker.prototype.isLeapYear = function (year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    };

    DtPicker.prototype._inArray = function (array, item) {
        for (var index in array) {
            var _item = array[index];
            if (_item === item) return true;
        }
        return false;
    };

    DtPicker.prototype.getDayNum = function (year, month) {
        var self = this;
        if (self._inArray([1, 3, 5, 7, 8, 10, 12], month)) {
            return 31;
        } else if (self._inArray([4, 6, 9, 11], month)) {
            return 30;
        } else if (self.isLeapYear(year)) {
            return 29;
        } else {
            return 28;
        }
    };

    DtPicker.prototype._fill = function (num) {
        num = num.toString();
        if (num.length < 2) {
            num = 0 + num;
        }
        return num;
    };

    DtPicker.prototype._isBeginYear = function () {
        return this.options.beginYear === parseInt(this.ui.y.getSelectedValue());
    };

    DtPicker.prototype._isBeginMonth = function () {
        return this.options.beginMonth && this._isBeginYear() && this.options.beginMonth === parseInt(this.ui.m.getSelectedValue());
    };

    DtPicker.prototype._isBeginDay = function () {
        return this._isBeginMonth() && this.options.beginDay === parseInt(this.ui.d.getSelectedValue());
    };

    DtPicker.prototype._isBeginHours = function () {
        return this._isBeginDay() && this.options.beginHours === parseInt(this.ui.h.getSelectedValue());
    };

    DtPicker.prototype._isEndYear = function () {
        return this.options.endYear === parseInt(this.ui.y.getSelectedValue());
    };

    DtPicker.prototype._isEndMonth = function () {
        return this.options.endMonth && this._isEndYear() && this.options.endMonth === parseInt(this.ui.m.getSelectedValue());
    };

    DtPicker.prototype._isEndDay = function () {
        return this._isEndMonth() && this.options.endDay === parseInt(this.ui.d.getSelectedValue());
    };

    DtPicker.prototype._isEndHours = function () {
        return this._isEndDay() && this.options.endHours === parseInt(this.ui.h.getSelectedValue());
    };

    DtPicker.prototype._createYear = function (current) {
        var self = this;
        var options = self.options;
        var ui = self.ui;
        //生成年列表
        var yArray = [];
        if (options.customData.y) {
            yArray = options.customData.y;
        } else {
            var yBegin = options.beginYear;
            var yEnd = options.endYear;
            for (var y = yBegin; y <= yEnd; y++) {
                yArray.push({
                    text: y + '',
                    value: y
                });
            }
        }
        ui.y.setItems(yArray);
        //ui.y.setSelectedValue(current);
    };

    DtPicker.prototype._createMonth = function (current) {
        var self = this;
        var options = self.options;
        var ui = self.ui;

        //生成月列表
        var mArray = [];
        if (options.customData.m) {
            mArray = options.customData.m;
        } else {
            var m = options.beginMonth && self._isBeginYear() ? options.beginMonth : 1;
            var maxMonth = options.endMonth && self._isEndYear() ? options.endMonth : 12;
            for (; m <= maxMonth; m++) {
                var val = self._fill(m);
                mArray.push({
                    text: val,
                    value: m
                });
            }
        }
        ui.m.setItems(mArray);
        //ui.m.setSelectedValue(current);
    };

    DtPicker.prototype._createDay = function (current) {
        var self = this;
        var options = self.options;
        var ui = self.ui;

        //生成日列表
        var dArray = [];
        if (options.customData.d) {
            dArray = options.customData.d;
        } else {
            var d = self._isBeginMonth() ? options.beginDay : 1;
            var maxDay = self._isEndMonth() ? options.endDay : self.getDayNum(parseInt(this.ui.y.getSelectedValue()), parseInt(this.ui.m.getSelectedValue()));
            for (; d <= maxDay; d++) {
                var val = self._fill(d);
                dArray.push({
                    text: val,
                    value: d
                });
            }
        }
        ui.d.setItems(dArray);
        //current = current || ui.d.getSelectedValue();
        //ui.d.setSelectedValue(current);
    };

    DtPicker.prototype._createHours = function (current) {
        var self = this;
        var options = self.options;
        var ui = self.ui;
        //生成时列表
        var hArray = [];
        if (options.customData.h) {
            hArray = options.customData.h;
        } else {
            var h = self._isBeginDay() ? options.beginHours : 0;
            var maxHours = self._isEndDay() ? options.endHours : 23;
            for (; h <= maxHours; h++) {
                var val = self._fill(h);
                hArray.push({
                    text: val,
                    value: h
                });
            }
        }
        ui.h.setItems(hArray);
        //ui.h.setSelectedValue(current);
    };

    DtPicker.prototype._createMinutes = function (current) {
        var self = this;
        var options = self.options;
        var ui = self.ui;

        //生成分列表
        var iArray = [];
        if (options.customData.i) {
            iArray = options.customData.i;
        } else {
            var i = self._isBeginHours() ? options.beginMinutes : 0;
            var maxMinutes = self._isEndHours() ? options.endMinutes : 59;
            for (; i <= maxMinutes; i++) {
                var val = self._fill(i);
                iArray.push({
                    text: val,
                    value: i
                });
            }
        }
        ui.i.setItems(iArray);
        //ui.i.setSelectedValue(current);
    };

    DtPicker.prototype._setLabels = function () {
        var self = this;
        var options = self.options;
        var ui = self.ui;
        ui.labels.each(function (i, label) {
            label.innerText = options.labels[i];
        });
    };

    DtPicker.prototype._setButtons = function () {
        var self = this;
        var options = self.options;
        var ui = self.ui;
        ui.cancel.text(options.buttons[0]);
        ui.ok.text(options.buttons[1]);

        if(options.hasClear){
            ui.clear.text(options.buttons[2])
        }else{
            ui.clear.hide();
        }

        ui.buttons.each(function (index) {
            $(this).click(function () {
                self.clickCall(index);
            })
        })
    };

    // 解析设置的值，目前是字符串，完整日期格式 2012-12-12 12:21
    DtPicker.prototype._parseSetValue = function (value) {
        var now = defaultPickerDate;
        var type = this.options.type;

        var rs = {
            y: now.getFullYear(),
            m: now.getMonth()+1,
            d: now.getDate(),
            h: now.getHours(),
            i: now.getMinutes()
        };

        if(value instanceof Date){
            if( type == 'time'){
                valu= +value.getHours()+":"+value.getMinutes();
            }else{
                value = value.getFullYear()+'-'+(value.getMonth()+1)+'-'+value.getDate()+ ' '
                    +value.getHours()+":"+value.getMinutes();
            }
        }

        var parts = value.replace(":", "-").replace(" ", "-").split("-");
        for(var i=0, j=parts.length; i<j; i++){
            parts[i] = parseInt(parts[i]);
        }

        if(type == 'datetime'){
            rs.y = parts[0];
            rs.m = parts[1];
            rs.d = parts[2];    //
            rs.h = parts[3];    //
            rs.i = parts[4];
        }else if(type == 'date'){
            rs.y = parts[0];
            rs.m = parts[1];
            rs.d = parts[2];    //
            rs.h = 0;    //
            rs.i = 0;
        }else if(type == 'time'){
            rs.h = parts[0];    //
            rs.i = parts[1];
        }else if(type == 'hour'){
            rs.y = parts[0];
            rs.m = parts[1];
            rs.d = parts[2];    //
            rs.h = parts[3];    //
            rs.i = 0;
        }else if(type == 'month'){
            rs.y = parts[0];
            rs.m = parts[1];
            rs.d = 1;    //
            rs.h = 0;    //
            rs.i = 0;
        }

        return rs;
    };

    DtPicker.prototype._create = function () {
        var self = this;
        var options = this.options;
        var now = defaultPickerDate;

        var beginDate = options.beginDate;
        if(beginDate){
            beginDate = this._parseSetValue(beginDate);
            options.beginYear = beginDate.y;
            options.beginMonth = beginDate.m;
            options.beginDay = beginDate.d;
            options.beginHours = beginDate.h;
            options.beginMinutes = beginDate.i;
        }else if(options.type == 'time'){
            options.beginYear =  now.getFullYear();
            options.beginMonth = now.getMonth() + 1;
            options.beginDay = now.getDate();
            options.beginHours = 0;
            options.beginMinutes = 0;
        }else {
            options.beginYear =  now.getFullYear() - 5;
        }

        var endDate = options.endDate;
        if (endDate) { //设定了结束日期
            endDate = this._parseSetValue(endDate);
            options.endYear = endDate.y;
            options.endMonth = endDate.m;
            options.endDay = endDate.d;
            options.endHours = endDate.h;
            options.endMinutes = endDate.i;
        }else if(options.type == 'time'){
            options.endYear =  now.getFullYear();
            options.endMonth = now.getMonth() + 1;
            options.endDay = now.getDate();
            options.endHours = 24;
            options.endMinutes = 59;
        }else {
            options.endYear =  options.beginYear + 10 ;
        }

        //生成
        self._createYear();
        self._createMonth();
        self._createDay();
        self._createHours();
        self._createMinutes();
    };

    // 更新选择框，更新当前值
    DtPicker.prototype.setBeginDate = function (date) {
        this.options.beginDate = date;
        this._create();
    };

    // 判断最大最小值合理性
    DtPicker.prototype.setEndDate = function (date) {
        this.options.endDate = date;
        this._create();
    };

    DtPicker.prototype.dispose = function () {
        var self = this;
        self.hide();
        setTimeout(function () {
            self.ui.picker.parentNode.removeChild(self.ui.picker);
            for (var name in self) {
                self[name] = null;
                delete self[name];
            }
            self.disposed = true;
        }, 300);
    };

    DtPicker.prototype.show = function (callBack) {
        if (callBack) {
            this.options.callBack = callBack;
        }
        this.mask.show();
        this.setSelectedValue(this.value);
        this.holder.addClass("ipu-current");
    };

    DtPicker.prototype.clickCall = function(index){
        var self = this;
        var sltDate = self.getSelected();
        var rs = self.options.callBack.call(this , sltDate, index);
        if (rs !== false) {
            if(index == 1){ // 假定确认按钮在第二个位置，传回true则存储当前值
                self.value = sltDate.value;
            }else if(index == 2){
                self.value = null;
            }
            self.hide();
        }
    };

    DtPicker.prototype.hide = function () {
        this.mask.close();
        this.holder.removeClass("ipu-current");
    };

    // 应该移除callback参数，提取出业成一个工具方法
    DtPicker.prototype.createMask = function(callback) {
        var self = this;
        var element = document.createElement('div');
        element.classList.add("ipu-picker-backup");
        //element.addEventListener($.EVENT_MOVE, $.preventDefault);
        element.addEventListener('click', function() {
            self.clickCall(0);
        });
        var mask = [element];
        mask._show = false;
        mask.show = function() {
            mask._show = true;
            element.setAttribute('style', 'opacity:1');
            document.body.appendChild(element);
            return mask;
        };
        mask._remove = function() {
            if (mask._show) {
                mask._show = false;
                element.setAttribute('style', 'opacity:0');
                setTimeout(function() {
                    var body = document.body;
                    element.parentNode === body && body.removeChild(element);
                }, 350);
            }
            return mask;
        };
        mask.close = function() {
            if(mask._show){
                if (callback) {
                    if (callback() !== false) {
                        mask._remove();
                    }
                } else {
                    mask._remove();
                }
            }
        };
        return mask;
    };

    ipu.dtPicker = function(options){
        return new DtPicker(options);
    };
})(ipu || window, jQuery);

// 支持非循环
// size命名用的有点混淆。。
// 不能支持元素隐藏时，使用百比分处理移动距离。。。？
// 支持两个以内容显示
// 支持类似snap实现
// 理想是移除carousel.js的实现，用hammerCarousel.js实现所有相关功能

(function (ipu, $, Hammer) {
    function HammerCarousel(navSlt, options) {
        this.options = options = $.extend({}, this.defaultOptions, options);
        this.el = $(navSlt).get(0);
        this._init();
    }

    // 直接替换掉了prototype对象，可能不是个好选择
    HammerCarousel.prototype = {
        defaultOptions: {
            index: null,        // 默认显示第几个项，其实挺没用的，默认显示第一个，用户再调用一下显示第几个，作用一样现在。
            autoPlay: false,    // 是否自动轮播
            duration: 3000,     // 轮播间隔
            indicator: false,  //是否生成指示器，即小点点
            callBack: null,  // 轮播后回调函数
            clickBack: null   // 各子项用户点击事件
            //indicatorPosition: 'center',  // left|right|center;暂不支持，不知道怎么支持在中间显示，用全宽度，配合point-event:none,可能ok，参考humUI和mui
        },
        _init: function () {
            this.wrapper = $(">.ipu-carousel-wrapper", this.el);
            this.carouselItems = $(">li", this.wrapper);


            this.showSize = 1; // 假设一屏默认显示1个，所以做循环显示只需要复制一个子项
            this.carouselItemSizes = [];
            this.currentIndex = 0;
            this.moveLen = 0;
            this.lastItem = false; // index是0的时候，有可能显示的是第一项，也有可能显示的是复制项，这个参数用来判断是复制项

            // 这里假设每个元素都是相等的
            this.carouselItems.slice(0, this.showSize).clone().appendTo(this.wrapper); // 如果做无限循环则要这样处理
            this.size = this.carouselItems.size();

            var self = this;
            if(this.options.clickBack){
                $(">li", this.wrapper).each(function (i) {
                    $(this).click(function () {
                        self.options.clickBack.call(this, i%self.size);
                    });
                })
            }

            this.sizeCount();
            var that = this;

            this.hammer = new Hammer.Manager(this.el); // 避免因为li里面的内容高度不够，而不能触发相关事件
            this.hammer.add(new Hammer.Pan({direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10}));
            this.hammer.on("panstart panmove panend pancancel", Hammer.bindFn(this.onPan, this));

            $(window).resize(function () { // 在尺寸变化时，处理，是否可以考虑只在宽度变化时处理，横屏事件？
                that.refresh();
            });

            if (this.options.index == null) {
                var activeIndex = this.carouselItems.filter(".ipu-current").index();
                this.options.index = activeIndex != -1 ? activeIndex : 0;
            }

            if (this.options.indicator) {
                this._addIndicator();
            }

            this.show(this.options.index);
        },
        stop: function () {
            this._pause();
            this.options.autoPlay = false;
        },
        _pause: function () {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
        },
        prev: function () {
            var index = this.currentIndex == 0 ? this.size - 1 : this.currentIndex - 1;
            if (index == this.size - 1) {
                this._show(this.size, false);
                this.wrapper.width();
            }
            this._show(index, true);
        },
        next: function () {//下一张
            var index = this.currentIndex == this.size ? 1 : this.currentIndex + 1;
            if (index == 1) {
                this._show(0, false);
                this.wrapper.width();
            }
            this._show(index, true);
        },
        show: function (index) {//跳到指定索引处
            var index = index % size;
            if(index < 0 ){
                index = size + index;
            }
            this._show(index); // 默认追加动画
        },
        play: function () {
            this.options.autoPlay = true;
            this._play();
        },
        _play: function () {
            if (this.options.autoPlay && !this.timeoutId) {
                var that = this;
                this.timeoutId = setTimeout(function () {
                    that.timeoutId = null;//清空这个timeoutId，代表该次处理已经执行了
                    that.next();
                }, that.options.duration);
            }
        },
        _end: function () {//移动结束时调用
            var currentIndex = this.currentIndex;

            if (this.options.callBack) {
                this.options.callBack(currentIndex, this.lastItem);//返回当前索引,以及是滞最后一项参数
            }

            if (this.indicator) {
                this.indicatorIndexs.eq(currentIndex).addClass("ipu-current").siblings().removeClass("ipu-current");
            }
            this.carouselItems.eq(currentIndex).addClass("ipu-current").siblings().removeClass("ipu-current");

            this._play();//处理自动播放
        },
        _addIndicator: function () {
            var html = "";
            for (var i = 0; i < this.size; i++) {
                html += "<li></li>";
            }
            html = "<ul class='ipu-carousel-indicator'>" + html + "</ul>";
            this.indicator = $(html).appendTo(this.el);
            this.indicatorIndexs = $("li", this.indicator);
        },
        sizeCount: function () {
            this.wrapperSize = this.wrapper.outerWidth(true);
            this.itemSize = this.carouselItems.eq(0).outerWidth(true);
            this.mostSize = this.size * this.itemSize; // 宽度*数量
            $(this.wrapper).removeClass("ipu-carousel-animate").width();

            var that = this;
            $(">li", this.wrapper).each(function (index, dom) { // 此处要注意，最后一个子项是后加进入的，要重新使用jquery处理一下，不能直接使用this.xx来处理
                that.carouselItemSizes[index] = $(this).position().left;
            });
        },
        refresh: function () {
            if (this.wrapperSize != this.wrapper.outerWidth(true)) {
                this.sizeCount();
                this._show(this.currentIndex, true); //新的位置
            }
        },
        move: function (moveLen) { // 类似mouseMove时的处理函数
            this._pause();
            $(this.wrapper).removeClass("ipu-carousel-animate");
            var move = (this.moveLen - moveLen) % this.mostSize;
            move = (move + this.mostSize) % this.mostSize;
            this.displayMoveLen = move;

            move = -move + "px";
            $(this.wrapper).css("transform", "translate3d(" + move + ", 0, 0)");
        },
        _show: function (index, animate) { // 知道最终移动到的项时，调用
            if (animate !== false) { // 默认值为true
                animate = true;
            }

            this._pause();
            $(this.wrapper).toggleClass("ipu-carousel-animate", animate);
            this.currentIndex = index % this.size;
            //this.currentIndex = index;
            this.lastItem = index == this.size;
            var move = this.carouselItemSizes[index];
            this.moveLen = move;
            move = -move + "px";

            $(this.wrapper).css("transform", "translate3d(" + move + ", 0, 0)");
            if (animate) {
                this._end();
            }
        },
        onPan: function (ev) {
            var delta = ev.deltaX;
            // pancancel与panend，有效的pan事件结束与无效的pan事件结束？
            if (ev.type == 'panend' || ev.type == 'pancancel') {
                var value = delta / this.itemSize;
                var intValue = parseInt(Math.abs(value));               // 取整数
                var decimal = Math.abs(value) % 1;                   // 取小数

                if (decimal > 0.2) { // 滑动超过页面宽20%；
                    intValue = intValue + 1;
                }
                if (value > 0) {
                    intValue = -intValue;
                }

                var index = (this.currentIndex + intValue) % this.size;
                index = (index + this.size) % this.size; // 因为可能是个负值，转换成正值

                // 当前位移大于一个项的长度，这由move方法导致的，所以此时只能是最后一项在显示，所以要显示最后一项
                if (index == 0 && this.displayMoveLen > this.itemSize) {
                    index = this.size;
                }
                this._show(index);
            } else if (ev.type == 'panmove'){
                this.move(delta);
            }
        }
    };

    ipu.hammerCarousel = function (slt, options) {
        return new HammerCarousel(slt, options);
    };
})(ipu || window, jQuery,  Hammer);

(function (ipu, $) {
    //$ extends
    function __dealCssEvent(eventNameArr, callback) {
        // console.log('__dealCssEvent');
        var events = eventNameArr,
            i, dom = this;// jshint ignore:line

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }

        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
    }

    $.fn.transitionEnd = function (callback) {
        // console.log('transitionEnd');
        __dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
        return this;
    };



    var _modalTemplateTempDiv = document.createElement('div');

    var defaults = {
        modalStack: true,
        modalButtonOk: '确定',
        modalButtonCancel: '取消',
        modalPreloaderTitle: '加载中',
        modalContainer: document.body ? document.body : 'body'
    };

    ipu.modalStack = [];

    ipu.modalStackClearQueue = function () {
        if (ipu.modalStack.length) {
            (ipu.modalStack.shift())();
        }
    };
    ipu.modal = function (params) {
        params = params || {};
        var modalHTML = '';
        var buttonsHTML = '';
        if (params.buttons && params.buttons.length > 0) {
            for (var i = 0; i < params.buttons.length; i++) {
                buttonsHTML += '<span class="ipu-modal-button' + (params.buttons[i].bold ? ' ipu-modal-button-bold' : '') + '">' + params.buttons[i].text + '</span>';
            }
        }
        var extraClass = params.extraClass || '';
        var titleHTML = params.title ? '<div class="ipu-modal-title">' + params.title + '</div>' : '';
        var textHTML = params.text ? '<div class="ipu-modal-text">' + params.text + '</div>' : '';
        var afterTextHTML = params.afterText ? params.afterText : '';
        var noButtons = !params.buttons || params.buttons.length === 0 ? 'ipu-modal-no-buttons' : '';
        var verticalButtons = params.verticalButtons ? 'ipu-modal-buttons-vertical' : '';
        modalHTML = '<div class="ipu-modal ' + extraClass + ' ' + noButtons + '"><div class="ipu-modal-inner">' + (titleHTML + textHTML + afterTextHTML) + '</div><div class="ipu-modal-buttons ' + verticalButtons + '">' + buttonsHTML + '</div></div>';

        _modalTemplateTempDiv.innerHTML = modalHTML;

        var modal = $(_modalTemplateTempDiv).children();

        $(defaults.modalContainer).append(modal[0]);

        // Add events on buttons
        modal.find('.ipu-modal-button').each(function (index, el) {
            $(el).on('click', function (e) {
                if (params.buttons[index].close !== false) ipu.closeModal(modal);
                if (params.buttons[index].onClick) params.buttons[index].onClick(modal, e);
                if (params.onClick) params.onClick(modal, index);
            });
        });
        ipu.openModal(modal);
        return modal[0];
    };
    ipu.alert = function (text, title, callbackOk) {
        if (typeof title === 'function') {
            callbackOk = arguments[1];
            title = undefined;
        }
        return ipu.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            buttons: [{text: defaults.modalButtonOk, bold: true, onClick: callbackOk}]
        });
    };
    ipu.confirm = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return ipu.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            buttons: [
                {text: defaults.modalButtonCancel, omodalButtonCancelnClick: callbackCancel},
                {text: defaults.modalButtonOk, bold: true, onClick: callbackOk}
            ]
        });
    };
    ipu.prompt = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return ipu.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            afterText: '<input type="text" class="ipu-modal-text-input">',
            buttons: [
                {
                    text: defaults.modalButtonCancel
                },
                {
                    text: defaults.modalButtonOk,
                    bold: true
                }
            ],
            onClick: function (modal, index) {
                if (index === 0 && callbackCancel) callbackCancel($(modal).find('.ipu-modal-text-input').val());
                if (index === 1 && callbackOk) callbackOk($(modal).find('.ipu-modal-text-input').val());
            }
        });
    };

    var minLoad = false;        // 是否最小时间调用方式
    var loadOverTime = false;   // 是否超过最小调用时间
    var loadEnd = false;        // 是否调用结束
    var loadTimeOut = null;     // 延时调用ID

    ipu.showPreloader = function (title, minTime) {
        ipu.hidePreloader(true);

        ipu.showPreloader.preloaderModal = ipu.modal({
            title: title || defaults.modalPreloaderTitle,
            text: '<div class="ipu-preloader"></div>'
        });

        if(minTime){
            minLoad = true;
            loadTimeOut = setTimeout(function () {
                loadOverTime = true;
                if(loadEnd){
                    ipu.hidePreloader();
                }
            }, minTime);
        }

        return ipu.showPreloader.preloaderModal;
    };
    ipu.hidePreloader = function (force) {
        if(force || !minLoad || (minLoad && loadOverTime)){
            if(force && loadTimeOut){
                window.clearTimeout(loadTimeOut);
            }
            ipu.showPreloader.preloaderModal && ipu.closeModal(ipu.showPreloader.preloaderModal);
            minLoad = false; // 重置各标志位
            loadOverTime = false;
            loadEnd = false;
            loadTimeOut = null;
        }else{
            loadEnd = true;
        }
    };
    ipu.showIndicator = function () {
        if ($('.ipu-preloader-indicator-modal')[0]) return;
        $(defaults.modalContainer).append('<div class="ipu-preloader-indicator-overlay"></div><div class="ipu-preloader-indicator-modal"><span class="ipu-preloader ipu-preloader-white"></span></div>');
    };
    ipu.hideIndicator = function () {
        $('.ipu-preloader-indicator-overlay, .ipu-preloader-indicator-modal').remove();
    };
    // Action Sheet
    ipu.actions = function (params) {
        var modal, groupSelector, buttonSelector;
        params = params || [];

        if (params.length > 0 && !$.isArray(params[0])) {
            params = [params];
        }
        var modalHTML;
        var buttonsHTML = '';
        for (var i = 0; i < params.length; i++) {
            for (var j = 0; j < params[i].length; j++) {
                if (j === 0) buttonsHTML += '<div class="ipu-actions-modal-group">';
                var button = params[i][j];
                var buttonClass = button.label ? 'ipu-actions-modal-label' : 'ipu-actions-modal-button';
                if (button.bold) buttonClass += ' ipu-actions-modal-button-bold';
                if (button.color) buttonClass += ' ipu-color-' + button.color;
                if (button.bg) buttonClass += ' ipu-bg-' + button.bg;
                if (button.disabled) buttonClass += ' disabled';
                buttonsHTML += '<span class="' + buttonClass + '">' + button.text + '</span>';
                if (j === params[i].length - 1) buttonsHTML += '</div>';
            }
        }
        modalHTML = '<div class="ipu-actions-modal">' + buttonsHTML + '</div>';
        _modalTemplateTempDiv.innerHTML = modalHTML;
        modal = $(_modalTemplateTempDiv).children();
        $(defaults.modalContainer).append(modal[0]);
        groupSelector = '.ipu-actions-modal-group';
        buttonSelector = '.ipu-actions-modal-button';

        var groups = modal.find(groupSelector);
        groups.each(function (index, el) {
            var groupIndex = index;
            $(el).children().each(function (index, el) {
                var buttonIndex = index;
                var buttonParams = params[groupIndex][buttonIndex];
                var clickTarget;
                if ($(el).is(buttonSelector)) clickTarget = $(el);
                // if (toPopover && $(el).find(buttonSelector).length > 0) clickTarget = $(el).find(buttonSelector);

                if (clickTarget) {
                    clickTarget.on('click', function (e) {
                        if (buttonParams.close !== false) ipu.closeModal(modal);
                        if (buttonParams.onClick) buttonParams.onClick(modal, e);
                    });
                }
            });
        });
        ipu.openModal(modal);
        return modal[0];
    };

    //显示一个消息，会在2秒钟后自动消失
    ipu.toast = function (msg, duration, extraclass) {
        var $toast = $('<div class="ipu-modal ipu-toast ' + (extraclass || '') + '">' + msg + '</div>').appendTo(document.body);
        ipu.openModal($toast, function () {
            setTimeout(function () {
                ipu.closeModal($toast);
            }, duration || 2000);
        });
    };
    ipu.openModal = function (modal, cb) {
        modal = $(modal);
        var isModal = modal.hasClass('ipu-modal'),
            isNotToast = !modal.hasClass('ipu-toast');
            isNotToast = false; // 强制打开新窗口
        if ($('.ipu-modal.ipu-modal-in:not(.ipu-modal-out)').length && defaults.modalStack && isModal && isNotToast) {
            ipu.modalStack.push(function () {
                ipu.openModal(modal, cb);
            });
            return;
        }
        var isPopup = modal.hasClass('ipu-popup');
        var isLoginScreen = modal.hasClass('ipu-login-screen');
        var isPickerModal = modal.hasClass('ipu-picker-modal');
        var isToast = modal.hasClass('ipu-toast');
        if (isModal) {
            modal.show();
            modal.css({
                marginTop: -Math.round(modal.outerHeight() / 2) + 'px'
            });
        }
        if (isToast) {
            modal.css({
                marginLeft: -Math.round(modal.outerWidth() / 2 ) + 'px' //1.185 是初始化时候的放大效果
            });
        }

        var overlay;
        if (!isLoginScreen && !isPickerModal && !isToast) {
            if ($('.ipu-modal-overlay').length === 0 && !isPopup) {
                $(defaults.modalContainer).append('<div class="ipu-modal-overlay"></div>');
            }
            if ($('.ipu-popup-overlay').length === 0 && isPopup) {
                $(defaults.modalContainer).append('<div class="ipu-popup-overlay"></div>');
            }
            overlay = isPopup ? $('.ipu-popup-overlay') : $('.ipu-modal-overlay');
        }

        //Make sure that styles are applied, trigger relayout;
        var clientLeft = modal[0].clientLeft;

        // Trugger open event
        modal.trigger('open');

        // Picker modal body class
        if (isPickerModal) {
            $(defaults.modalContainer).addClass('ipu-with-picker-modal');
        }

        // Classes for transition in
        if (!isLoginScreen && !isPickerModal && !isToast) overlay.addClass('ipu-modal-overlay-visible');
        modal.removeClass('ipu-modal-out').addClass('ipu-modal-in').transitionEnd(function (e) {
            if (modal.hasClass('ipu-modal-out')) modal.trigger('closed');
            else modal.trigger('opened');
        });
        // excute callback
        if (typeof cb === 'function') {
            cb.call(this);
        }
        return true;
    };
    ipu.closeModal = function (modal) {
        modal = $(modal || '.ipu-modal-in');
        if (typeof modal !== 'undefined' && modal.length === 0) {
            return;
        }
        var isModal = modal.hasClass('ipu-modal'),
            isPopup = modal.hasClass('ipu-popup'),
            isToast = modal.hasClass('ipu-toast'),
            isLoginScreen = modal.hasClass('ipu-login-screen'),
            isPickerModal = modal.hasClass('ipu-picker-modal'),
            removeOnClose = modal.hasClass('ipu-remove-on-close'),
            overlay = isPopup ? $('.ipu-popup-overlay') : $('.ipu-modal-overlay');
        if (isPopup) {
            if (modal.length === $('.ipu-popup.ipu-modal-in').length) {
                overlay.removeClass('ipu-modal-overlay-visible');
            }
        }
        else if (!(isPickerModal || isToast)) {
            overlay.removeClass('ipu-modal-overlay-visible');
        }
        modal.trigger('close');

        // Picker modal body class
        if (isPickerModal) {
            $(defaults.modalContainer).removeClass('ipu-with-picker-modal');
            $(defaults.modalContainer).addClass('ipu-picker-modal-closing');
        }

        modal.removeClass('ipu-modal-in').addClass('ipu-modal-out').transitionEnd(function (e) {
            if (modal.hasClass('ipu-modal-out')) modal.trigger('closed');
            else modal.trigger('opened');

            if (isPickerModal) {
                $(defaults.modalContainer).removeClass('ipu-picker-modal-closing');
            }
            if (isPopup || isLoginScreen || isPickerModal) {
                modal.removeClass('ipu-modal-out').hide();
                if (removeOnClose && modal.length > 0) {
                    modal.remove();
                }
            }
            else {
                modal.remove();
            }
        });
        if (isModal && defaults.modalStack) {
            ipu.modalStackClearQueue();
        }

        return true;
    };
    function handleClicks(e) {
        /*jshint validthis:true */
        var clicked = $(this);
        var url = clicked.attr('href');


        //Collect Clicked data- attributes
       /* var clickedData = clicked.dataset();

        // Popup
        var popup;
        if (clicked.hasClass('ipu-open-popup')) {
            if (clickedData.popup) {
                popup = clickedData.popup;
            }
            else popup = '.ipu-popup';
            ipu.popup(popup);
        }
        if (clicked.hasClass('ipu-close-popup')) {
            if (clickedData.popup) {
                popup = clickedData.popup;
            }
            else popup = '.ipu-popup.modal-in';
            ipu.closeModal(popup);
        }*/

        // Close Modal
        if (clicked.hasClass('ipu-modal-overlay')) {
            if ($('.ipu-modal.ipu-modal-in').length > 0 && defaults.modalCloseByOutside)
                ipu.closeModal('.ipu-modal.ipu-modal-in');
            if ($('.ipu-actions-modal.ipu-modal-in').length > 0 && defaults.actionsCloseByOutside)
                ipu.closeModal('.ipu-actions-modal.ipu-modal-in');

        }
        if (clicked.hasClass('ipu-popup-overlay')) {
            if ($('.ipu-popup.ipu-modal-in').length > 0 && defaults.popupCloseByOutside)
                ipu.closeModal('.ipu-popup.modal-in');
        }
    }

    $(document).on('click', ' .ipu-modal-overlay, .ipu-popup-overlay, .ipu-close-popup, .ipu-open-popup, .ipu-close-picker', handleClicks);
})(ipu || window, jQuery);

(function (ipu, $) {
    NavBar.prototype.defaultOpt = {
        animate: false,           // 默认有动画
        contentSlt: ".ipu-nav-content",
        callBack: function (currentIndex, lastIndex) { // currentIndex: 当前索引，lastIndex上一次索引(第一次时为null)
        }
    };

    function NavBar(slt, options) {
        this.options = $.extend({}, this.defaultOpt, options);
        this.content = $(this.options.contentSlt);
        this.nav = $(slt);
        this.wrapper = $(">ul", this.content);
        this.contents = $(">li", this.wrapper);
        this.navs = $(">a", this.nav);
        var me = this;

        var activeIndex = this.navs.filter(".ipu-current").index(); // 查找默认有active的索引
        if (activeIndex == -1) {
            activeIndex = this.contents.filter(".ipu-current").index(); // 查找默认有active的索引
        }
        this.options.index = activeIndex != -1 ? activeIndex : 0;

        if (!this.options.animate) {
            this.wrapper.addClass("ipu-no-animation")
        }

        this.navs.each(function (index, i) {
            $(this).click(function () {
                me.show(index);
            });
        });

        this.lastIndex = null;
        this.currentIndex = null;
        me.show(this.options.index);
    }

    NavBar.prototype.show = function (index) {
        if (this.currentIndex != index) {
            var currentContent = $(this.contents[index]).addClass("ipu-show");

            if (this.options.animate) {
                if (this.lastIndex != null && this.lastIndex != index) {
                    $(this.contents[this.lastIndex]).removeClass("ipu-show"); // 隐藏上上个元素
                }

                if (this.currentIndex != null) {        // 非第一次需要动画效果
                    if (this.currentIndex < index) {   // 需要内容为往左走，显示右边的内容
                        if (this.lastIndex != null && this.lastIndex < this.currentIndex) {  // 内容已经左走过了，则需要移除动画复原位置，再通过width()方法强制生效
                            this.wrapper.addClass("ipu-no-animation").removeClass("ipu-nav-content-right").width(); // 可以强制刷新，默认jquery应该会将这些dom上的修改延时处理？
                        }
                    } else {
                        if (this.lastIndex == null || this.lastIndex > this.currentIndex) { // 类似同上
                            this.wrapper.addClass("ipu-no-animation").addClass("ipu-nav-content-right").width(); // 可以强制刷新不？
                        }
                    }
                    this.wrapper.removeClass("ipu-no-animation").toggleClass("ipu-nav-content-right");
                }
            } else {
                $(this.contents[this.currentIndex]).removeClass("ipu-show");
            }

            // 更新class，ipu-current状态
            $(this.contents[index]).addClass("ipu-current").siblings(".ipu-current").removeClass("ipu-current");
            $(this.navs[index]).addClass("ipu-current").siblings(".ipu-current").removeClass("ipu-current");

            this.lastIndex = this.currentIndex;
            this.currentIndex = index;

            if (this.options.callBack) {
                this.options.callBack(this.currentIndex, this.lastIndex);
            }
        }
    };

    ipu.navBar = function (slt, options) {
        return new NavBar(slt, options);
    };
})(ipu || window, jQuery);

(function (ipu, $) {
    function __dealCssEvent(eventNameArr, callback) {
        var events = eventNameArr,
            i, dom = this;// jshint ignore:line

        function fireCallBack(e) {
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }

        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
    }

    $.fn.animationEnd = function (callback) {
        __dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
        return this;
    };

    function submitForm(doc, url ,params){
        var form = doc.createElement("form");
        form.action = url;
        form.method = "post";
        form.style.display = "none";

        for (var x in params) {
            var ele = doc.createElement("input");
            ele.type="hidden";
            ele.name = x;
            ele.value =  params[x];
            form.appendChild(ele);
        }

        doc.body.appendChild(form);
        form.submit();
    }

    // 检查是否有ipu-pages的结构
    function checkPages() {
        if(!hasPages){
            pagesObj = $(".ipu-pages"); // pagesObj为空则进行jquery取值
            if(pagesObj.size() == 0){
                pagesObj =  $("<div class='ipu-pages'><div class='ipu-page ipu-show "+zeroPageClass+"' id='"+pageIdPrefix+"0'></div>").appendTo("body");
            }
            hasPages = true;
        }
    }

    // 站位页面
    function isZeroPage(page) {
        return $(page).hasClass(zeroPageClass);
    }

    var page = {};
    var hasPages = false;
    var maps = {};
    var pageNo = 1; // 编号0留给主页面或当前页面，或没有
    var pageIdPrefix = "ipuPage-";
    var pagesObj = null;
    var animateInClass = "ipu-anim ipu-slideRightIn";
    var animateOutClass  = "ipu-anim ipu-slideRightOut";
    var eventName = "ipuUIPageBack";
    var zeroPageClass = 'ipu-page-zero';
    var zeroPagesClass = 'ipu-pages-zero';

    page.options = {     // 那个窗口执行open,默认父窗口
        target: window.parent, // 默认执行父窗口
        backIndex: -1,    // 默认回退一页
        closeIndex: -1,   // 默认关闭最近一个页面
        params:{},        // post的默认参数
        animate: true,     // 是否动画效果
        showLoading: true,   // 是否显示加载消息
        loadingMessage: '正在加载中',
        method : null,     // 请求方式，用户不需要设置
        minMessageTime: 500, // 最小显示加载时间，避免出现闪现的情况
        callBack:function () { // 事件回调
        }
    };

    // 当前页面加载，针对顶层父窗口
    page.openPage = function (url, options) {
        var newPage = null;
        var nowPageNo = pageIdPrefix + (pageNo++);
        maps[nowPageNo] = url;

        checkPages();

        if(options.showLoading){
            ipu.showPreloader(options.loadingMessage, options.minMessageTime);
        }

        if(options.method == 'post'){
            newPage = $("<div class='ipu-page' id='"+nowPageNo+"'><iframe class='ipu-page-iframe'></iframe></div>");
        }else{
            newPage = $("<div class='ipu-page' id='"+nowPageNo+"'><iframe class='ipu-page-iframe' src='"+url+"'></iframe></div>");
        }

        var zeroPage = isZeroPage($(".ipu-page:last", pagesObj));
        var animatePage = newPage;
        if(zeroPage){
            animatePage = pagesObj.addClass(zeroPagesClass);
        }

        function end() {
            if(options.showLoading) {
                ipu.hidePreloader();
            }

            if(options.animate) {
                animatePage.removeClass(animateInClass);
            }

            newPage.siblings(".ipu-show").removeClass('ipu-show');
            if(options.callBack){
                options.callBack();
            }
        }

        $(".ipu-page-iframe", newPage).one('load', function () {
            newPage.addClass("ipu-show").width(); // 强制生效，否则可能出现页面闪现，无动画情况

            if(zeroPage){
                animatePage.removeClass(zeroPagesClass);
            }
            if(options.animate){
                animatePage.addClass(animateInClass).animationEnd(end);
            }else{
                end();
            }
        });

        newPage.appendTo(pagesObj);
        if(options.method == 'post') {
            var pageDoc = $(".ipu-page-iframe", newPage)[0].contentDocument;
            submitForm(pageDoc, url, options.params);
        }
    };

    // post方式加载页面
    page.postPage = function (url, options) {
        options.method = 'post';
        page.openPage(url, options);
    };

    // 当前页面后退，针对顶层父窗口
    page.backPage = function (options) {
        var backIndex = options.backIndex;
        var page = null;
        var nowPage = $(".ipu-page.ipu-show", pagesObj);

        if(backIndex == 0){
            page = $(".ipu-page:first", pagesObj);
        }else { // 越界的情况
            var prevPage = nowPage.prevAll(".ipu-page");
            if(backIndex < 0){
                page= $(prevPage[-backIndex - 1]);
            }else{
                page= $(prevPage[prevPage.size() - backIndex]);
            }
        }

        var animatePage = nowPage;
        var zeroPage = isZeroPage(page);

        // 主页面模式时
        if(zeroPage){
            animatePage = pagesObj;
        }else{
            page.addClass("ipu-show"); //显示前一个
        }

        function end (){
            $(this).removeClass(animateOutClass);
            page.nextAll(".ipu-page").remove();

            var iframe = $(".ipu-page-iframe", page);
            var nowDoc;

            if(iframe.size() == 0){ // 找不到子窗口就当是返回了主页面，在当前窗口触发
                nowDoc = window.document;
            }else{
                nowDoc = iframe[0].contentDocument;
            }

            if(zeroPage){
                pagesObj.addClass(zeroPagesClass);
            }

            var evt = nowDoc.createEvent('Event');
            evt.initEvent(eventName, true, true);
            if(options.data){
                evt.data = options.data;
            }
            nowDoc.body.dispatchEvent(evt);
            if(options.callBack){
                options.callBack();
            }
        }

        if(options.animate){
            animatePage.addClass(animateOutClass).animationEnd(end);
        }else{
            end();
        }
    };

    // 往前关闭窗口
    page.closePage = function (options) {
        var closeIndex = options.closeIndex;
        var prevPage = $(".ipu-page.ipu-show", pagesObj).prevAll(".ipu-page");

        if(closeIndex < 0){
            closeIndex = -closeIndex -1;
        }else{
            closeIndex = prevPage.size() - closeIndex;
        }

        $(prevPage[closeIndex]).remove();
        if(options.callBack){
            options.callBack();
        }
    };

    // 调用父窗口打开页面
    page.open = function (url, options) {
        options = $.extend({}, this.options, options);
        options.target.ipu.page.openPage(url, options);
    };

    // post方法
    page.post = function (url, options) {
        options = $.extend({}, this.options, options);
        options.method = 'post';
        options.target.ipu.page.openPage(url, options);
    };

    // 调用父窗口，回退
    page.back = function (options) {
        options = $.extend({}, this.options, options);
        options.target.ipu.page.backPage(options);
    };

    // 返回首页
    page.backHome = function (options) {
        options = options || {};
        options.backIndex = 0;
        page.back(options);
    };

    // 子窗口，待确认
    page.close = function (options) {
        options = $.extend({}, this.options, options);
        options.target.ipu.page.closePage(options);
    };

    // 添加回调事件
    page.onBack = function (back) {
        $("body").on(eventName, function (e) {
            var data = e.originalEvent.data;
            back(data);
        });
    };

    // 提供一个关闭一群窗口的方法
    ipu.page = page;
})(ipu || window, jQuery);

// picker
(function (ipu, $, Hammer) {
    var showItemSize = 9;   // 显示的子项数量，
    var r = 90;             // 计算旋转的圆半径，结果应该缩小，是为了r不要距离容器太近
    var itemAngle = 180 / showItemSize;   // 每项对应的角度是 180/9 = 20
    var maxExceed = itemAngle;         // 滚动时允许超出边界的最大角度
    // itemHeight = 40px;       // 需要给出r=89是怎么计算出来的，是根据 40/2/Math.tan(40/2/180*Math.PI)=113，直接太大不好看

    function Picker(slt, options) {
        this.el = $(slt)[0];
        this.options = $.extend({}, this.defaultOptions, options);
        this._init();
    }

    // 默认参数
    Picker.prototype.defaultOptions = {
        onChange: function () {       // 子项选中事件
        },
        listen: true,                  // 默认已开记监听变化
        data: []
    };

    Picker.prototype._init = function () {
        var self = this;
        this.wrap = $(">ul", this.el);
        this.index = null;
        this.listen = !!this.options.listen;

        this.beginAngle = 0;
        this.beginExceed = this.beginAngle - maxExceed;       // 最小角度值
        this.stopInertiaMove = false;
        this.lastAngle = null; // 保存滑动前的角度
        this.empty = this.options.data.length == 0;

        // 如果是ios，则ul的旋转中心点，有变化
        if(ipu.device.ios){
            this.wrap.css("transform-origin", "center center "+r+"px"); //如果是ios，要变更旋转的中心点
        }

        this.hammer = new Hammer.Manager(this.el);
        this.hammer.add(new Hammer.Pan({direction: Hammer.DIRECTION_VERTICAL, threshold: 5}));
        this.hammer.add(new Hammer.Press({threshold: 4}));  //
        this.hammer.on("panstart panmove panend pancancel", Hammer.bindFn(this._onPan, this));

        this.hammer.on("press pressup", function (e) {  // 如果用户点击了，是停止自动滚动
           // console.log('press');
            if(this.empty){
                return ;
            }

            self.stopInertiaMove = true;
            if (e.type == 'pressup') {
                self.endScroll();
            }
        });

        this.setItems(this.options.data);
    };

    Picker.prototype.setItems = function (data, textName) {
        this.wrap.empty(); // 清空历史数据
        this.data = data = data || [];
        this.empty = data.length == 0; // 数据是否为空

        this.newData = true; // 表示设置了新数据，触发change回调，但第一次设置时，不需要触发
        var self = this;
        var lis = "";
        textName = textName || 'text';

        for (var i = 0, j = data.length; i < j; i++) {
            lis = lis + "<li>" + data[i][textName] + "</li>";
        }

        $(lis).appendTo(this.wrap);

        this.items = $(">li", this.wrap);
        this.itemsSize = this.items.size();

        this.endAngle = (this.empty ? 0 : this.itemsSize - 1) * itemAngle;
        this.endExceed = this.endAngle + maxExceed;  // 最大旋转角度值

        // 初始化各子项角度
        this.items.each(function (i) {
            $(this).css({
                "transform": "translateZ(" + r + "px) rotateX(-" + (i * itemAngle) + "deg)",
                "transform-origin": "center center -" + r + "px"
            });
            $(this).click(function () {
                self.stopInertiaMove = true;
                self.setAngle(i * itemAngle, true);
            })
        });

        var newAngle ;
        if(this.empty || this.index == null){
            newAngle = 0;
        }else {
            if(this.index > this.itemsSize - 1){
                newAngle = (this.itemsSize - 1) * itemAngle;
            }else{
                newAngle = this.index * itemAngle;
            }
        }
        this.setAngle(newAngle, true);

        /*if (this.index !== null) { // 当前已经旋转则，保留当前的索引
         if (this.index > this.itemsSize - 1 && !this.empty) {
         this.index = this.itemsSize - 1;
         }
         this.setAngle(this.index * itemAngle, true);
         } else { // 第一次初始数据，不触发change事件
         this.index = 0;     // 被调用后，不能再使用null值了
         this.setAngle(0, false); // 第一次设置初始化时，不触发change事件
         }*/
    };

    Picker.prototype._onPan = function (ev) {
        if(this.empty){
            return ;
        }

        //console.log(ev.deltaX + "=="+ ev.deltaY);
        if (ev.type == 'panstart') { // 好像一定要移动才有startg事件
            self.stopInertiaMove = true;
            this.lastAngle = this.angle;
            this.wrap.addClass("ipu-noanimate");    // 移除动画
            this.stopInertiaMove = true; //  停止自动减速滚动
           // console.log('panstart');

        } else if (ev.type == 'panmove') {
            var moveAngle = this.calcAngle(ev.deltaY);
            var newAngle = this.lastAngle - moveAngle;   //最新的角度
            //console.log('=='+newAngle);
            // 一个可以转动的最小值和最大值过滤
            if (newAngle < this.beginExceed) {
                newAngle = this.beginExceed;
            }
            if (newAngle > this.endExceed) {
                newAngle = this.endExceed;
            }
            this.setAngle(newAngle);

        } else { // end or cancel事件
            // console.log('end or cancel:' + ev.type);
            var v = ev.overallVelocityY;    // 滑动的速度
            var dir = v > 0 ? -1 : 1; //加速度方向
            var deceleration = dir * 0.0006 * -1;
            var duration = Math.abs(v / deceleration); // 速度消减至0所需时间
            var dist = v * duration / 2; //最终移动多少

            var startAngle = this.angle;
            var distAngle = -this.calcAngle(dist);
           //  console.log("dist=" + dist + ", distAngle" + distAngle);

            //----
            var srcDistAngle = distAngle;
            if (startAngle + distAngle < this.beginExceed) {
                distAngle = this.beginExceed - startAngle;
                duration = duration * (distAngle / srcDistAngle) * 0.6;
            }
            if (startAngle + distAngle > this.endExceed) {
                distAngle = this.endExceed - startAngle;
                duration = duration * (distAngle / srcDistAngle) * 0.6;
            }

            if (distAngle == 0) {
                this.endScroll();
                return;
            }
            this.scrollDistAngle(startAngle, distAngle, duration);
        }
    };

    // 计算移动的角度，转动的角度，就是移动的距离对应相关圆周
    // 2*r*PI = 360,  angle = 360*c/(2*r*PI)
    var ca = 360 / (2 * r * Math.PI);
    Picker.prototype.calcAngle = function (c) {
        return c * ca;
    };

    // endScroll 是否为结束的滚动结束，滚动结束需要调用结束事件
    Picker.prototype.setAngle = function (newAngle, endScroll) {
        this.angle = newAngle; // 存储最新值
        this.wrap.css("transform", "perspective(1000px) rotateY(0deg) rotateX(" + newAngle + "deg)");
        this.calcItemVisable(newAngle);

        if (endScroll) {
            var index = newAngle / itemAngle;
            var oldIndex = this.index;
            this.index = this.empty ? null : index; // 这里可以做一个判断，如果是empty，则index值可以不改变

            // 这个地方要判断下，数据更新或索引更新都要触发
            if (oldIndex != index || this.newData) {
                this.newData = false;
               // console.log('change');
                if (this.options.onChange && this.listen) {
                    // console.log('changed call');
                    this.options.onChange(this.getSelectedItem(), this.index, oldIndex, this.newData);
                }
            }
        }
    };

    // 计算子项的显示情况
    Picker.prototype.calcItemVisable = function (angle) {
        this.items.each(function (index) {
            var difference = Math.abs(index * itemAngle - angle);

            if (difference < itemAngle / 2) {
                $(this).addClass("ipu-highlight ipu-visible");
            } else if (difference >= (90 - itemAngle / 2)) { // 距离不能超过90度
                $(this).removeClass("ipu-highlight ipu-visible");
            } else {
                $(this).addClass("ipu-visible").removeClass("ipu-highlight");
            }
        });
    };

    // 设置最后回归位置
    Picker.prototype.endScroll = function () {
        this.wrap.removeClass("ipu-noanimate");
        var endAngle;

        if (this.angle < this.beginAngle) {
            endAngle = this.beginAngle;
        } else if (this.angle > this.endAngle) {
            endAngle = this.endAngle;
        } else {
            var index = parseInt((this.angle / itemAngle).toFixed(0));
            endAngle = (itemAngle * index);
        }

        this.setAngle(endAngle, true);
    };

    // 进行惯性滚动
    Picker.prototype.scrollDistAngle = function (startAngle, distAngle, duration) {
        var self = this;
        var nowTime = new Date().getTime();
        this.stopInertiaMove = false;
        duration = 1 * duration; // 滚动时长控制修改

        // hammer调用的惯性函数
        (function (nowTime, startAngle, distAngle, duration) {
            var frameInterval = 13;
            var stepCount = duration / frameInterval;
            var stepIndex = 0;

            (function inertiaMove() {
                if (self.stopInertiaMove) return;
                var newAngle = self.quartEaseOut(stepIndex, startAngle, distAngle, stepCount);
                self.setAngle(newAngle);
                stepIndex++;

                if (stepIndex > stepCount - 1 || newAngle < self.beginExceed || newAngle > self.endExceed) {
                    self.endScroll();
                    return;
                }

                setTimeout(inertiaMove, frameInterval);
            })();

        })(nowTime, startAngle, distAngle, duration);
    };

    Picker.prototype.setListen = function (bool) {
        this.listen = !!bool;
    };

    Picker.prototype.quartEaseOut = function (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    };

    Picker.prototype.setSelectedValue = function (value) {
        var self = this;
        for (var index in self.data) {
            var item = self.data[index];
            if (item.value == value) {
                self.setAngle(index* itemAngle, true);
                return;
            }
        }
    };

    // 获取当前选中的值
    Picker.prototype.getSelectedItem = function () {
        return this.empty ? {}: this.data[this.index];
    };

    Picker.prototype.getSelectedValue = function () {
        return this.getSelectedItem().value;
    };

    Picker.prototype.getSelectedText = function () {
        return this.getSelectedItem().text;
    };

    Picker.prototype.getSelectedIndex = function () {
        return this.index;
    };

    ipu.Picker = Picker;

})(ipu || window, jQuery, Hammer);

// popPicker
(function (ipu, $) {
    var Picker = ipu.Picker;

    function PopPicker(options) {
        this.options = $.extend({}, this.defaultOptions, options);
        if(!Picker){
            Picker = ipu.Picker;
        }
        this._init();
    }

    PopPicker.prototype.defaultOptions = {
        template: '<div class="ipu-poppicker">\
                        <div class="ipu-poppicker-header">\
                            <button class="ipu-btn ipu-btn-s ipu-poppicker-btn-cancel">取消</button>\
                            <button class="ipu-btn ipu-btn-s ipu-poppicker-btn-ok">确定</button>\
                        </div>\
                        <div class="ipu-poppicker-body">\
                        </div>\
                    </div>',
        pickerTemplate: '<div class="ipu-picker">\
                            <div class="ipu-picker-selectbox"></div>\
                            <ul></ul>\
                          </div>',
        data: [],    // 数据
        layer: 1,   // 数据层级
        btns: ['取消', '确认'],
        callBack: function () { // 选择数据时的回调函数

        }
    };

    PopPicker.prototype._init = function () {
        this.holder = $(this.options.template).appendTo("body");
        var bodyHtml = $(".ipu-poppicker-body", this.holder);

        var layer = this.options.layer;
        var width = (100 / layer) + "%";
        this.pickers = new Array(layer);
        var self = this;
        var pickerHtml;
        this.mask = this.createMask();

        // 先初始化最底层picerk，再上面来
        for (var i = layer -1; i >=0; i--) {
            pickerHtml = $(this.options.pickerTemplate).prependTo(bodyHtml).css({width: width});

            this.pickers[i] = new  Picker(pickerHtml, {
                onChange: (function (i) {
                    return function (item, index) { // 更新底部的值
                        if (i != layer - 1) {
                            self.pickers[i + 1].setItems(item.data);
                        }
                    };
                })(i)
            });
        }

        $(".ipu-poppicker-btn-ok", this.holder).click(function () {
            var rs = self.getSelectItems();
            if (self.options.callBack(rs) !== false) {
                self.hide();
            }
        }).text(this.options.btns[1]);

        $(".ipu-poppicker-btn-cancel", this.holder).click(function () {
            self.hide();
        }).text(this.options.btns[0]);
    };

    PopPicker.prototype.setData = function (data) {
        this.pickers[0].setItems(data);
    };

    PopPicker.prototype.show = function (callBack) {
        if (callBack) {
            this.options.callBack = callBack;
        }
        this.mask.show();
        this.holder.addClass("ipu-current");
    };

    PopPicker.prototype.hide = function () {
        this.mask.close();
        this.holder.removeClass("ipu-current");
    };

    // 获取相关值
    PopPicker.prototype.getSelectItems = function () {
        if (this.options.layer == 1) {
            return this.pickers[0].getSelectedItem();
        } else {
            var rs = [];
            for (var i = 0; i < this.options.layer; i++) {
                rs.push(this.pickers[i].getSelectedItem());
            }
            return rs;
        }
    };

    // 应该移除callback参数，提取出业成一个工具方法
    PopPicker.prototype.createMask = function(callback) {
        var self = this;
        var element = document.createElement('div');
        element.classList.add("ipu-picker-backup");
        //element.addEventListener($.EVENT_MOVE, $.preventDefault);
        element.addEventListener('click', function() {
            self.hide();
        });
        var mask = [element];
        mask._show = false;
        mask.show = function() {
            mask._show = true;
            element.setAttribute('style', 'opacity:1');
            document.body.appendChild(element);
            return mask;
        };
        mask._remove = function() {
            if (mask._show) {
                mask._show = false;
                element.setAttribute('style', 'opacity:0');
                setTimeout(function() {
                    var body = document.body;
                    element.parentNode === body && body.removeChild(element);
                }, 350);
            }
            return mask;
        };
        mask.close = function() {
            if(mask._show){
                if (callback) {
                    if (callback() !== false) {
                        mask._remove();
                    }
                } else {
                    mask._remove();
                }
            }
        };
        return mask;
    };

    ipu.popPicker = function (options) {
        return new PopPicker(options);
    };

})(ipu || window, jQuery);

(function (ipu, $) {

    /**
     *进度条
     */
    function progressBar(id, options) {
        this.id = id;
        this.level = options.level;
        this.progress = options.progress;
        this.progressBar = $(id).eq(0);

        if (options.progress != null) {
            this.setProgress(this.progress);
        }
        if (options.level != null) {
            this.setLevel(this.level);
        }
    }

    progressBar.prototype.setProgress = function (pro) {
        if (pro < 0 || pro > 100) return;

        $(this.progressBar.find(".ipu-progressbar")).css("transform", "translate3d(" + (-(100 - pro)) + "%, 0px, 0px)");
        this.progress = pro;
    };

    progressBar.prototype.getProgress = function () {
        return this.progress;
    };

    progressBar.prototype.setLevel = function (level) {
        if (level == "default") {
            $(this.progressBar).removeClass("ipu-progressbar-success ipu-progressbar-hightlight ipu-progressbar-warning");
            $(this.progressBar).addClass("ipu-progress");
        } else if (level == "success") {
            $(this.progressBar).removeClass("ipu-progressbar-highlight ipu-progressbar-warning");
            $(this.progressBar).addClass("ipu-progressbar-success");
        } else if (level == "highlight") {
            $(this.progressBar).removeClass("ipu-progressbar-success ipu-progressbar-warning");
            $(this.progressBar).addClass("ipu-progressbar-highlight");
        } else if (level == "warning") {
            $(this.progressBar).removeClass("ipu-progressbar-success ipu-progressbar-highlight");
            $(this.progressBar).addClass("ipu-progressbar-warning");
        }
    };

    ipu.progressBar = function (slt, options) {
        return new progressBar(slt, options);
    };
})(ipu || window, jQuery);

(function (ipu, $, iScroll) {

    // 扩展参数，iscroll组件的参数选项
    // 扩展参数，用户直接在页面上自定好，顶端和底部加载html
    // 设置上下条件长度，或计算函数
    // 处理resize的问题，用户主动调用refresh？？
    // 底部启用或停用时，应该刷新组件iscroll高度
    // 顶部正在加载时，自动停止底端加载状态，停用底部加载，停用底部加载时，可以不隐藏，变性成显示不见，或者隐藏，然后修改iscroll参数

    Refresh.prototype.defaultOptions = {
        bottomLoadFun: null,           // 底部加载处理函数
        topLoadFun: null,               // 顶部加载处理函数
        initEnableTop: true,            // 初始时启用刷新，有时用户并不想启用
        initEnableBottom: true,         // 初始时启用加载更多，用时用户并不想启用
        bottomLoadHtml: '<div class="ipu-refresh-bottom"><span class="ipu-refresh-loading"></span></div>',  // 默认底部加载显示内容
        topLoadHtml: '<div class="ipu-refresh-top"><span class="ipu-refresh-loading"></span><div class="ipu-refresh-arrow"></div></div>',
                // 默认顶部加载显示内容，最上层节点class有下面三个阶段变化
                // 默认阶段，不是顶部加载状态时，且拖动时未达到加载距离，无特殊class，移除ipu-refresh-top-loading
                // 拖动达到加载距离，则增加class:ipu-refresh-toload
                // 加载中，则增加class:ipu-refresh-top-loading，移除class:ipu-refresh-toload
        bottomAddLen: 0,  // 底部提前加载距离，单位px
        iScrollOptions:{} // 主要是用来接收外面一些函数，不能传递回调的相关函数如refresh,也可在本地函数调用完后，再调用参数的函数，不推荐
    };

    function Refresh(slt, options) {
        this.options = $.extend({}, this.defaultOptions, options);
        this.el = $(slt).get(0);
        this._initBottomAndTop();
        var me = this;

        this.iScrollOptions = {
            onScrollMove: function (e) {
                if (me.topEnable && !me.topLoading) { // 顶部是松手才加载
                    if (this.y >= me.topPullOffset && !me.topEl.hasClass('ipu-refresh-toload')) { // 达到刷新距离，更新显示状态
                        me.topEl.addClass('ipu-refresh-toload');
                    } else if (this.y < me.topPullOffset && me.topEl.hasClass('ipu-refresh-toload')) { // 从达到刷新距离更新为未达到距离，更新显示状态
                        me.topEl.removeClass('ipu-refresh-toload');
                    }
                }

                me._checkBottomLoading(); // 底部加载条件和顶部条件不一样，只要滚动离底部一定高度就开始加载
                me.goTop = this.y > me.topPullOffset; // 记录是否位于顶部位置，以便刷新后可以回到此位置
            },
            onBeforeScrollEnd: function () {    // 一定是用户拖动触发，在滚动结束前应该触发
                me._checkTopLoading();
                me._checkBottomLoading();
            },
            onScrollEnd: function () { // 这个事件可能由非用户拖动时触发，可能是拖动惯性导致，所有顶部不应该处理，但顶部不管是否惯性，位置条件满足即触发
                if (me.topLoading && this.y < this.minScrollY && me.goTop) {
                    me.iScroll.scrollTo(0, this.minScrollY, 0);
                }
                me._checkBottomLoading(); // 在beforend执行还不够，还在要end执行
            },
            onRefresh: function () { // 刷新时，若顶部加载还在进行，且当前显示的顶部加载，则继续显示，否则刷新后会消失顶部加载,这里代码没有考虑重用了,应该可以做一步提取
                if (me.topLoading) { // 如果顶部在加载，则刷新的时候，设置最小顶部距离，显示顶部加载状态
                    this.minScrollY = this.minScrollY + me.topPullOffset;
                }
            }
        };

        this.iScrollOptions = $.extend({}, this.options.iScrollOptions, this.iScrollOptions);
        this.iScroll = new iScroll(this.el, this.iScrollOptions);
        this._checkContentLoading();
    }

    Refresh.prototype._initBottomAndTop = function () {
        this.scrollEl = $(">.ipu-refresh-wrapper" ,this.el);
        this.bottomEl = $(this.options.bottomLoadHtml).appendTo(this.scrollEl);
        this.topEl = $(this.options.topLoadHtml).prependTo(this.scrollEl);

        this.topPullOffset = this.topEl.outerHeight();
        this.bottomPullOffset = this.bottomEl.outerHeight() + this.options.bottomAddLen; // 增加100;最好配一个额外参数

        this.topLoading = false;        // 顶部正在载加载
        this.bottomLoading = false;     // 底部正在加载
        this.bottomEnable = this.options.initEnableBottom && !!this.options.bottomLoadFun;
        this.topEnable = this.options.initEnableTop && !!this.options.topLoadFun;
        this.goTop = false;         // 用来处理，因为iScroll使用momentum（惯性）， 导致有时顶部显示不正确问题，true表示顶部显示加载条

        this.enableBottom(this.bottomEnable);
        this.enableTop(this.topEnable);
    };

    // 检查是否需要底部加载
    Refresh.prototype._checkBottomLoading = function () {
        if (this.bottomEnable && !this.bottomLoading) {
            if (this.iScroll.y < this.iScroll.maxScrollY + this.bottomPullOffset) {
                this._startBottomLoading();
            }
        }
    };

    Refresh.prototype._checkTopLoading = function () {
        if (this.topEnable && !this.topLoading) {
            if (this.topEl.hasClass('ipu-refresh-toload')) {
                this._startTopLoading();
            }
        }
    };

    // 检查内容是否超出容器高度，未超出时，自动调用底部加载
    Refresh.prototype._checkContentLoading = function () {
        if(this.iScroll.maxScrollY >= -this.bottomPullOffset){ // 此处要计算底端的高度
            this._startBottomLoading();
        }
    };

    // 开始底部加载
    Refresh.prototype._startBottomLoading = function () {
        if (this.bottomEnable && !this.bottomLoading) {
            this.bottomLoading = true;
            this.options.bottomLoadFun(); // 刷新当前索引加载更多的数据
        }
    };

    // 开始顶部加载
    Refresh.prototype._startTopLoading = function () {
        if (this.topEnable && !this.topLoading) {
            this.topLoading = true;
            this.topEl.removeClass('ipu-refresh-toload').addClass('ipu-refresh-top-loading');
            this.iScroll.minScrollY = this.iScroll.minScrollY + this.topPullOffset;
            this.options.topLoadFun(); // 刷新当前索引加载更多的数据
        }
    };

    // 结束底部加载
    Refresh.prototype.endBottomLoading = function () {
        this.bottomLoading = false;
        this.refresh();
    };

    // 结束顶部加载
    Refresh.prototype.endTopLoading = function () {
        this.topEl.removeClass('ipu-refresh-top-loading');
        this.topLoading = false;
        // this.iScroll.scrollTo(0, 0); // 刷新加载则应该回到顶部，待测试确认
        this.refresh();
    };

    // 设置顶部加载是否可用，true可用，否则不可用
    Refresh.prototype.enableTop = function (enable) {
        this.topEnable = enable;
        if (enable) {
            this.topEl.show();
        } else {
            this.topEl.hide();
        }
    };

    // 设置底部加载是否可用，true可用，否则不可用
    Refresh.prototype.enableBottom = function (enable) {
        this.bottomEnable = enable;
        if (enable) {
            this.bottomEl.show();
        } else {
            this.bottomEl.hide();
        }
    };

    // 只有在内容发生变更时，但是又没有触发调用end相关方法时，使用此方法更新高度信息
    // 或者组件在一开始未显示？？
    // 刷新会移除拖动中状态
    Refresh.prototype.refresh = function () {
        this.iScroll.refresh();
        this._checkContentLoading();
    };

    ipu.refresh = function (slt, optoins) {
        return new Refresh(slt, optoins);
    };

})(ipu || window, jQuery, iScroll);

// Tab
(function (ipu, $) {
    function Tab(holder, options) {
        this.el = $(holder).get(0);
        this.titleItems = $(".ipu-tab-title:first>li", this.el);
        this.bodyWrapper = $(".ipu-tab-body-wrapper:first", this.el);
        this.contentItems = $(">li", this.bodyWrapper);

        this.options = $.extend({}, this.defaultOptions, options);
        this.itemSize = this.contentItems.size();
        this.fixed = $(this.el).is(".ipu-tab-fixed"); // 是否为固定高度的

        var that = this;
        this.titleItems.each(function (index) {
            $(this).click(function () {
                that.show(index);
            });
        });

        var index = this.titleItems.filter(".ipu-current").index();
        if (index == -1) {
            index = 0;
        }

        this.show(index);
    }

    Tab.prototype.defaultOptions = {
        callBack: null  // 回调函数，tab切换时回调函数
    };

    Tab.prototype.show = function (index) {
        if (this.fixed) {
            var move = -index * 100 + "%";
            this.bodyWrapper.css("transform", "translate3d(" + move + ", 0, 0)");
        }
        this.contentItems.eq(index).addClass("ipu-current").siblings().removeClass("ipu-current");
        this.titleItems.eq(index).addClass("ipu-current").siblings().removeClass("ipu-current");
        this._end(index);
    };

    Tab.prototype._end = function (index) {
        this.lastIndex = this.currentIndex;
        this.currentIndex = index;

        if (this.options.callBack) {
            this.options.callBack(index, this.lastIndex);
        }
    };

    ipu.tab = function (slt, options) {
        return new Tab(slt, options);
    };
})(ipu || window, jQuery);


// tap点击效果处理，只针对jquery上面的click事件，依赖touch事件
(function (ipu, $) {
    var active = {};

    var options = defaultOptions = {
        distanceAllow: 10,   // 最大移动距离，超过移除效果
        displayDelay: 100,  // 延时显示时间，以防止是滚动操作
        hideDelay: 120,     // 隐藏延时时间
        eventName: 'click', // 事件处理是click
        activeClass: 'ipu-active',   // 激活时的class
        getHandleNode: function (node) {  // 找到最先一级处理此click事件的元素
            if (!node || !node.nodeType) return;

            var distNode = null;
            var nodeArray = [];

            // 还有其它情形考虑，如a标签的跳转，或在原生元素添加事件属性的
            function findHander(inNode) {
                // 此方法适用于jquery, 1.12.4, 2.2.4, 3.2.1版本，_data方法以后可能会被移除。$.data是一些老版本写法
                var eventHandlers = ($._data || $.data)(inNode, 'events');

                if (eventHandlers) {
                    eventHandlers = eventHandlers[options.eventName];
                }

                if (!eventHandlers) {
                    return;
                }

                var thisNode = false;
                $.each(eventHandlers, function (index, handler) {
                    if (handler.selector) {
                        var objs = $(handler.selector, inNode);
                        $.each(nodeArray, function (tIndex, tNode) {
                            if (objs.is(tNode)) {
                                distNode = tNode;
                                return false;
                            }
                        });

                        if (distNode) {
                            return false; //
                        }
                    } else {
                        thisNode = true;  // 保存distNode，有可能有子节点满足条件，所以只保存此值为默认值
                    }
                });

                if (thisNode && distNode == null) { // 如果没在子节点找到click事件，而当前节点又有click事件，就使用当前节点
                    distNode = inNode;
                }

                return distNode;
            }

            while (!("tagName" in node) || !findHander(node)) {
                if (!node.parentNode || node.parentNode.nodeType != 1) {
                    break;
                }
                nodeArray.push(node);
                node = node.parentNode;
            }

            return distNode;
        }
    };

    function getOriginalEvent(e) {
        return e.originalEvent || e;
    }

    function getXY(e) {
        var x = e.touches ? e.touches[0].pageX : e.clientX;
        var y = e.touches ? e.touches[0].pageY : e.clientY;
        return [x, y];
    }

    //根据不同浏览器获取不同原生事件event
    var hasTouch = "ontouchstart" in window,
        START_EVENT = hasTouch ? 'touchstart' : 'mousedown',
        MOVE_EVENT = hasTouch ? 'touchmove' : 'mousemove',
        END_EVENT = hasTouch ? 'touchend' : 'mouseup',
        CANCEL_EVENT = hasTouch ? 'touchcancel' : '';

    $(function () {
        var startXY, tapEl, timeOutID;
        var dom = document.body;

        // force为false的时候，不用管timeOutID，在老的timeOutID未移除的情况下，有可能又产生了新的，
        // 导致else代码未被执行，导致老的点击元素class未被移除
        function removeClass(dom, force) {
            if (force && timeOutID) {
                window.clearTimeout(timeOutID);
            } else {
                $(dom).removeClass(options.activeClass);
            }
        }

        function removeActive(force) {
            if (force) {
                removeClass(tapEl, force);
            } else {
                window.setTimeout(removeClass, options.hideDelay, tapEl, force);
            }
            startXY = null;
            tapEl = null;
        }

        $(dom).bind(START_EVENT, function (e) {
            if (tapEl) {    // 多点接触时处理
                removeActive(true);
                return;
            }

            e = getOriginalEvent(e);
            startXY = getXY(e);
            tapEl = options.getHandleNode(e.target);

            if (tapEl) {
                timeOutID = window.setTimeout(function (dom) {
                    timeOutID = null;
                    $(dom).addClass(options.activeClass);
                }, options.displayDelay, tapEl);
            }
        });

        $(dom).bind(MOVE_EVENT, function (e) {
            if (!tapEl) {
                return;
            }

            e = getOriginalEvent(e);

            var xy = getXY(e);
            if (startXY && (Math.abs(xy[0] - startXY[0]) > options.distanceAllow || Math.abs(xy[1] - startXY[1]) > options.distanceAllow)) {
                removeActive(true);
            }
        });

        $(dom).bind(END_EVENT, function (e) {
            if (tapEl) {
                removeActive();
            }
        });

        // 手机来电等非用户取消操作时触发事件
        if (CANCEL_EVENT) {
            $(dom).bind(CANCEL_EVENT, function (e) {
                if (tapEl) {
                    removeActive();
                }
            });
        }
    });

    // 更新默认值
    active.setOptions = function (opts) {
        options = this.options = $.extend({}, defaultOptions, opts);
    };
    ipu.active = active;
})(ipu || window, jQuery);


/*===========================
Device/OS Detection
===========================*/
// from sui，但IPU框架的ua不是这样的
;(function (ipu, $) {
    "use strict";
    var device = {};  // Classes
    var classNames = [];
    var ua = navigator.userAgent
    
    // 这中针对ipu框架的情况，待测试
    if(ua.match(/ipumobile/i)){
        device.ios =  !!ua.match(/ios/i);
        device.android = !!ua.match(/android/i);
    }else{
        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

        device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;

        // Android
        if (android) {
            device.os = 'android';
            device.osVersion = android[2];
            device.android = true;
            device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
        }
        if (ipad || iphone || ipod) {
            device.os = 'ios';
            device.ios = true;
        }
        // iOS
        if (iphone && !ipod) {
            device.osVersion = iphone[2].replace(/_/g, '.');
            device.iphone = true;
        }
        if (ipad) {
            device.osVersion = ipad[2].replace(/_/g, '.');
            device.ipad = true;
        }
        if (ipod) {
            device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
            device.iphone = true;
        }
        // iOS 8+ changed UA
        if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
            if (device.osVersion.split('.')[0] === '10') {
                device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
            }
        }

        // Webview
        device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

        // Minimal UI
        if (device.os && device.os === 'ios') {
            var osVersionArr = device.osVersion.split('.');
            device.minimalUi = !device.webView &&
                (ipod || iphone) &&
                (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
                $('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr('content').indexOf('minimal-ui') >= 0;
        }

        // Check for status bar and fullscreen app mode
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        device.statusBar = false;
        if (device.webView && (windowWidth * windowHeight === screen.width * screen.height)) {
            device.statusBar = true;
        }
        else {
            device.statusBar = false;
        }


        // Pixel Ratio
        device.pixelRatio = window.devicePixelRatio || 1;
        classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
        if (device.pixelRatio >= 2) {
            classNames.push('retina');
        }

        // OS classes
        if (device.os) {
            classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
            if (device.os === 'ios') {
                var major = parseInt(device.osVersion.split('.')[0], 10);
                for (var i = major - 1; i >= 6; i--) {
                    classNames.push('ios-gt-' + i);
                }
            }

        }
        // Status bar classes
        if (device.statusBar) {
            classNames.push('with-statusbar-overlay');
        }
        else {
            $('html').removeClass('with-statusbar-overlay');
        }


        // keng..
        device.isWeixin = /MicroMessenger/i.test(ua);
    }

    // Add html classes
    if (classNames.length > 0){
        $('html').addClass(classNames.join(' '));
    }

    ipu.device = device;
})(ipu || window, jQuery);


        // 初始化代码
        jQuery(function () {
            FastClick.attach(document.body);
        });

        return ipu;
    }

    // todo:可以添加一个和其它库的适配处理，
    // 这里假设第三方库，jquery，iScroll，Hammer的史称已经固定
    if ( typeof define === "function" && define.amd ) {
        define(['jquery', 'iScroll', 'Hammer', 'FastClick'], function (jQuery, iScroll, Hammer, FastClick) {
            return window.ipu = setup(jQuery, iScroll, Hammer, FastClick);
        });
    } else {
        window.ipu = setup(window.jQuery, window.iScroll, window.Hammer, window.FastClick);
    }
})();

//# sourceMappingURL=ipu.js.map
