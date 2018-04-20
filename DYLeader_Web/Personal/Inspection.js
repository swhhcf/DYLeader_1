/// <reference path="/lib/jquery.form.js"/>
/// <reference path="/lib/jquery/jquery-1.7.2-vsdoc.js"/>
/// <reference path="/lib/common.js"/>
/// <reference path="/lib/jquery.ext.js"/>
/// <reference path="/script/common.js"/>
/// <reference path="/lib/controls/btctable/control.js"/>
// 0 分管工作, 1 重点工程及工作,
var INFO_Index = 0;

var OBJ_Keys = ['ViolatingLaw', 'Petition', 'Filing', 'ViolationHouse', 'InspectorInspection'];

var LAYER_Dlg = null;

var $Table = {
    ViolatingLaw: null,
    Petition: null,
    Filing: null,
    ViolationHouse: null,
    InspectorInspection: null
};

var FORM_Id = {
    ViolatingLaw: '#frmViolatingLaw',
    Petition: 'frmPetition',
    Filing: 'frmFiling',
    ViolationHouse: 'frmViolationHouse',
    InspectorInspection: 'frmInspectorInspection'
};

var PersonalIdCard = $.btcData.getQueryString('personalIdCard');
var TABLE_Names = [
    'ViolatingLaw',
    'Petition',
    'Filing',
    'ViolationHouse',
    'InspectorInspection'
];
// 对话框 div 的 id
var DLG_Ids = [
    '#dlgViolatingLaw',
    '#dlgPetition',
    '#dlgFiling',
    '#dlgViolationHouse',
    '#dlgInspectorInspection'
];
var TABLE_Objs = new Array(8);

var $CURR_Table = null;

$(function () {
    removeOther();

    setDiv0Area();

    setSubmitOther();
    $("#frmOrdinaryInspection").Validform({
        tiptype: 1,
        //btnSubmit:'#btnBaseinfo',
        callback: function () {
            //submitPersonal();
            return false;
        }
    });
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
    var key = OBJ_Keys[INFO_Index];
    if (isEdit) {
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
        $(FORM_Id[key]).clearFormCtrlValue();
    }
    layer.open({
        type: 1,
        title: '修改',
        area: '426px',
        content: $(DLG_Ids[INFO_Index])
    });
}

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
        heightDiff: 9,
        radio: true
    };

    switch (index) {
        case 0:
            if ($Table.ViolatingLaw == null) {
                // #region 违法违纪
                var ViolatingLawOption = $.extend(true, {}, option);
                ViolatingLawOption.parms.table = dy_tablename.ViolatingLaw;
                ViolatingLawOption.cols = [
                    { display: 'id', name: 'ID', width: 50, align: 'left' },
                    { display: '身份证号', name: 'PersonalIdCard', width: 150, align: 'left' },
                    { display: '预警内容', name: 'Content', width: 200, align: 'left' },
                    { display: '预警类型', name: 'ContentKind', width: 100, align: 'left' },
                    { display: '处理结果', name: 'TreatmentResult', width: 100, align: 'left' },
                    { display: '上报时间', name: 'Date', width: 100, align: 'left' },
                    { display: '上报单位', name: 'ReportUnit', width: 100, align: 'left' },
                    { display: ' 处理时间', name: 'TreatmentDate', width: 100, align: 'left' }
                ];
                $Table.ViolatingLaw = $('#ViolatingLawList').btcTable(ViolatingLawOption);
                // #endregion
            }
            break;
        case 1: if ($Table.Petition == null) {
            // #region 信访反映
            var PetitionOption = $.extend(true, {}, option);
            PetitionOption.parms.table = dy_tablename.Petition;
            PetitionOption.cols = [
                { display: 'id', name: 'ID', width: 100, align: 'left' },
                { display: '身份证号', name: 'PersonalIdCard', width: 100, align: 'left' },
                { display: '时间', name: 'Date', width: 100, align: 'left' },
                { display: '信访人姓名', UserName: 'Conclusion', width: 90 },
                { display: '内容', name: 'Content', width: 90 }
            ];
            $Table.Petition = $('#PetitionList').btcTable(PetitionOption);
            // #endregion
        }
            break;
        case 2: if ($Table.Filing == null) {
            // #region 立案审查
            var FilingOption = $.extend(true, {}, option);
            FilingOption.parms.table = dy_tablename.Filing;
            FilingOption.cols = [
                { display: 'id', name: 'ID', width: 100, align: 'left' },
                { display: '身份证号', name: 'PersonalIdCard', width: 100, align: 'left' },
                { display: '时间', name: 'Date', width: 100, align: 'left' },
                { display: '地点', name: 'Place', width: 100, align: 'left' },
                { display: '立案事由', name: 'Content', width: 100, align: 'left' },

            ];
            $Table.Filing = $('#FilingList').btcTable(FilingOption);
            // #endregion
        }
            break;
        case 3: if ($Table.ViolationHouse == null) {
            // #region 违章建房
            var ViolationHouseOption = $.extend(true, {}, option);
            ViolationHouseOption.parms.table = dy_tablename.ViolationHouse;
            ViolationHouseOption.cols = [
                { display: 'id', name: 'ID', width: 100, align: 'left' },
                { display: '身份证号', name: 'PersonalIdCard', width: 100, align: 'left' },
                { display: '地点', name: 'Place', width: 100, align: 'left' },
                { display: '内容', name: 'Content', width: 100, align: 'left' },
            ];
            $Table.ViolationHouse = $('#ViolationHouseList ').btcTable(ViolationHouseOption);
            // #endregion
        }
            break;
        case 4:
            if ($Table.InspectorInspection == null) {
                // #region 巡察督查
                var InspectorInspectionOption = $.extend(true, {}, option);
                InspectorInspectionOption.parms.table = dy_tablename.InspectorInspection;
                InspectorInspectionOption.cols = [
                    { display: 'id', name: 'ID', width: 100, align: 'left' },
                    { display: '身份证号', name: 'PersonalIdCard', width: 100, align: 'left' },
                    { display: '时间', name: 'Date', width: 100, align: 'left' },
                    { display: '内容', name: 'Content', width: 90 }
                ];
                $Table.InspectorInspection = $('#InspectorInspectionList').btcTable(InspectorInspectionOption);
                // #endregion
            }
            break;
    }
    $CURR_Table = $Table[OBJ_Keys[index]];
}