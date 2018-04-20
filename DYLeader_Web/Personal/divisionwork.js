/// <reference path="/lib/jquery.form.js"/>
/// <reference path="/lib/jquery/jquery-1.7.2-vsdoc.js"/>
/// <reference path="/lib/common.js"/>
/// <reference path="/lib/jquery.ext.js"/>
/// <reference path="/script/common.js"/>
/// <reference path="/lib/controls/btctable/control.js"/>
// 0 分管工作, 1 重点工程及工作,
var INFO_Index = 0;

var OBJ_Keys = ['Division', 'KeyProject'];

var LAYER_Dlg = null;

var $Table = {
    Division: null,
    KeyProject: null
};

var FORM_Id = {
    Division: '#frmDivisionWork',
    KeyProject: '#frmKeyProjectAndWork'
};

var PersonalIdCard = $.btcData.getQueryString('personalIdCard');   //$.btcData.getQueryString('personalIdCard');

var TABLE_Names = [
    'DivisionWork',
    'KeyProjectAndWork'
];
// 对话框 div 的 id
var DLG_Ids = [
    '#dlgDivisionWork',
    '#dlgKeyProjectAndWork'
];
var TABLE_Objs = new Array(8);

var $CURR_Table = null;

var IS_Edit = false;
$(function () {
    removeOther();

    setDiv0Area();

    setSubmitOther();
    $("#frmDivisionWork").Validform({
        tiptype: 1,
        //btnSubmit:'#btnBaseinfo',
        callback: function () {
            return false;
        }
    });
    $('[name="PersonalIdCard"]').val(PersonalIdCard);
    setVisabledTabIndex(0);
    // fillPersonalInfo();

    // showHideTab();
});

function setVisabledTabIndex(index) {
    /// <summary>设置当前显示的标签index, 并显示和隐藏公用工具栏的按钮</summary>
    var $spans = $('#divToolBar').find('span');
    INFO_Index = index;
    loadTable(index);
    //if (index < 1) {
    //    $spans.hide().eq(-2).show();
    //} else {
    //    $spans.show().eq(-2).hide();
    //}
    //$spans.eq(-1).show();
}

function showThisDlg(isEdit) {
    IS_Edit = isEdit;
    if (isEdit) {
        var key = OBJ_Keys[INFO_Index];
        var item = $Table[key].getSelectedItem();
        if (item == null) {
            layer.msg('请选择一个项目后继续。');
            return;
        } else {
            $(FORM_Id[key]).setFormCtrlValue(item);
        }
        //todo 获取当前Tab选中的信息id
    } else {
        $('[name="ID"]').val('');
    }
    layer.open({
        type: 1,
        title: '修改',
        area: '426px',
        content: $(DLG_Ids[INFO_Index])
    });
}

function setSubmitOther() {
    $.each(FORM_Id,
        function (key, value) {
            var $frm = $(value);
            $frm.submit(function () {
                submitAll($frm, null, {}, function () {
                    $frm.clearFormCtrlValue();
                    $Table[key].reload();
                    if (IS_Edit) {
                        layer.closeAll();
                    }
                });
                return false;
            });
        });
}

function loadTable(index) {
    var option = {
        url: $.mvcData.path('Method.GetList'),
        parms: { PersonalIdCard: PersonalIdCard },
        heightDiff: 42,
        radio: true
    };

    switch (index) {
        case 0:
            // #region 分管工作
            if ($Table.Division == null) {
                var DivisionWorkOption = $.extend(true, {}, option);
                DivisionWorkOption.parms.table = dy_tablename.DivisionWork;
                DivisionWorkOption.cols = [
                    { display: '分管内容', name: 'DividedContent', width: 150, align: 'center' },
                    { display: '开始时间', name: 'StartDate', width: 100, align: 'center' },
                    { display: '结束时间', name: 'EndDate', width: 100, align: 'center' },
                    { display: '效果', name: 'Effect', width: 500, align: 'left' }
                ];
                $Table.Division = $('#DivisionWorkList').btcTable(DivisionWorkOption);
            }
            break;
        // #endregion
        case 1:
            // #region 重点工程及工作
            if ($Table.KeyProject == null) {
                var KeyProjectAndWorkOption = $.extend(true, {}, option);
                KeyProjectAndWorkOption.parms.table = dy_tablename.KeyProjectAndWork;
                KeyProjectAndWorkOption.cols = [
                    { display: '工程或工作名称', name: 'Name', width: 150, align: 'center' },
                    { display: '开始时间', name: 'StartDate', width: 150, align: 'center' },
                    { display: '结束时间', name: 'EndDate', width: 100, align: 'center' },
                    { display: '效果', name: 'Effect', width: 450, align: 'left' }
                ];
                $Table.KeyProject = $('#KeyProjectAndWorkList').btcTable(KeyProjectAndWorkOption);
            }
        // #endregion
    }

    $CURR_Table = $Table[OBJ_Keys[index]];
}