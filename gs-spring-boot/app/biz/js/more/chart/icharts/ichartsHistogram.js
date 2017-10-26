require(['domReady!','icharts'],function(doc,iChart){
	var data = [
    	{name : 'IE',value : 35.75,color:'#a5c2d5'},
    	{name : 'Chrome',value : 29.84,color:'#cbab4f'},
    	{name : 'Firefox',value : 24.88,color:'#76a871'},
    	{name : 'Safari',value : 6.77,color:'#9f7961'},
    	{name : 'Opera',value : 2.02,color:'#a56f8f'},
    	{name : 'Other',value : 0.73,color:'#6f83a5'}
	];
	
	new iChart.Column2D({
		render : 'canvasDiv',
		data: data,
		title : 'Top 5 Browsers from 1 to 29 Feb 2012',
		showpercent:true,
		decimalsnum:2,
		coordinate:{
			background_color:'#fefefe',
			scale:[{
				 position:'left',	
				 start_scale:0,
				 end_scale:40,
				 scale_space:8,
				 listeners:{
					parseText:function(t,x,y){
						return {text:t+"%"}
					}
				}
			}]
		}
	}).draw();
});