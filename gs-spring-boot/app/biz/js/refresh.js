require(["ipu"], function (ipu) {

    var total = 35; // 总数
    var index = 10; // 数据索引
    var size = 10;  // 每次加载数据量
    var myRefres = null;

    function addData(refresh) {
        setTimeout(function () {
            if (refresh) {
                $(".refresh-content ul").empty();
                // 刷新时，上一次的未完成的底部加载理论上应该，直接调用endBottomLoading来结束掉，不改变内容，此处未处理
            }

            var html = "";
            for (var i = 0; i < size && index < total; i++) {
                index++;
                html += " <li>" + (index) + "总共有" + total + "条数据，下拉刷新，上拉加载更多 </li>"
            }

            // 应该要做一个判断，理论上不应该两个同时触发，同时触发，同时修改index变量，可能会导致问题
            $(".refresh-content ul").append(html);

            // enable应该先于end方法调用
            if (refresh) {
                myRefres.enableBottom(true); // enable应该总是先于endBottom/TopLoading方法执行
                myRefres.endTopLoading();
            } else {
                if (index == total) {
                    myRefres.enableBottom(false);
                }
                myRefres.endBottomLoading();
            }
        }, 2000);
    }

    function refreshData() {
        index = 0;
        addData(true);
    }


    $(function () {
        myRefres = ipu.refresh(".ipu-flex-content", {
            topLoadFun: function () {
                console.log('pull down');
                refreshData();
            },
            bottomLoadFun: function () {
                console.log('pull up');
                addData();
            },
            iScrollOptions: {
                vScrollbar: false,
                onScrollMove: function () {

                }
            }
        });
    });
});
