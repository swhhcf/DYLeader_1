/// <reference path="/lib/jquery.form.js"/>
/// <reference path="/lib/jquery/jquery-1.7.2-vsdoc.js"/>
/// <reference path="/lib/common.js"/>
/// <reference path="/lib/jquery.ext.js"/>
/// <reference path="/script/common.js"/>
/// <reference path="/lib/controls/btctable/control.js"/>
// 0 编制情况, 1 年龄结构, 2 性别结构, 3 学历结构, 4 经历结构, 5 专业结构
var INFO_Index = 0;

var OBJ_Keys = ['Institutions', 'AgeStructure', 'GenderStructure', 'EducationStructure', 'LeaderStructure', 'MajorStructure'];

var LAYER_Dlg = null;

var $InstTable = {
    Institutions: null,
    AgeStructure: null,
    GenderStructure: null,
    EducationStructure: null,
    LeaderStructure: null,
    MajorStructure: null
};

var FORM_Id = {
    Institutions: '#frmInstitutions',
    AgeStructure: '#frmAgeStructure',
    GenderStructure: '#frmGenderStructure',
    EducationStructure: '#frmEducationStructure',
    LeaderStructure: '#frmLeaderStructure',
    MajorStructure: '#frmMajorStructure'
};

//var PersonalId = $.btcData.getQueryString('personalId');
var TABLE_InstNames = [
    'Institutions',
    'AgeStructure',
    'GenderStructure',
    'EducationStructure',
    'LeaderStructure',
    'MajorStructure'
];
// 对话框 div 的 id
var DLG_Ids = [
    '#dlgInstitutions'
];
var TABLE_Objs = new Array(8);

$(function () {
    removeOther();

    $('#div0').Huitab();

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
    loadTable();
    // fillPersonalInfo();

    // showHideTab();
});

//function showHideTab() {
//    var $tab = $('#divTab').find('span');
//    if (PersonalId == null) {
//        $tab.hide();
//        $tab.eq(0).show();
//    } else {
//        $tab.show();
//    }
//}

function setVisabledTabIndex(index) {
    /// <summary>设置当前显示的标签index, 并显示和隐藏公用工具栏的按钮</summary>
    var $spans = $('#divToolBar').find('span');
    //    layer.open({
    //        title: 'test',
    //        content: $spans
    //});
    INFO_Index = index;
    loadTable(index);
    //if (index < 1) {
    //    $spans.hide().eq(-2).show();
    //} else {
    //    $spans.show().eq(-2).hide();
    //}
    //$spans.eq(-1).show();
}

function showDlg(isEdit) {
    if (isEdit) {
        var key = OBJ_Keys[INFO_Index];
        var item = $InstTable[key].getSelectedItem();
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
                PersonalId = data.id;
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
            showHideTab();
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
                    $InstTable[key].reload();
                });
                return false;
            });
        });
}

