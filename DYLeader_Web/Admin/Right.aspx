<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title></title>

    <link href="../lib/h-ui/css/H-ui.min.css" rel="stylesheet" />
    <link href="../lib/controls/btctable/style.css" rel="stylesheet" />
    <style>
        .w-200 {
            width: 200px !important;
        }

        .w-120 {
            width: 120px;
        }

        .w-92 {
            width: 92px;
        }

        .mt-12 {
            margin-top: 12px;
        }
    </style>
</head>
<body>
    <!--查询用form-->
    <div>
        <form id="frmSearch">
            <div class="f-l">
                代码：
            <input type="text" name="Code" class="input-text w-120 size-S" value="" />
                <label class="ml-10">说明：</label>
                <input type="text" name="Name" class="input-text w-120 size-S" value="" />
                <div class="mt-12"></div>
                <label>全局：</label>
                <label>
                    <input type="radio" name="IsGlobal" value="1" />是
                </label>
                <label class="ml-5">
                    <input type="radio" name="IsGlobal" value="0" />否
                </label>
                <label class="ml-5">
                    <input type="radio" name="IsGlobal" value="" />全部
                </label>
                <label class="ml-10">启用：</label>
                <label>
                    <input type="radio" name="IsUsing" value="1" />是
                </label>
                <label class="ml-5">
                    <input type="radio" name="IsUsing" value="0" />否
                </label>
                <label class="ml-5">
                    <input type="radio" name="IsUsing" value="" />全部
                </label>
            </div>
            <div class="f-l">
                <input type="submit" value="查询" class="btn btn-primary radius size-S ml-10" />
                <input type="reset" value="清空" class="btn btn-secondary radius size-S ml-5" />
                <br />
                <input type="button" onclick="addRight()" value="新增权限" class="btn btn-success radius size-S ml-10 mt-10 w-92" />
            </div>
            <div class="cl"></div>
        </form>
    </div>

    <!--数据表格-->
    <div id="divRightList" class="pt-10">
    </div>

    <!--更新或新增权限列表 对话框-->
    <div id="dlgRight" class="hide pl-10">
        <form id="frmRight" method="post">
            <input type="hidden" name="ID" value="" />
            <div class="mt-15">名称：<input type="text" class="input-text w-200" readonly="readonly" name="Code" value="" /></div>
            <div class="mt-10">说明：<input type="text" class="input-text w-200" name="Name" value="" /></div>
            <div class="mt-10">
                全局：
                <label>
                    <input type="radio" name="IsGlobal" value="1" />是
                </label>
                <label class="ml-5">
                    <input type="radio" name="IsGlobal" value="0" />否
                </label>
            </div>
            <div class="mt-10">
                启用：
                <label>
                    <input type="radio" name="IsUsing" value="1" />是
                </label>
                <label class="ml-5">
                    <input type="radio" name="IsUsing" value="0" />否
                </label>
            </div>
            <div class="mt-10 mb-10 text-r" style="width: 238px;">
                <input type="submit" class="btn btn-primary radius size-S" value="提交" />
                <input type="button" class="btn btn-secondary radius size-S pr-10 ml-5" onclick="layer.close(LAYER_Dlg)" value="取消" />
            </div>
        </form>
    </div>

    <script src="../lib/jquery/jquery-1.11.3.min.js"></script>
    <script src="../lib/jquery.form.js"></script>
    <script src="../lib/common.js"></script>
    <script src="../lib/jquery.ext.js"></script>
    <script src="../script/common.js"></script>
    <script src="../lib/controls/btctable/control.js"></script>
    <script src="../lib/layer/layer.js"></script>
    <script>
        var LAYER_Dlg = null;

        var RIGHT_Table = $('#divRightList').btcTable({
            url: $.mvcData.path('Method.GetList'),
            parms: { table: 'SysRight' },
            form: '#frmSearch',
            heightDiff: 5,
            //pagesize: 1,
            cols: [
                { display: '权限代码', name: 'Code', width: 100, align: 'left' },
                { display: '权限说明', name: 'Name', width: 120, align: 'left' },
                { display: '是否全局', name: 'IsGlobal', width: 70, rend: [1, '是', 0, '否'] },
                { display: '是否启用', name: 'IsUsing', width: 70, rend: [1, '是', 0, '否'] }
            ],
            onclick: function (item) {
                $('#frmRight').setFormCtrlValue(item);
                LAYER_Dlg = showDlg($('#dlgRight'), '启用或禁用权限', 260);
            }
        });

        $('#frmRight').submit(function () {
            submitAll($(this),
                $.mvcData.path('Method.Save') + '?table=SysRight',
                function (data) {
                    var msg = '权限更新成功。';
                    if (!data.success) {
                        msg = data.errorMsg;
                    }
                    RIGHT_Table.reload();
                    layer.close(LAYER_Dlg);
                    layer.msg(msg);
                });
            return false;
        });

        function addRight() {
            $('#frmRight').clearFormCtrlValue();
            LAYER_Dlg = showDlg($('#dlgRight'), '新增权限', 260);
        }
    </script>
</body>
</html>