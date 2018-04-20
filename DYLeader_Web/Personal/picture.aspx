<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title></title>
    <!--<link href="../static/h-ui/css/H-ui.min.css" rel="stylesheet" />-->
    <style>
        html, body {
            height: 280px;
            width: 170px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="f-l" id="divPic">
        <div id="divImg" title="单击以上传照片" style="width: 150px; height: 200px;">
            <img id="imgPic" src="" style="width: 150px; height: 200px;" alt="单击以上传照片" /><br />
        </div>
        <input type="hidden" value="" id="picname" />
    </div>
    <script src="../lib/jquery/jquery-1.11.3.min.js"></script>
    <script src="../lib/ajaxupload.js"></script>

    <script>
        var $UP_Pic = null;
        setUploadPic();

        function uploadPic() {
            $UP_Pic._settings.action = $UP_Pic._settings.action + '?picname=' + $('#picname').val();
            $UP_Pic.submit();
        }

        function setUploadPic() {
            var btn = $('#imgPic');
            $UP_Pic = new AjaxUpload(btn, {
                action: '/AjaxPictrue/Upload.cspx',
                autoSubmit: false,
                onChange: function (file, ext) {
                    if (!(ext && /^(jpg|jpeg|png|gif|bmp|tif|tiff)$/.test(ext))) {
                        alert('不是图片，请重新选择', '系统提示');
                        return false;
                    }

                    //预览图片
                    var domFile = $('#absFileInput')[0];
                    if (domFile.files && domFile.files[0]) {
                        var reader = new FileReader();
                        reader.onload = function (evt) {
                            $('#imgPic').attr('src', evt.target.result);
                        }
                        reader.readAsDataURL(domFile.files[0]);
                    } else {
                        var styleValue = 'width: 150px; height: 200px;' +
                            'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' +
                            domFile.value +
                            '\');';
                        $('#divImg').attr('style', styleValue);
                        //prevDiv.innerHTML = '<div class="img" style=""></div>';
                    }
                },
                onSubmit: function (file, ext) {
                    if (!(ext && /^(jpg|jpeg|png|gif|bmp|tif|tiff)$/.test(ext))) {
                        alert('不是图片，请重新选择', '系统提示');
                        return false;
                    }
                    //$(filenameCtrlId).val(file);
                    //button.val('上传中');

                    //this.disable(); //只上传一个文件时使用
                    //return true;
                },
                onComplete: function (file, result) {
                    //file 本地文件名称，result 服务器端传回的信息
                    btn.val('更改');
                    // enable upload button
                    //button.enable();
                    result = result.replace('<pre>', '')
                        .replace('</pre>', '');
                    // var imgUrl = "http://localhost/Question/images/" + result;
                    //  "https://iam.biotecan.com:8444/Question/images/" + result;
                    // button.prev().prev().val(imgUrl);
                    // button.prev().attr("src", imgUrl);
                }
            });
        }
    </script>
</body>
</html>