function loadTable(index) {
    var DeptId = $.btcData.getQueryString('personalId');
    var option = {
        url: $.mvcData.path('Method.GetList'),
        // parms: { PersonalId: PersonalId },
        parms: { DeptId: DeptId },
        heightDiff: 75,
        radio: true
    };

    switch (index) {
        case 0:
            if ($InstTable.Institutions == null) {
                // #region 干部编制情况
                var InstitutionsOption = $.extend(true, {}, option);
                InstitutionsOption.parms.table = dy_tablename.Institutions;
                InstitutionsOption.cols = [
                    { display: '单位名称', name: 'WorkUnit', width: 220, align: 'left' },
                    { display: '领导正职人数', name: 'Leadership', width: 100, align: 'left' },
                    { display: '领导副职人数', name: 'LeaderDeputy', width: 100, align: 'left' },
                    { display: '中层人数', name: 'MiddleLvel', width: 40 }
                ];
                $InstTable.Institutions = $('#InstitutionsList').btcTable(InstitutionsOption);
                // #endregion
            }
            break;
        case 1:
            if ($InstTable.AgeStructure == null) {
                // #region 年龄结构
                var AgeStructureOption = $.extend(true, {}, option);
                AgeStructureOption.parms.table = dy_tablename.AgeStructure;
                AgeStructureOption.cols = [
                    { display: '单位名称', name: 'WorkUnit', width: 220, align: 'left' },
                    { display: '35周岁及以下', name: 'Under35', width: 100, align: 'left' },
                    { display: '36周岁-45周岁', name: 'Between36_45', width: 100, align: 'left' },
                    { display: '46周岁-55周岁', name: 'Between46_55', width: 100, align: 'left' },
                    { display: '56周岁及以上', name: 'Up56', width: 40 }
                ];
                $InstTable.AgeStructure = $('#AgeStructureList').btcTable(AgeStructureOption);
                // #endregion
            }
            break;
        case 2:
            if ($InstTable.GenderStructure == null) {
                // #region 性别结构
                var GenderStructureOption = $.extend(true, {}, option);
                GenderStructureOption.parms.table = dy_tablename.GenderStructure;
                GenderStructureOption.cols = [
                    { display: '单位名称', name: 'WorkUnit', width: 220, align: 'left' },
                    { display: '男性', name: 'man', width: 100, align: 'left' },
                    { display: '女性', name: 'women', width: 40 }
                ];
                $InstTable.GenderStructure = $('#GenderStructureList').btcTable(GenderStructureOption);
                // #endregion
            }
            break;
        case 3:
            if ($InstTable.EducationStructure == null) {
                // #region 学历结构
                var EducationStructureOption = $.extend(true, {}, option);
                EducationStructureOption.parms.table = dy_tablename.EducationStructure;
                EducationStructureOption.cols = [
                    { display: '单位名称', name: 'WorkUnit', width: 220, align: 'left' },
                    { display: '硕士及以上', name: 'UpMaster', width: 100, align: 'left' },
                    { display: '大学本科', name: 'Undergraduate', width: 100, align: 'left' },
                    { display: '大专', name: 'JuniorCollege', width: 100, align: 'left' },
                    { display: '大专以下', name: 'UnderJuniorCollete', width: 40 }
                ];
                $InstTable.EducationStructure = $('#EducationStructureList').btcTable(EducationStructureOption);
                // #endregion
            }
            break;
        case 4:
            if ($InstTable.LeaderStructure == null) {
                // #region 经历结构
                var LeaderStructureOption = $.extend(true, {}, option);
                LeaderStructureOption.parms.table = dy_tablename.LeaderStructure;
                LeaderStructureOption.cols = [
                    { display: '单位名称', name: 'WorkUnit', width: 220, align: 'left' },
                    { display: '正科', name: 'Leadership', width: 100, align: 'left' },
                    { display: '副科', name: 'LeaderDeputy', width: 100, align: 'left' },
                    { display: '中层正职', name: 'MiddleLvelDeputy', width: 100, align: 'left' },
                    { display: '中层副职', name: 'MiddleLvelDeputy', width: 40 }
                ];
                $InstTable.LeaderStructure = $('#LeaderStructureList').btcTable(LeaderStructureOption);
                // #endregion
            }
            break;
        case 5:
            if ($InstTable.Institutions == null) {
                // #region 专业结构
                var MajorStructureOption = $.extend(true, {}, option);
                MajorStructureOption.parms.table = dy_tablename.MajorStructure;
                MajorStructureOption.cols = [
                    { display: '单位名称', name: 'WorkUnit', width: 220, align: 'left' },
                    { display: '高级', name: 'Leadership', width: 100, align: 'left' },
                    { display: '中级', name: 'Middle', width: 100, align: 'left' },
                    { display: '初级', name: 'Primary', width: 40 }
                ];
                $InstTable.MajorStructure = $('#MajorStructureList').btcTable(MajorStructureOption);
                //#endregion
            }
            break;
        default:
    }
}