/// <reference path="/lib/jquery.form.js"/>
/// <reference path="/lib/jquery/jquery-1.7.2-vsdoc.js"/>
/// <reference path="/lib/common.js"/>
/// <reference path="/lib/jquery.ext.js"/>
/// <reference path="/script/common.js"/>
/// <reference path="/lib/controls/btctable/control.js"/>
// 0 分管工作, 1 重点工程及工作,
var INFO_Index = 0;

var OBJ_Keys = ['Ordinary', 'Special', 'Annual', 'Evaluation', 'DemocraticRecommendation'];

var LAYER_Dlg = null;

var $Table = {
    Ordinary: null,
    Special: null,
    Annual: null,
    Evaluation: null,
    DemocraticRecommendation: null
};

var FORM_Id = {
    Ordinary: '#frmOrdinaryInspection',
    Special: '#frmSpecialInspection',
    Annual: '#frmAnnualAppraisal',
    Evaluation: '#frmDemocraticEvaluation',
    DemocraticRecommendation: '#frmDemocraticRecommendation'
};

var PersonalIdCard = $.btcData.getQueryString('personalIdCard');

var TABLE_Names = [
    'OrdinaryInspection',
    'SpecialInspection',
    'AnnualAppraisal',
    'DemocraticEvaluation',
    'DemocraticRecommendation'
];
// 对话框 div 的 id
var DLG_Ids = [
    '#dlgOrdinaryInspection',
    '#dlgSpecialInspection',
    '#dlgAnnualAppraisal',
    '#dlgDemocraticEvaluation',
    '#dlgDemocraticRecommendation'
];
var TABLE_Objs = new Array(8);

var $CURR_Table = null;

$(function () {
    removeOther();

    setDiv0Area();

    setSubmitOther();

    $('[name="PersonalIdCard"]').val(PersonalIdCard);
    setVisabledTabIndex(0);
    // fillPersonalInfo();

    // showHideTab();
});

function setVisabledTabIndex(index) {   //页签的入口函数：setVisabledTabIndex(1)，index是页签的序号，第一个为0。
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

function setSubmitOther() {
    // var dytable_name = TABLE_Names[INFO_Index];
    // layer.msg(dytable_name);
    $.each(FORM_Id,
        function (key, value) {
            var $frm = $(value);
            // var dyaction = "/AjaxMethod/Save.cspx?table=" + dytable_name;
            $frm.submit(function () {
                submitAll($frm, null, {}, function () {
                    //submitAll($frm, dyaction, {}, function () {
                    $frm.clearFormCtrlValue();
                    layer.closeAll();
                    $Table[key].reload();
                });
                $frm.clearFormCtrlValue();
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
            if ($Table.Ordinary == null) {
                // #region 平时考察
                var OrdinaryInspectionOption = $.extend(true, {}, option);
                OrdinaryInspectionOption.parms.table = dy_tablename.OrdinaryInspection;
                OrdinaryInspectionOption.cols = [
                    { display: '时间', name: 'Date', width: 100, align: 'center' },
                    { display: '效果', name: 'Effect', width: 800, align: 'left' }
                ];
                $Table.Ordinary = $('#OrdinaryInspectionList').btcTable(OrdinaryInspectionOption);
                // #endregion
            }
            break;
        case 1:
            if ($Table.Special == null) {
                // #region 专项考察
                var SpecialInspectionOption = $.extend(true, {}, option);
                SpecialInspectionOption.parms.table = dy_tablename.SpecialInspection;
                SpecialInspectionOption.cols = [
                    { display: '考察内容', name: 'InspectionContent', width: 150, align: 'left' },
                    { display: '上级考察部门', name: 'Superior', width: 150, align: 'center' },
                    { display: '时间', name: 'Date', width: 100, align: 'center' },
                    { display: '结论', name: 'Conclusion', width: 460, align: 'left' }
                ];
                $Table.Special = $('#SpecialInspectionList').btcTable(SpecialInspectionOption);
                // #endregion
            }
            break;
        case 2:
            if ($Table.Annual == null) {
                // #region 年度考核
                var annualOption = $.extend(true, {}, option);
                annualOption.parms.table = dy_tablename.annualAppraisal;
                annualOption.cols = [
                    { display: '在职单位', name: 'WorkUnit', width: 200, align: 'center' },
                    { display: '时间', name: 'Date', width: 100, align: 'center' },
                    { display: '等级', name: 'Degree', width: 100, align: 'center' }
                ];
                $Table.Annual = $('#AnnualAppraisalList').btcTable(annualOption);
                // #endregion
            }
            break;
        case 3:
            if ($Table.Evaluation == null) {
                // #region 民主测评
                var DemocraticEvaluationOption = $.extend(true, {}, option);
                DemocraticEvaluationOption.parms.table = dy_tablename.DemocraticEvaluation;
                DemocraticEvaluationOption.cols = [
                    { display: '测评内容', name: 'content', width: 150, align: 'left' },
                    { display: '参加测评人数', name: 'Number', width: 50, align: 'right' },
                    { display: '时间', name: 'Date', width: 90, align: 'center' },
                    { display: '评价', name: 'Conclusion', width: 580, align: 'left' }

                ];
                $Table.Evaluation = $('#DemocraticEvaluationList ').btcTable(DemocraticEvaluationOption);
                // #endregion
            }
            break;
        case 4:
            if ($Table.DemocraticRecommendation == null) {
                // #region 民主推荐
                var DemocraticRecommendationOption = $.extend(true, {}, option);
                DemocraticRecommendationOption.parms.table = dy_tablename.DemocraticRecommendation;
                DemocraticRecommendationOption.cols = [
                    { display: '推荐单位', name: 'RecommendationUnit', width: 200, align: 'center' },
                    { display: '地点', name: 'Place', width: 200, align: 'center' },
                    { display: '时间', name: 'Date', width: 100, align: 'center' },
                    { display: '参加人数', name: 'Number', width: 50, align: 'right' },
                    { display: '占比%', name: 'Proportion', width: 50, align: 'right' },
                    { display: '内容', name: 'Content', width: 240 }
                ];
                $Table.DemocraticRecommendation = $('#DemocraticRecommendationList').btcTable(DemocraticRecommendationOption);
                // #endregion
            }
            break;
    }
    $CURR_Table = $Table[OBJ_Keys[index]];
}