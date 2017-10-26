require(["domReady!","mobile", "jcl","iScroll","tap"], function(doc,Mobile,$,iScroll) {
	new iScroll("scroll-container");
	
	var dbName = "display", tableName = "student";
	//数据信息
	var Person = {
		numbers : [201601,201602,201603,201604,201605,201606,201607,201608],
		names : ["Abby","John","Carol","Cindy","Dave","Tony","Lisa","Brady"],
		ages : [19,23,18,21,25,20,22,17],
		sexs : ["F","M","F","F","M","M","F","M"],
		isValid : [true,true,true,true,true,true,true,true],
		getPerson : function(){
			if($("#tbody").children("TR").length == this.names.length)
				return [];
			
			var index = 0;
			while(! this.isValid[index])
				index++;
			this.isValid[index] = false;
			
			return [this.numbers[index], this.names[index], this.ages[index], this.sexs[index++]];
		},
		removePerson : function(number){
			for(var i = 0, len = this.numbers.length; i < len; i++)
				if(this.numbers[i] == parseInt(number)){
					this.isValid[i] = true;
					break;
				}
		}
	};
	//建表
	$("#create").tap(function() {
		//建表语句
		var createSql = "CREATE TABLE IF NOT EXISTS " + tableName
				+ "(stu_no integer PRIMARY KEY NOT NULL, "
				+ " stu_name varchar(10) ,"
				+ " stu_age integer ,"
				+ " stu_sex varchar(1))";
		Mobile.execSQL(dbName, createSql, null, null, null, function(result){
			if("YES" != result)
				alert("新建表失败[" + result + "]！");
			//开放功能
			funcControl("insert", "e-enable");
			funcControl("drop", "e-enable");
		});
	});
	//查询数据
	var queryAll = function() {
		var columns = ["stu_name","stu_age","stu_sex", "stu_no"];//查询字段
		
		var condSQL = "STU_AGE = :VSTU_AGE";
		var conds = new $.DataMap();	//查询条件 可以是个空的DataMap(),也可以是null
		conds.put("STU_AGE", "19"); //注意：拼装的条件只能是等于，如：stu_age=19，而不能是stu_age>19
		
		WadeMobile.select(dbName,tableName,columns,null,null,null,null,function(obj){qryResultDeal(obj, columns)});
	};
	//查询第一条数据
	var queryFirst = function() {
		var columns = ["stu_name","stu_age","stu_sex"];//查询字段
		
		var condSQL = "STU_AGE = :VSTU_AGE";
		var conds = new $.DataMap();	//查询条件 可以是个空的DataMap(),也可以是null
		conds.put("STU_AGE", "19"); //注意：拼装的条件只能是等于，如：stu_age=19，而不能是stu_age>19
		
		WadeMobile.selectFirst(dbName, tableName, columns, condSQL, conds, function(obj){qryResultDeal(obj, columns)});
	};
	//查询数据  selectExecSQL
	var queryBySplit = function() {
		//查询语句不能出现“*”
		var sql = "select stu_no,stu_name,stu_age,stu_sex from " + tableName + " where stu_name=:VSTU_NAME and stu_age=:VSTU_AGE and stu_sex=:VSTU_SEX";
		var params = new $.DataMap();//查询字段
		params.put("STU_NAME", "JACK");
		params.put("STU_AGE", "19");
		params.put("STU_SEX", "M");
		
		WadeMobile.execSQL(dbName, sql, params, 1, 1, function(obj){qryResultDeal(obj, ["stu_name","stu_age","stu_sex"])});
	};
	
	//新增数据
	$("#insert").tap(function() {
		if($("#insert").attr("disabled") == "true"){
			return;
		}
		var per = Person.getPerson();
		if(per.length == 0){
			alert("数据太多影响阅读~")
			return;
		};
		var param = new $.DataMap();
		param.put("STU_NO", per[0]);
		param.put("STU_NAME", per[1]);
		param.put("STU_AGE", per[2]);
		param.put("STU_SEX", per[3]);
		Mobile.insert(dbName, tableName, param, function(result){
			if("YES" != result)
				alert("新增数据失败[" + result + "]！");
			
			queryAll();
		});
	});
	
	$("#update").tap(function() {
		//修改数据
		var updateSql = "UPDATE " + tableName + " SET stu_name = :VSTU_NAME, stu_age = :VSTU_AGE WHERE stu_no = :VSTU_NO";
		
		var param = new $.DataMap();
		param.put("STU_NAME", "Dave");
		param.put("STU_AGE", "19");
		param.put("STU_NO", "2015001");
		
		Mobile.execSQL(dbName, updateSql, param, null, null, function(result){
			if("YES" != result)
				alert("更新数据失败[" + result + "]！");
			
			queryAll();
		});
	});
	
	$("#drop").tap(function() {
		if($("#drop").attr("disabled") == "true"){
			return;
		}
		//删除表格
		var dropSql = "DROP TABLE " + tableName ;
		
		Mobile.execSQL(dbName, dropSql, null, null, null, function(result){
			if("YES" != result){
				alert("删除表失败[" + result + "]！");
				queryAll();
			}else{
				//删表，新增不能使用
				funcControl("insert", "e-disable");
				funcControl("drop", "e-disable");
				//移除所有数据
				$("#tbody").children("tr").remove();
			}
		});
	});
	
	//处理查询语句结果集
	var qryResultDeal = function(obj, qryCols){
		var result = JSON.parse(obj); //解析成JSON
		var childObjStr = "";		  //子元素
		$("#tbody").children("tr").remove();//删除表格内容
		
		for(var i = 0, length = result.length; i < length; i++){
			childObjStr += "<tr>";
			var stuItem = result[i];
			//因为从后台取到得值进过hash散列，所以需要通过“查询列”取对应字段值；学号字段隐藏
			for(var x = 0, len = qryCols.length - 1; x < len; x++){
				var columnVal = stuItem[qryCols[x].toUpperCase()];//获取字段值
				if(typeof(columnVal) != "undefined")//过滤查询字段中冗余字段（表中不存在的字段）
					childObjStr += "<td>" + columnVal + "</td>";
			}
			var stuNo = stuItem[qryCols[qryCols.length - 1].toUpperCase()];
			childObjStr += "<td><button class='ipu-btn ipu-btn-danger' stu_no='" + stuNo + "'>删除</button></td></tr>";
		}
		//将子元素节点添加到表格中
		$("#tbody").append($(childObjStr));
		
		//绑定删除按钮元素动作
		$("#tbody").find(".ipu-btn-danger").each(function(){
			$(this).tap(function() {
				var condSQL = "STU_NO = :VSTU_NO", stuNo = $(this).attr("STU_NO");
				var param = new $.DataMap();
				param.put("STU_NO", stuNo);
				
				Mobile.delete(dbName, tableName, condSQL, param, function(result){
					if("YES" != result)
						alert("删除数据失败[" + result + "]！");
					
					queryAll();
				});
				Person.removePerson(stuNo);
			});
		});
	};
	
	//关/开 功能
	var funcControl = function(obj, classStr){
		var operObj = $("#" + obj);
		if("e-disable" == classStr){
			operObj.attr("disabled", true);
		}else{
			operObj.removeAttr("disabled");
		}
	};
	//初始化动作
	funcControl("insert", "e-disable");
	funcControl("drop", "e-disable");
	
	//删除表信息
	var sql = "DROP TABLE " + tableName;
	Mobile.execSQL(dbName, sql, null, null, null, null, null);
});
