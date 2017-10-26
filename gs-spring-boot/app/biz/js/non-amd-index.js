$(function () {
    var navBar = ipu.navBar(".ipu-navbar", {
        animate: true
    });
    // new iscroll("scrollDemo"); // 第一页设置滚动


    $(".ipu-slider li").click(function () {
        console.log('click');
    });

    // 实际上没有tap事件，没有引入相关js
    $(".ipu-slider a").on('tap', function () {
        console.log('tap');
    });


    var $content = $(document);
    $content.on('click', '.alert-text', function () {
        ipu.alert('这是一段提示消息');
    });

    $content.on('click', '.alert-text-title', function () {
        ipu.alert('这是一段提示消息', '这是自定义的标题!');
    });

    $content.on('click', '.alert-text-title-callback', function () {
        ipu.alert('这是自定义的文案', '这是自定义的标题!', function () {
            ipu.alert('你点击了确定按钮!')
        });
    });
    $content.on('click', '.confirm-ok', function () {
        ipu.confirm('你确定吗?', function () {
            ipu.alert('你点击了确定按钮!');
        });
    });
    $content.on('click', '.prompt-ok', function () {
        ipu.prompt('你叫什么问题?', function (value) {
            ipu.alert('你输入的名字是"' + value + '"');
        });
    });

    $content.on('click', '.showPreloader', function () {
        ipu.showPreloader('你叫什么问题?');
        setTimeout(function () {
            ipu.hidePreloader();
        }, 3000);
    });
    $content.on('click', '.showIndicator', function () {
        ipu.showIndicator();
        setTimeout(function () {
            ipu.hideIndicator();
        }, 3000);
    });

    $content.on('click', '.action', function () {
        var buttons1 = [
            {
                text: '请选择',
                label: true
            },
            {
                text: '卖出',
                bold: true,
                color: 'danger',
                onClick: function () {
                    ipu.alert("你选择了“卖出“");
                }
            },
            {
                text: '买入',
                onClick: function () {
                    ipu.alert("你选择了“买入“");
                }
            }
        ];
        var buttons2 = [
            {
                text: '取消',
                bg: 'danger'
            }
        ];
        var groups = [buttons1, buttons2];
        ipu.actions(groups);
    });

    $content.on('click', '.popup', function () {
        ipu.popup();
    });

    $content.on('click', '.toast', function () {
        ipu.toast('test', 5000);
    });

    $("#processBar").on("click", function () {
        window.location.href = 'progressBar.html';
    });
    $("#slider").on("click", function () {
        window.location.href = 'slider.html';
    });
});
