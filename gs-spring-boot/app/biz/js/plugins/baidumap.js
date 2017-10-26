require(["domReady!","wadeMobile","jcl","iScroll","tap"],function(doc,WadeMobile,$,iScroll){
	var iscroll=new iScroll("scroll-container");
	//定位
	$("#baiduLocation").tap(function(){
		WadeMobile.baiduLocation(function(info){
			$("#locationDesc").html(info);
			iscroll.refresh();
		});
	})
	//地图定位
	$("#baiduMapLoc").tap(function(){
		WadeMobile.baiduMapLocation();
	})
	//单点定位标注
	$("#baiduMapPointSin").tap(function(){
		var param = new $.DataMap();
		param.put("Latitude",28.1953);
		param.put("Longitude",112.9886);
		WadeMobile.baiduMapPosition(param);
	})
	//多点定位标注
	$("#baiduMapPointMul").tap(function() {
		var list = new $.DatasetList();
		var data1=new $.DataMap();
		data1.put("Latitude", 39.963175);
		data1.put("Longitude", 116.400244);
		list.add(data1);
		
		var data2=new $.DataMap();
		data2.put("Latitude", 39.942821);
		data2.put("Longitude", 116.369199);
		list.add(data2);
	
		var data3=new $.DataMap();
		data3.put("Latitude", 39.939723);
		data3.put("Longitude", 116.425541);
		list.add(data3);
		
		var data4=new $.DataMap();
		data4.put("Latitude", 39.906965);
		data4.put("Longitude", 116.401394);
		list.add(data4);
		
		WadeMobile.baiduMapPosition(list);
	})
	//点击钻取
	$("#clickBaiduMap").tap(function(){
		WadeMobile.clickBaiduMap(function(info) {
			var data = new $.DataMap(info);
			var lat = data.get("lat");
			var lon = data.get("lon");
			var poiName = data.get("poiName");
			if(poiName == undefined){
				poiName = "";
			}
			var str = "纬度：" + lat + ";经度：" + lon + ";" + poiName;
			iscroll.refresh();
			alert(str);
		});
	})
	//添加覆盖物
	$("#baiduMapAddpolygon").tap(function() {
		var list = new $.DatasetList();
		
		var data1 = new $.DataMap();
		data1.put("Latitude", 39.93923);
		data1.put("Longitude", 116.357428);
		list.add(data1);
		
		var data2=new $.DataMap();
		data2.put("Latitude", 39.91923);
		data2.put("Longitude", 116.327428);
		list.add(data2);
	
		var data3=new $.DataMap();
		data3.put("Latitude", 39.89923);
		data3.put("Longitude", 116.347428);
		list.add(data3);
		
		var data4=new $.DataMap();
		data4.put("Latitude", 39.89923);
		data4.put("Longitude", 116.367428);
		list.add(data4);
		
		var data5 = new $.DataMap();
		data5.put("Latitude", 39.91923);
		data5.put("Longitude", 116.387428);
		list.add(data5);
		WadeMobile.addPolygon(list);
	})
	//poi检索
//	$("#baiduMapPoiSearch").tap(function(){
//		WadeMobile.baiduMapPoiSearch();
//	})
	$("#bdPoiCitySearch").tap(function() {
		var city = "长沙";
		var keyword = "联通";
		WadeMobile.poiCitySearch(city,keyword);
	})
	$("#bdPoiNearbySearch").tap(function() {
		var latlonMap = new $.DataMap();
		latlonMap.put("Latitude",28.1953);
		latlonMap.put("Longitude",112.9886);
		var radius = 500;
		var keyword = "联通";
		WadeMobile.poiNearbySearch(latlonMap,radius,keyword);
	})
	$("#bdPoiBoundsSearch").tap(function() {
		var swData = new $.DataMap();
		swData.put("Latitude",39.92235);
		swData.put("Longitude",116.380338);
		var neData = new $.DataMap();
		neData.put("Latitude",39.947246);
		neData.put("Longitude",116.414977);
		var keyword = "联通";
		WadeMobile.poiBoundsSearch(swData,neData,keyword);
	})
	//lbs检索
	$("#bdLbsLocalSearch").tap(function() {
		var ak = "B266f735e43ab207ec152deff44fec8b";
		var geoTableId = 31869;
		var region = "北京市";
		var q = "天安门";
		WadeMobile.lbsLocalSearch(ak,geoTableId,q,region);
	})
	$("#bdLbsNearbySearch").tap(function() {
		var ak = "D9ace96891048231e8777291cda45ca0";
		var geoTableId = 32038;
		var locdata = "116.403689,39.914957";
		var radius = 30000;
		var q = "";
		WadeMobile.lbsNearbySearch(ak,geoTableId,q,locdata,radius);
	})
	$("#bdLbsBoundsSearch").tap(function() {
		var ak = "B266f735e43ab207ec152deff44fec8b";
		var geoTableId = 31869;
		var bounds = "116.401663,39.913961;116.406529,39.917396";
		var q = "天安门";
		WadeMobile.lbsBoundsSearch(ak,geoTableId,q,bounds);
	})
});