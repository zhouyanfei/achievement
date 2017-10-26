define(["module","tap","jcl"],function(module,tap,$){
	var popup;
	function createNew(popupDom) {
		popup = typeof popupDom == 'object' ? popupDom : document.getElementById(popupDom);
		for (var i = 1; i < arguments.length; i++) {
			var o = typeof arguments[i] == 'object' ? arguments[i] : document.getElementById(arguments[i]);
			$(o).tap(function(){
				if(popup.className == "c_popup") {
					popup.className = "c_popup c_popup-view";
				} else {
					popup.className = "c_popup";
				}
			});
		}
		return popup;
	}
	module.exports = function(){
		var popup = createNew.apply(null,arguments);
		
		this.show = function(){
			popup.className = "c_popup c_popup-view";
		}
		
		this.hide = function(){
			popup.className = "c_popup";
		}
	}
})