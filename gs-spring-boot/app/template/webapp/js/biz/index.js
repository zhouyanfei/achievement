require(["ipu", "jquery"], function (ipu, $) {
    // 通用
    var length = -1;
    var achievelist;
    $.ajax({
        type:"POST",
        url:"/achieve",
        async:false,
        success:function(list){
            achievelist = list;
            length = achievelist.length;
        },
        error:function(){
            alert("登录失败，网络异常，请检查您的网络配置是否正常！");
        }
    });

    $.ajax({
        type:"POST",
        url:"/achNum",
        async:false,
        success:function(list){
            var tbody = "<ul>";
            for(var i=0; i<list.length; i++){
                var trs = "";
                trs += '<li class="ipu-list-item"><div class="ipu-list-item-media"></div><div class="ipu-list-item-inner"><div class="ipu-list-item-title">'+list[i].user_name +'</div><div class="ipu-list-item-after"><span class="label">挑战数：</span><span class="value ipu-txt-highlight">' +list[i].challenge_num +'</span><span class="label">完成数：</span><span class="value ipu-txt-success">'+ list[i].complete_num + '</span></div></div></li>';
                tbody += trs;
            }
            tbody += "</ul>";
            $("#UserachNum").append(tbody);
        }
    });

    $.ajax({
        type:"POST",
        url:"/myach_ing",
        async:false,
        success:function(list){
            if(list==null)
                window.location.href = "login.html";
            var tbody = "<ul>";
            for(var i=0; i<list.length; i++){
                var trs = "";
                trs += '<li class=""><a class="ipu-list-item ipu-list-item-link" href="/searchAchById?id='+list[i].ach_id+'&state=0"><div class="ipu-list-item-media"><img src="img/logo.png" alt="" class="achieve-medal"></div><div class="ipu-list-item-inner"><div class="ipu-list-item-title-row"><div class="ipu-list-item-title">' + list[i].ach_name +'</div></div></div></a></li>';
                tbody += trs;
            }
            tbody += "</ul>";
            $("#myach_ing").append(tbody);
        }
    });

    $.ajax({
        type:"POST",
        url:"/myach_ed",
        async:false,
        success:function(list){
            if(list==null)
                window.location.href = "login.html";
            var tbody = "<ul>";
            for(var i=0; i<list.length; i++){
                var trs = "";
                trs += '<li class=""><a class="ipu-list-item ipu-list-item-link" href="/searchAchById?id='+list[i].ach_id+'&state=1"><div class="ipu-list-item-media"><img src="img/logo.png" alt="" class="achieve-medal"></div><div class="ipu-list-item-inner"><div class="ipu-list-item-title-row"><div class="ipu-list-item-title">' + list[i].ach_name + '</div></div></div></a></li>';
                tbody += trs;
            }
            tbody += "</ul>";
            $("#myach_ed").append(tbody);
        }
    });

    $(function () {

        // 初始化底部导航
        var navBar = ipu.navBar(".ipu-navbar", { animate: false });

        // 进入详情页
        $("body").on("click", ".list-medal li", function () {
            window.location.href= "achieve-detail.html";
        });
    });

    // 首页
    $("#login_out").click(function(){
        window.location.href = "/loginout";
    });



    function showachieve(nowPage){
        //------------遍历List集合 .each的使用-------------
        var tbody = "";
        for(var i=3*nowPage,j=0; i<length&&j<3; i++,j++){
            var trs = "";
            trs += '<li><a class="ipu-list-item ipu-list-item-link" href="/searchAchById?id='+achievelist[i].ach_id+'&state=-1"><div class="ipu-list-item-media"><img src="img/logo.png" alt="" class="achieve-medal"></div><div class="ipu-list-item-inner"><div class="ipu-list-item-title-row"><div class="ipu-list-item-title">' +achievelist[i].ach_name +'</div></div><div class="ipu-list-item-subtitle\"><div class="media-info"><div class="media-info-row\"><span class="label">生效时间：</span><span class="value">' + achievelist[i].start_time +'</span></div><div class="media-info-row"><span class="label">失效时间：</span><span class="value">'+achievelist[i].end_time +'</span></div><div class="media-info-row"><span class="label">总挑战人数：</span><span class="value">'+ achievelist[i].challenge_num+'</span></div><div class="media-info-row"><span class="label">已完成人数：</span><span class="value">'+achievelist[i].complete_num +'</span></div><div class="media-info-row media-info-row-desc"><span class="label\">成就说明：</span><span class="value ipu-fn-txt-row-2">'+achievelist[i].ach_introduc+'</span></div></div></div></div></a></li>';
            tbody += trs;
        }
        $("#Achieve_list").append(tbody);
    }
    $(function () {
        // 添加下拉刷新功能
        var contObj = $(".page-index .ipu-flex-content"); //内容展示区
        var myRefresh = null;
        var totalPage = (length/3).toFixed(0);  // 假设总页数
        var nowPage = 0;    // 当前显示第几页，因为默认有一些数据了，所以为1

        function addData(refresh) {// 0搜索，1刷新，2加载更多
            setTimeout(function () { // 模拟延时加载
                    myRefresh.enableTop(totalPage != 0); // 假设totalPage为0时表示没数据，此时停用刷新功能，也可不停用，强行刷新
                    myRefresh.enableBottom(nowPage < totalPage); // enable应该总是先于endBottom/TopLoading方法执行

                    if(totalPage ==0){
                        $('<div class="no-result-msg">未查询到数据</div>').appendTo(contObj);
                    }else{
                        if (refresh ) {                    // 顶部刷新，刷新也可能已经没有数据了，待处理
                            $("#Achieve_list").empty(); // 清空已有内容
                            showachieve(0);
                            myRefresh.endTopLoading(); //最后调用
                        } else {  // 底部加载更多,或查询
                            showachieve(nowPage++);
                            myRefresh.endBottomLoading();  //最后调用
                        }
                    }
            }, 3000);
        }

        function refreshData() {   // 刷新数据
            nowPage = 0; // 底部加载时，取消底部加载
            myRefresh.enableBottom(false);
            if(myRefresh.bottomLoading){
                myRefresh.endBottomLoading();
            }
            addData(true);
        }

        // 初始化下拉刷新
        myRefresh = ipu.refresh(contObj, {
            bottomLoadFun: function () { // 加载更多
                console.log('加载更多'); // 手势上拉，内容下滚动动
                addData();
            },
            topLoadFun: function () { // 刷新
                console.log('刷新数据'); // 手势下拉，内容上滚动
                refreshData();
            }
        });
    });

    // 我的成就页
    $(function () {
       ipu.tab(".ipu-tab");
        // 添加刷新功能

    });
});