/// <reference path="/lib/jquery.form.js"/>
/// <reference path="/lib/jquery/jquery-1.7.2-vsdoc.js"/>
/// <reference path="/lib/common.js"/>
/// <reference path="/lib/jquery.ext.js"/>
/// <reference path="/script/common.js"/>
/// <reference path="/lib/controls/btctable/control.js"/>
// 0 分管工作, 1 重点工程及工作,
var INFO_Index = 0;

var OBJ_Keys = ['Patrol', 'PostsAndStaff'];

var LAYER_Dlg = null;

var $Table = {
    Patrol: null,
    PostsAndStaff: null
};

var FORM_Id = {
    Patrol: '#frmPatrolInspection',
    PostsAndStaff: '#frmPostsAndStaff'
};

var PersonalIdCard = $.btcData.getQueryString('personalIdCard');   //$.btcData.getQueryString('PersonalIdCard');

var TABLE_Names = [
    'PatrolInspection',
    'PostsAndStaffInspection'
];
// 对话框 div 的 id
var DLG_Ids = [
    '#dlgPatrolInspection',
    '#dlgPostsAndStaff'
];
var TABLE_Objs = new Array(8);

var $CURR_Table = null;

$(function () {
    removeOther();

    setDiv0Area();
    setSubmitOther();
    $("#frmPatrolInspection").Validform({
        tiptype: 1,
        //btnSubmit:'#btnBaseinfo',
        callback: function () {
            submitPersonal();
            return false;
        }
    });
    $('[name="PersonalIdCard"]').val(PersonalIdCard);
    setVisabledTabIndex(0);
    // fillPersonalInfo();

    //showHideTab();
});

function setVisabledTabIndex(index) {
    /// <summary>设置当前显示的标签index, 并显示和隐藏公用工具栏的按钮</summary>
    var $spans = $('#divToolBar').find('span');
    INFO_Index = index;
    loadTable(index);
}

function showThisDlg(isEdit) {
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
            if ($Table.Patrol == null) {
                // #region 1.巡察巡查
                var PatrolInspectionOption = $.extend(true, {}, option);
                PatrolInspectionOption.parms.table = dy_tablename.PatrolInspection;
                PatrolInspectionOption.cols = [
                    { display: '时间', name: 'Date', width: 100, align: 'left' },
                    { display: '内容', name: 'Content', width: 800, align: 'left' }
                ];
                $Table.Patrol = $('#PatrolInspectionList').btcTable(PatrolInspectionOption);
                // #endregion
            }
            break;
        case 1:
            if ($Table.PostsAndStaff == null) {
                // #region 2.“定岗定职”专项督导
                var PostsAndStaffOption = $.extend(true, {}, option);
                PostsAndStaffOption.parms.table = dy_tablename.PostsAndStaffInspection;
                PostsAndStaffOption.cols = [
                    { display: '时间', name: 'Date', width: 100, align: 'left' },
                    { display: '内容', name: 'Content', width: 800, align: 'left' }
                ];
                $Table.PostsAndStaff = $('#PostsAndStaffList').btcTable(PostsAndStaffOption);
                // #endregion
            }
            break;
    }
    $CURR_Table = $Table[OBJ_Keys[index]];
}