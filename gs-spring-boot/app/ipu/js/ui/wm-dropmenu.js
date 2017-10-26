/* Attention: 
 * if use "iscroll5" component for 'wm-dropmenu'-element's ancestor,
 * pleas don't set transform property，transform property will make "position-fixed" like "position-absolute";
 * example:
 * 		new IScroll("#content",{tap:true,scrollbars: true,useTransform:false});  
 */
define(["jcl","wmWebUI"],function($,WmWebUI){
	/*下拉菜单构造方法*/
	function WmDropmenu(id) {
		this.items = new Array();
		var dropmenu = WmWebUI.getElement(id);
		/* 使用children方法代替子元素选择器，是为了防止有子元素误判 */
		this.selectLabel = dropmenu.children("div").eq(0).children("span").eq(0);
		this.menu = dropmenu.children("div").eq(1);
		this.closeAction;// 关闭事件
		this.openAction;// //打开事件
		WmWebUI.store(id, this);
	}
	/*下拉菜单项构造方法*/
	function WmDropmenuItem(parent, index, domElement) {
		this.parent = parent; //父对象
		this.index = index; //菜单项序号
		this.domElement = domElement; //菜单项dom元素
		this.action;  //菜单项点击事件
		if(domElement.id){
			WmWebUI.store(domElement.id, this);
		}
		var that = this;
		$(this.domElement).tap(function() {
			that.action && that.action(that);
		});
	}
	/*移除下拉菜单项*/
	WmDropmenuItem.prototype.remove = function() {
		this.domElement.parentNode.removeChild(this.domElement);
		this.parent.items.splice(this.index, 1);//删除第index个元素
		for ( var i = this.index; i < this.parent.items.length; i++) {
			this.parent.items[i].index = i;
		}
		this.parent.initMenu();
	}
	/*设置或返回下拉菜单项的html*/
	WmDropmenuItem.prototype.html = function(html) {
		if (html == undefined) {
			return this.domElement.innerHTML;
		} else {
			this.domElement.innerHTML = html;
		}
	}
	/*设置下拉菜单项的事件*/
	WmDropmenuItem.prototype.setAction = function(action) {
		this.action = action;
	}
	/*获取下拉菜单项的序号*/
	WmDropmenuItem.prototype.getIndex=function(){
		return this.index;
	}
	/*初始化下拉菜单*/
	WmDropmenu.prototype.initMenu=function(){
		this.menu.css("display","");
		//设置 dropmenu
		//初始化（CSS已将它默认放到了界面之外，以下设置不会造成闪烁）
		this.menu.children("ul").css("top",(this.menu.height())*(-1) + "px");
		this.menu.children("ul").css("transition","-webkit-transform 0.2s ease-out");
		this.menu.children("ul").css("-webkit-transition","transform 0.2s ease-out");
		this.selectLabel.children(".e_ico-unfold").css("transition","transform 0.2s ease-out");
		this.selectLabel.children(".e_ico-unfold").css("-webkit-transition","-webkit-transform 0.2s ease-out");
		this.menu.css("visibility","hidden");
		//位置
		this.menu.css("left",this.selectLabel.offset().left + this.selectLabel.width() - this.menu.width());//靠右要减去这两个 width()，靠左则不需要
		this.menu.css("top",this.selectLabel.offset().top + 1.1 * this.selectLabel.height());/*modified*/
		this.menu.css("display","none");
		this.menu.css("visibility","visible");
	}
	WmDropmenu.prototype.create = function() {
		var that = this;
		var lis = this.menu.children("ul").children("li");
		lis.each(function(index) {
			that.items.push(new WmDropmenuItem(that, index, this));
		});

		this.initMenu();
		// 显隐
		this.selectLabel.tap(function() {
			if (that.invisible()) {
				that.show();
			} else {
				that.hidden();
			}
		});
	};
	/*获取下拉菜单项*/
	WmDropmenu.prototype.getDropmenuItem = function(index){
		return this.items[index];
	}
	/*获取下拉菜单项集合*/
	WmDropmenu.prototype.getDropmenuItems = function() {
		return this.items;
	};
	/*判断下拉菜单是否可见*/
	WmDropmenu.prototype.invisible = function() {
		return this.menu.css("display") == "none";
	};
	/*显示下拉菜单*/
	WmDropmenu.prototype.show = function() {
		this.openAction && this.openAction();
		this.menu.css("display", "block");
		this.menu.children("ul").css("transform","translateY(" + this.menu.height() + "px)");
		this.menu.children("ul").css("-webkit-transform","translateY(" + this.menu.height() + "px)");
		this.selectLabel.find(".e_ico-unfold").css("transform","rotate(180deg)");
		this.selectLabel.find(".e_ico-unfold").css("-webkit-transform","rotate(180deg)");
	};
	/*隐藏下拉菜单*/
	WmDropmenu.prototype.hidden = function(){
		this.closeAction && this.closeAction();;
		this.menu.children("ul").css("transform","translateY(0)");
		this.menu.children("ul").css("-webkit-transform","translateY(0)");
		this.selectLabel.find(".e_ico-unfold").css("transform","rotate(0)");
		this.selectLabel.find(".e_ico-unfold").css("-webkit-transform","rotate(0)");
		this.menu.css("display","none");
	};
	/*删除所有下拉菜单项*/
	WmDropmenu.prototype.removeAll = function() {
		this.menu.children("ul")[0].innerHTML = "";
		this.items = new Array();
	};
	/*添加下拉菜单项*/
	WmDropmenu.prototype.push = function(obj){
		this.menu.children("ul").append("<li>"+obj+"</li>");
		this.initMenu();
		var lis = this.menu.children("ul").children("li");
		var item = new WmDropmenuItem(this,lis.length-1,lis.last()[0]);
		this.items.push(item);
		return item;
	};
	/*设置下拉菜单文本 */
	WmDropmenu.prototype.setLabel = function(label) {
		this.selectLabel.children("span")[0].innerHTML = label;
	};
	/*获取下拉菜单文本 */
	WmDropmenu.prototype.getLabel = function() {
		return this.selectLabel.children("span")[0].innerHTML;
	};
	/*设置下拉菜单打开事件 */
	WmDropmenu.prototype.setOpenAction = function(callback) {
		this.openAction = callback;
	};
	/*设置下拉菜单关闭事件 */
	WmDropmenu.prototype.setCloseAction = function(callback) {
		this.closeAction = callback;
	};
	return WmDropmenu;
});
