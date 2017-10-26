require(['domReady!','icharts'],function(doc,iChart){
	var data = [
		{
			name : '北京',
			value:[-9,1,12,20,26,30,32,29,22,12,0,-6],
			color:'#1f7e92',
		    line_width:2
		}
	];
       
	var chart = new iChart.Area2D({
			render : 'canvasDiv',
			data: data,
			title : '北京2012年平均温度情况',
			coordinate:{height:'90%',background_color:'#edf8fa'},
			sub_option:{
				hollow_inside:false,//设置一个点的亮色在外环的效果
				point_size:10
			},
			labels:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"]
		});
	
	chart.draw();
});