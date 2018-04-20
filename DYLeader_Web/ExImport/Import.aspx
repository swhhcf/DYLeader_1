<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title></title>
    <!--<link href="../static/h-ui/css/H-ui.min.css" rel="stylesheet" />-->
    <style>
        html, body {
            font-size: 14px;
        }

        .btn {
            background-color: rgb(90, 152, 222);
            border: 1px solid rgb(90, 152, 222);
            border-radius: 4px;
            color: rgb(255, 255, 255);
            cursor: pointer;
            font-size: 12px;
            height: 27px;
            line-height: 17px;
            margin-bottom: 0px;
            margin-left: 5px;
            margin-right: 0px;
            margin-top: 0px;
            padding-bottom: 3px;
            padding-left: 8px;
            padding-right: 8px;
            padding-top: 3px;
            text-align: center;
            vertical-align: middle;
            width: 80px;
        }

            .btn:hover {
                background-color: rgb(10,105,153)
            }

        .input-text {
            border: 1px solid rgb(221, 221, 221);
            box-sizing: border-box;
            color: rgb(51, 51, 51);
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            height: 27px;
            line-height: 17.15px;
            padding-bottom: 3px;
            padding-left: 10px;
            padding-right: 3px;
            padding-top: 3px;
            vertical-align: middle;
            width: 258px;
            margin-left: 5px;
        }
    </style>
</head>
<body>
    <input type="text" readonly="readonly" id="filename" class="input-text" value="" />
    <br />
    <div style="margin-top: 10px;">
        <input type="button" id="btnSelect" class="btn" value="选择文件" />
        <input type="button" class="btn" onclick="uploadPic()" value="确定导入" />
        <input type="button" class="btn" onclick="parent.layer.closeAll()" value="关闭" />
    </div>
    <script src="../lib/jquery/jquery-1.11.3.min.js"></script>
    <script src="../lib/ajaxupload.js"></script>
    <script src="../lib/layer/layer.js"></script>
    <script>
        var $UP_Pic = null;
        setUploadPic();

        function uploadPic() {
            $UP_Pic._settings.action = $UP_Pic._settings.action;
            $UP_Pic.submit();
        }

        function setUploadPic() {
            var btn = $('#btnSelect');
            $UP_Pic = new AjaxUpload(btn, {
                action: '/AjaxExcel/Import.cspx',
                autoSubmit: false,
                onChange: function (file, ext) {
                    if (!(ext && /^(xls|xlsx)$/.test(ext))) {
                        layer.alert('不是Excel文件，请重新选择', { title: '系统提示' });
                        $('#filename').val('');
                        return false;
                    }
                    btn.val('修改');
                    $('#filename').val(file);
                },
                onSubmit: function (file, ext) {
                    if (!(ext && /^(xls|xlsx)$/.test(ext))) {
                        layer.alert('不是Excel文件，请重新选择', { title: '系统提示' });
                        $('#filename').val('');
                        return false;
                    }
                },
                onComplete: function (file, result) {
                    result = result.replace('<pre>', '')
                        .replace('</pre>', '');
                    var json = $.parseJSON(result),
                        msg = json.success ? json.successMsg : json.errorMsg;
                    window.parent.layer.alert(msg);
                    $('#filename').val('');
                    btn.val('继续导入');

                }
            });
        }
    </script>
</body>
</html>