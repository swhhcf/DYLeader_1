/// <reference path="/lib/jquery.form.js"/>
/// <reference path="/lib/jquery/jquery-1.7.2-vsdoc.js"/>
/// <reference path="/lib/common.js"/>
/// <reference path="/lib/jquery.ext.js"/>
/// <reference path="/script/common.js"/>
/// <reference path="/lib/controls/btctable/control.js"/>
var INFO_Index = 0;

var OBJ_Keys = ['tra', 'edu'];

var LAYER_Dlg = null;

var $Table = {
    edu: null,
    tra: null
};

var FORM_Id = {
    edu: '#frmEdu',
    tra: '#frmTra'
};

//var PersonalIdCard = $.btcData.getQueryString('PersonalIdCard');
var PersonalIdCard = $.btcData.getQueryString('personalIdCard');   //$.btcData.getQueryString('PersonalIdCard');

var TABLE_Names = [
    'EduExperience'
];
// 对话框 div 的 id
var DLG_Ids = [
    '#dlgTra',
    '#dlgEdu'
];
var TABLE_Objs = new Array(8);

var $CURR_Table = null;

$(function () {
    removeOther();

    $('[name="PersonalIdCard"]').val(PersonalIdCard);
    //$('#div0').Huitab();

    setSubmitOther();
    $("#frmpersonal").Validform({
        tiptype: 1,
        //btnSubmit:'#btnBaseinfo',
        callback: function () {
            submitPersonal();
            return false;
        }
    });

    setVisabledTabIndex(0);

    //fillPersonalInfo();

    //showHideTab();
});

function setThisDate(value) {
    $('[name="Date"]').val(value);
}

function fillPersonalInfo() {
    if (PersonalIdCard != null) {
        var personalInfo = $.mvcData.get('Method.Get', { table: TABLE_Names[0], id: PersonalIdCard });
        $('#frmpersonal').setFormCtrlValue(personalInfo.rows);
        loadTable();
    }

    $('[name="PersonalIdCard"]').val(PersonalIdCard);

    //出生地、籍贯更改为自动完成
    $('#NativeOrigin').btcNamebox(getAreaOption('Area', 'NativeOrigin'));
    $('#NativePlace').btcNamebox(getAreaOption('Area', 'NativePlace'));
    $('#Ethnicity').btcNamebox(getAreaOption('Ethnicity', 'Ethnicity', 'Ethnicity'));
}

//function showHideTab() {
//    var $tab = $('#divTab').find('span');
//    if (PersonalIdCard == null) {
//        $tab.hide();
//        $tab.eq(0).show();
//    } else {
//        $tab.show();
//    }
//}

function setVisabledTabIndex(index) {
    /// <summary>设置当前显示的标签index, 并显示和隐藏公用工具栏的按钮</summary>
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
        area: '400px',
        content: $(DLG_Ids[INFO_Index])
    });
}

function getAreaOption(typeName, fieldName, idField) {
    if (idField == null) {
        idField = 'Name';
    }
    return {
        url: $.mvcData.path('List.Get' + typeName),
        valueTarget: '[name="' + fieldName + '"]',
        cols: [{ name: idField, width: 70 }],
        width: 100,
        listWidth: 200,
        diffLeft: -14,
        diffTop: -8,
        id: idField,
        isBlank: false,
        value: $('[name="' + fieldName + '"]').val()
    }
};

function submitPersonal() {
    submitAll($('#frmpersonal'),
        dy_url.save(dy_tablename.personal),
        {},
        function (data) {
            if (data.id != null) {
                PersonalIdCard = data.id;
                $('[name="PersonalIdCard"]').val(data.id);
                loadTable();

                submitAll($('#frmPolitical'), dy_url.save(dy_tablename.politics));
                submitAll($('#frmAddr'), dy_url.save(dy_tablename.addr));
            }
            var msg = '记录插入成功。';
            if (!data.success) {
                msg = data.errorMsg;
            }
            //layer.close(LAYER_Dlg);
            layer.msg(msg);
            loadTable();
        });
    return false;
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
    $('#div0').width($(document).width() - 12);

    var option = {
        url: $.mvcData.path('Method.GetList'),
        parms: { PersonalIdCard: PersonalIdCard },
        heightDiff: 10,
        radio: true
    };
    if (index == 1 && $Table.edu == null) {
        // #region 教育经历
        var eduOption = $.extend(true, {}, option);
        eduOption.parms.table = dy_tablename.eduExperience;
        eduOption.cols = [
            { display: '是否为全日制', name: 'IsFullTime', width: 40, rend: [1, '是', 0, '否'] },
            { display: '学校', name: 'School', width: 150, align: 'left' },
            { display: '院系', name: 'Department', width: 100, align: 'left' },
            { display: '专业', name: 'Major', width: 100, align: 'left' },
            { display: '入学时间', name: 'StartDate', width: 90 },
            { display: '毕结业时间', name: 'EndDate', width: 90 },
            { display: '毕结业状态', name: 'Status', width: 40 },
            { display: '学历', name: 'EduBackground', width: 120, align: 'left' },
            { display: '学位', name: 'Degree', width: 120, align: 'left' }
        ];
        $Table.edu = $('#EduList').btcTable(eduOption);
        $CURR_Table = $Table.edu;
    }
    // #endregion
    if (index == 0 && $Table.tra == null) {
        var traOption = $.extend(true, {}, option);
        traOption.parms.table = dy_tablename.TrainingLearning;
        traOption.cols = [
            { display: '培训班次', name: 'TrainingClass', width: 150, align: 'left' },
            { display: '开始时间', name: 'StartDate', width: 100, align: 'left' },
            { display: '学时', name: 'ClassHour', width: 100, align: 'left' }
        ];
        $Table.tra = $('#TraList').btcTable(traOption);
        $CURR_Table = $Table.tra;
    }
}