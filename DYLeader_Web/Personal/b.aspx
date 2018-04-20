<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title></title>
    <link href="../lib/h-ui/css/H-ui.min.css" rel="stylesheet" />
    <link href="../lib/controls/btctable/style.css" rel="stylesheet" />
</head>
<body>
    <table>
        <tr id="test">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </table>

    <script src="../lib/jquery/jquery-1.11.3.min.js"></script>
    <script src="../lib/h-ui/js/H-ui.min.js"></script>
    <script src="../lib/ajaxupload.js"></script>
    <script src="../lib/layer/layer.js"></script>
    <script src="../lib/Validform/Validform_v5.3.2.js"></script>
    <script src="../lib/Validform/Validform_Datatype.js"></script>
    <script src="../lib/My97DatePicker/WdatePicker.js"></script>
    <script src="../lib/controls/NameBox/namebox.js"></script>
    <script src="../lib/jquery.form.js"></script>
    <script src="../lib/common.js"></script>
    <script src="../lib/jquery.ext.js"></script>
    <script src="../script/common.js"></script>
    <script src="../lib/controls/btctable/control.js"></script>
    <script>
        var testDatas = [
            { a:"张三", b: "党员", c: 3, d: 4, e: 5 },
            { a: "aaaa", b: 12, c: 13, d: 41, e: 15 },
            { a: 12, b: 22, c: 23, d: 24, e: 25 }
	];
        insertBefore('#test', testDatas, [1, 2, 1, 1, 1], 'a', 'b', 'd', 'c', 'e');

        function insertBefore(target, datas, template) {
            //target : 要在哪个之前插入，如上面的 '#test'
            //datas: 如上面所示，如果用$.mvcData.get()方式调用的，格式为 $.mvcData.get().rows
            //template 示例：[1,1,1,1,3], 为各列的合并列数
            //后面的参数是各列的 key
            var args = arguments;
            var keys = [];
            var trs = [];
            var tdTemplate = '<td colspan="{0}">{1}</td>';
            for (var i = 3; i < args.length; i++) {
                keys.push(args[i]);
            }

            for (var j = 0; j < datas.length; j++) {
                var info = datas[j];
                var tds = [];
                for (var k = 0; k < keys.length; k++) {
                    tds.push(tdTemplate.format(template[k], info[keys[k]]));
                }
                trs.push('<tr>' + tds.join('') + '</tr>');
            }

            //如果要在后面插入，把下面的 before 改为 after 即可
            $(target).before(trs.join(''));
        }
    </script>
</body>
</html>