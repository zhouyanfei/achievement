require(['ipu', 'jquery'], function (ipu, $) {

    var LV1Picker = ipu.popPicker({layer:1});
    var LV2Picker = ipu.popPicker({layer: 2});
    var provinces = [
        { text: '123湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南123123湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南123', value: 'HN', data:[
            {text:'长沙', value:'CS'},
            {text:'邵阳', value:'SY'},
            {text:'常德', value:'CD'},
            {text:'湘西', value:'CD'},
            {text:'岳阳', value:'CD'}
        ] },
        { text: '湖北', value: 'HB' , data:[
            {text:'武汉', value:'CS'},
            {text:'天门', value:'SY'},
            {text:'常德', value:'CD'},
            {text:'湘西', value:'CD'},
            {text:'岳阳', value:'CD'}
        ] },
        { text: '江西', value: 'JX' },
        { text: '北京', value: 'JX' },
        { text: '广东', value: 'JX' },
        { text: '上海', value: 'JX' },
        { text: '上海', value: 'JX' },
        { text: '江西', value: 'JX' },
        { text: '北京', value: 'JX' },
        { text: '广东', value: 'JX' },
        { text: '上海', value: 'JX' },
        { text: '上海', value: 'JX' },
        { text: '江西', value: 'JX' },
        { text: '北京', value: 'JX' },
        { text: '广东', value: 'JX' },
        { text: '上海', value: 'JX' },
        { text: '上海', value: 'JX' },
        { text: '江西', value: 'JX' },
        { text: '北京', value: 'JX' },
        { text: '广东', value: 'JX' },
        { text: '上海', value: 'JX' },
        { text: '上海', value: 'JX' }
    ];

    LV1Picker.setData(provinces);
    LV2Picker.setData(provinces);

    $("#scrollDemo input[name='lv1']").click(function () {
        var self = $(this);
        LV1Picker.show(function (data) {
            console.dir(data);
            self.val(data.text);
        });
    });
    $("#scrollDemo input[name='lv2']").click(function () {
        var self = $(this);
        LV2Picker.show(function (data) {
            console.dir(data);
            $(self).val(data[0].text + " "+ data[1].text);
        });
    });

    var dataPicker1 = ipu.dtPicker({
    });
    var dataPicker2 = ipu.dtPicker({
        //beginDate: new Date(2005, 08, 08, 10, 00, 00),
        //endDate: new Date(2035, 08, 08, 22, 00, 00),
        beginDate: '2005-08-08 10:00',
        endDate: '2035-08-08 22:00',
        value: new Date(2022, 05, 12),
        type: 'date'
    });
    var dataPicker3 = ipu.dtPicker({
        beginDate: '10:00',
        endDate: '22:00',
        type: 'time'
    });
    var dataPicker4 = ipu.dtPicker({
        beginDate:'2017-09',
        value: "2017-04-21 21:12:12",
        type: 'month'
    });
    var dataPicker5 = ipu.dtPicker({
        type: 'hour'
    });

    $("#testDate1").focus(function () {
        var self = $(this);
        dataPicker1.show(function (data) {
            console.dir(data);
            self.val(dataPicker1.getSelected());
        });
    });

    $("#testDate2").focus(function () {
        var self = $(this);
        dataPicker2.show(function (data) {
            console.dir(data);
            self.val(dataPicker2.getSelected());
        });
    });

    $("#testDate3").focus(function () {
        var self = $(this);
        dataPicker3.show(function (data) {
            console.dir(data);
            self.val(dataPicker3.getSelected());
        });
    });
    $("#testDate4").focus(function () {
        var self = $(this);
        dataPicker4.show(function (data) {
            console.dir(data);
            self.val(dataPicker4.getSelected())
        });
    });
    $("#testDate5").focus(function () {
        var self = $(this);
        dataPicker5.show(function (data) {
            console.dir(data);
            self.val(dataPicker5.getSelected());
        });
    });



    var type = "date";
    var dataPicker6 = ipu.dtPicker({ type: type, hasClear: true});
    var dataPicker7 = ipu.dtPicker({ type: type, hasClear: true});
    $("#testDate6").click(function () {
        var self = $(this);
       /* if(self.val() != ""){
            dataPicker6.setSelectedValue(self.val());
        }*/
        dataPicker6.show(function () {
            var slt = dataPicker6.getSelected();
            self.val(slt);
            dataPicker7.setBeginDate(slt.value);
        });
    });
    $("#testDate7").click(function () {
        var self = $(this);
       /* if(self.val() != ""){
            dataPicker7.setSelectedValue(self.val());
        }*/
        dataPicker7.show(function (sltDate, index) {
            if(index == 1){
                var sltDate = dataPicker7.getSelected();
                self.val(sltDate);
                dataPicker6.setEndDate(sltDate.value);
            }else if(index == 2){
                self.val(""); // 清除按钮
            }
        });
    });
});
