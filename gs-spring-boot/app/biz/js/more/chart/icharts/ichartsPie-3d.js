require(['domReady!','icharts'],function(doc,iChart){
	var data = [
    	{name : 'Android',value : 52.5,color:'#4572a7'},
    	{name : 'IOS',value : 34.3,color:'#aa4643'},
    	{name : 'RIM',value : 8.4,color:'#89a54e'},
    	{name : 'Microsoft',value : 3.6,color:'#80699b'},
    	{name : 'Other',value : 1.2,color:'#3d96ae'}
	];
	
	var chart = new iChart.Pie3D({
		render : 'canvasDiv',
		data: data,
		title : {
			text : '3D饼图',
			height:40,
			fontsize : 30,
			color : '#282828'
		},
		sub_option : {
			mini_label_threshold_angle : 40,//迷你label的阀值,单位:角度
			mini_label:{//迷你label配置项
				fontsize:20,
				fontweight:600,
				color : '#ffffff'
			},
			label : {
				background_color:null,
				sign:false,//设置禁用label的小图标
				padding:'0 4',
				border:{
					enable:false,
					color:'#666666'
				},
				fontsize:11,
				fontweight:600,
				color : '#4572a7'
			},
			border : {
				width : 2,
				color : '#ffffff'
			},
			listeners:{
				parseText:function(d, t){
					return d.get('name') + "\n" + d.get('value')+"%";//自定义label文本
				}
			} 
		},
		shadow : true,
		shadow_blur : 6,
		shadow_color : '#aaaaaa',
		shadow_offsetx : 0,
		shadow_offsety : 0,
		background_color:'#f1f1f1',
		align:'right',//右对齐
		offsetx:-100,//设置向x轴负方向偏移位置60px
		offset_angle:-90,//逆时针偏移120度
		radius:150
	});
	
	chart.draw();
});