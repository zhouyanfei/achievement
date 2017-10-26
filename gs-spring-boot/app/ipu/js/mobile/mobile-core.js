if(typeof PluginManager === "undefined"){
	window.PluginManager = {
		    exec: function(arg0, arg1, arg2) {
		        prompt('_$$_SafelyJsInterface:_' + JSON.stringify({
		            inf: 'PluginManager',
		            func: 'exec',
		            args: [arg0, arg1, arg2]
		        }));
		    },
	};
}