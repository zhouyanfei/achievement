require(["ipu", "jcl","tap"], function (ipu, $) {
    $(function () {
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
            ipu.confirm('请确认你的操作?', function () {
                ipu.alert('你点击了确定按钮!');
            });
        });
        $content.on('click', '.prompt-ok', function () {
            ipu.prompt('请输入你的内容?', function (value) {
                ipu.alert('你输入的内容是"' + value + '"');
            });
        });

        $content.on('click', '.showPreloader', function () {
            ipu.showPreloader('正在加载中');
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
                    color: 'warning',
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
                    bg: 'warning'
                }
            ];
            var groups = [buttons1, buttons2];
            ipu.actions(groups);
        });

        $content.on('click', '.toast', function () {
            ipu.toast('操作成功！');
        });
    });
});
