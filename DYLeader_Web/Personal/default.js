/// <reference path="../lib/jquery/jquery-1.11.3.min.js"/>
/// <reference path="../static/h-ui/js/H-ui.min.js"/>
/// <reference path="../lib/jquery.form.js"/>
/// <reference path="../lib/common.js"/>
/// <reference path="../lib/jquery.ext.js"/>
/// <reference path="../script/common.js"/>
/// <reference path="../lib/controls/btctable/control.js"/>
/// <reference path="../lib/controls/namebox/namebox.js" />
/// <reference path="../lib/layer/layer.js"/>
/// <reference path="../script/jquery.ext.selection.js"/>

;
var LAYER_Dlg = null;

var KEY_Arr = [
    'personal',
    'inspection',
    '',
    '',
    '',
    'other'
];
var TABLE_Option = {
    'personal': null,
    'inspection': null,
    'divsion': null,
    'ivestigate': null,
    'special': null,
    'other': null
};
var $Table = {
    personal: null,
    inspection: null,
    divsion: null,
    ivestigate: null,
    special: null,
    other: null
};

var TABLE_Name = {//deptid,sectionid
    'personal': 'VPersonal',
    'inspection': 'vvinspection',
    //'divsion': 'vvdivisionwork',
    //'ivestigate': 'vvInvestigate',
    //'special': 'vvSpecialsupervision',
    'other': 'vvTrainLearn'
};

var IS_Train = null;

var ZTreeObj = null;
var CurrNode = null;

//0 基本情况, 1 督查信息, 2 分管情况, 3 考察情况, 4 专项督查, 5 其他信息
var TYPE_No = 0;
var TYPE_Names = ['基本情况', '督查信息', '分管情况', '考察情况', '专项督查', '其他信息', '', '编制情况'];

var HTML_Urls = [
    'personal.aspx',
    'Inspection.aspx',
    'divisionwork.aspx',
    'Investigate.aspx',
    'specialsupervision.aspx',
    'TrainLearn.aspx',
    '',
    'Institutions.aspx'

];

var DLG_Location = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
};
var IsDept = false;
var DeptName = '';
var SectionName = '';
var DeptId = 0;
var SectionId = 0;
var ParentDeptId = 0;

var INFO_Index = 0;

var OBJ_Keys = ['Institutions', 'AgeStructure', 'GenderStructure', 'EducationStructure', 'LeaderStructure', 'MajorStructure'];

var LAYER_Dlg = null;

var $Table = {
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

var $CURR_Table = null;

var COMMON_Option = {
    radio: true,
    nameField: 'Fullname',
    form: '#frmSearch',
    idField: 'ID',
    onclick: function (item, $td) {
        $('#bt-table-content').find('[type="radio"]').removeProp('checked');
        $td.parent().find('[type="radio"]').click();
    },
    ondblclick: function (item, $td) {
        //$td.click();
        showThisDlg(1);
    }
}

var $RMenu = $('#rMenu');

var USER_Name = $.mvcData.get('User.Get').username;

var DIFF_Height = 0;

var FILE_Name = null;
$(function () {
    showHideTab();

    var docHeight = $(window).height() - 94;
    var docWidth = $(window).width();
    $('#left').height(docHeight);
    $('#content').width(docWidth - 260);

    //设置对话框大小和位置：
    DLG_Location.width = docWidth - 260;
    DLG_Location.height = docHeight + 18;
    DLG_Location.left = 130;
    DLG_Location.top = 50;

    //设置左侧部门列表
    fillDeptList();

    //初始化列表
    setTableOption();

    setSubmitOther();
    //setVisabledTabIndex(0);

    $('#personal').show();
    loadTable(0);

    setAjaxForm();

    fillDeptEditFormValue();
});

function showHideTab() {
    if (USER_Name != 'admin') {
        //var $search = $('#Hui-navbar').find('li').hide().eq(-1).show().addClass('li-selected');
        //$search.parent().css('background-color', '#4fabb6');
        //changeType(6, $search);
        $('#tool').remove();
        addMT10('#divList');
        addMT10('#div0');
        for (var i = 0; i < 7; i++) {
            addMT10('#div0' + i);
        }
        DIFF_Height = -28;
    }
}

function addMT10(dom) {
    $(dom).css("margin-top", "10px");
}

function setAjaxForm() {
    $('#frmMovePersonal').submit(
        function () {
            layer.confirm('确认要进行此操作吗？',
                function (index) {
                    layer.close(index);
                    $('#frmMovePersonal').ajaxSubmit(
                        {
                            beforeSubmit: function () {
                                var msgs = [];
                                if ($('[name="StartDate"]').val() == '') {
                                    msgs.push('请填写变动日期');
                                }
                                if ($('#NowWorkUnit').is(':visible')) {
                                    if ($('#NowWorkUnit').val() == '') {
                                        msgs.push('请填写单位。');
                                    }
                                }
                                if (msgs.length > 0) {
                                    layer.msg(msgs.join('<br/>'));
                                    return false;
                                }
                            },
                            success: function (result) {
                                var msg = result.success ? '成功。' : result.errorMsg;
                                if (result.success) {
                                    layer.closeAll();
                                    $Table.personal.reload();
                                }
                                layer.msg(msg);
                            }
                        });
                });
            return false;
        });

    $('#frmTra').submit(function () {
        layer.confirm('确认要进行此操作吗？',
            function (index) {
                layer.close(index);
                $('#frmTra').ajaxSubmit({
                    success: function (result) {
                        var msg = result.success ? '成功。' : result.errorMsg;
                        if (result.success) {
                            layer.closeAll();
                            $Table.inspection.reload();
                        }
                        layer.msg(msg);
                        $Table.inspection.reload();
                    }
                });
            });
        return false;
    });

    $('#frmEditDept').submit(
        function () {
            layer.confirm('确认要修改吗？',
                function (index) {
                    layer.close(index);
                    $('#frmEditDept').ajaxSubmit({
                        success: function (result) {
                            reloadTree(result);
                        }
                    });
                });
            return false;
        });

    $('#frmNewDept').submit(
        function () {
            if (!isIdValid($(this))) {
                return false;
            }
            layer.confirm('确认要新增同级单位吗？',
                function (index) {
                    layer.close(index);
                    $('#frmNewDept').ajaxSubmit({
                        success: function (result) {
                            reloadTree(result);
                        },
                        error: function () {
                            layer.msg('单位编码有重复，请重新输入。');
                        }
                    });
                });
            return false;
        });

    $('#frmSubDept').submit(
        function () {
            if (!isIdValid($(this))) {
                return false;
            }
            layer.confirm('确认要新增下级单位吗？',
                function (index) {
                    layer.close(index);
                    $('#frmSubDept').ajaxSubmit({
                        success: function (result) {
                            reloadTree(result);
                        },
                        error: function () {
                            layer.msg('单位编码有重复，请重新输入。');
                        }
                    });
                });
            return false;
        });
}

function isIdValid($dom) {
    var id = $dom.find('[name="id"]').val() * 1,
        pId = $dom.find('[name="pId"]').val() * 1,
        min = pId * 1000,
        max = pId == 0 ? 1000 : pId * 10000;
    if (isNaN(id) || min > id || id > max) {
        layer.msg('单位编码不符合要求，请重新输入');
        return false;
    }
    return true;
}

function reloadTree(result) {
    var msg = result.success ? '操作成功。' : '操作失败';
    layer.msg(msg);
    if (!result.success) {
        return;
    }
    ZTreeObj.destroy();
    fillDeptList();
    var parentNode = ZTreeObj.getNodeByParam('id', ParentDeptId);
    var node = ZTreeObj.getNodeByParam('id', DeptId);
    ZTreeObj.expandNode(parentNode);
    ZTreeObj.expandNode(node);
}

// 显示编制情况
function showInst() {
    $('#divList').hide();
    $('#div0').show();
    if ($Table.Institutions == null) {
        $('#div0').Huitab();
    }
    loadInstTable(0);
}

//显示分管情况
function showDivision() {
    $('#divList').hide();
    $('#div02').show();
    if ($Table.Division == null) {
        $('#div02').Huitab();
    }
    loadDivitionTable(0);
}

//加载分管表格
function loadDivitionTable(index) {
    var option = $.extend({
        url: $.mvcData.path('Method.GetPersonalList'),
        parms: {},
        heightDiff: 165 + DIFF_Height
    }, COMMON_Option);

    switch (index) {
        case 0:
            // #region 分管工作
            if ($Table.Division == null) {
                var DivisionWorkOption = $.extend(true, {}, option);
                DivisionWorkOption.parms.table = 'vvdivisionwork0';
                DivisionWorkOption.parms = $.extend({}, DivisionWorkOption.parms, { deptId: DeptId, sectionId: SectionId });
                DivisionWorkOption.cols = [
                    { display: '姓名', name: 'Fullname', width: 70, align: 'center' },
                    { display: '工作单位', name: 'WorkUnit', width: 220, align: 'center' },
                    { display: '分管内容', name: 'DividedContent', width: 150, align: 'center' },
                    { display: '开始时间', name: 'StartDate', width: 100, align: 'center' },
                    { display: '结束时间', name: 'EndDate', width: 100, align: 'center' },
                    { display: '效果', name: 'Effect', width: 180, align: 'left' }
                ];
                $Table.Division = $('#divitionList').btcTable(DivisionWorkOption);
            }
            $CURR_Table = $Table.Division;
            break;
        // #endregion
        case 1:
            // #region 重点工程及工作
            if ($Table.KeyProject == null) {
                var KeyProjectAndWorkOption = $.extend(true, {}, option);
                KeyProjectAndWorkOption.parms.table = 'vvdivisionwork1';
                KeyProjectAndWorkOption.parms = $.extend({}, KeyProjectAndWorkOption.parms, { deptId: DeptId, sectionId: SectionId });
                KeyProjectAndWorkOption.cols = [
                    { display: '姓名', name: 'Fullname', width: 70, align: 'center' },
                    { display: '工作单位', name: 'WorkUnit', width: 220, align: 'center' },
                    { display: '工程或工作名称', name: 'Name', width: 150, align: 'center' },
                    { display: '开始时间', name: 'StartDate', width: 150, align: 'center' },
                    { display: '结束时间', name: 'EndDate', width: 100, align: 'center' },
                    { display: '效果', name: 'Effect', width: 130, align: 'left' }
                ];
                $Table.KeyProject = $('#keyProjectList').btcTable(KeyProjectAndWorkOption);
            }
            $CURR_Table = $Table.KeyProject;
        // #endregion

        default:
    }
}

// 显示专项督察
function showInst_Investigate() {
    $('#divList').hide();
    $('#div02').hide();
    $('#div04').show();
    if ($Table.Patrol == null) {
        $('#div04').Huitab();
    }
    loadSpecailTable(0);
}

function setVisabledTabIndex(index) {
    /// <summary>设置当前显示的标签index, 并显示和隐藏公用工具栏的按钮</summary>
    INFO_Index = index;
    loadInstTable(index);
}

//加载专项督察表格
function loadSpecailTable(index) {
    var option = $.extend({
        url: $.mvcData.path('Method.GetPersonalList'),
        parms: { deptId: DeptId },
        heightDiff: 165 + DIFF_Height
    }, COMMON_Option);

    switch (index) {
        case 0:
            if ($Table.Patrol == null) {
                // #region 1.巡察巡查
                var PatrolInspectionOption = $.extend(true, {}, option);
                PatrolInspectionOption.parms.table = dy_tablename.VPatrolInspection;
                PatrolInspectionOption.parms = $.extend({}, PatrolInspectionOption.parms, { deptId: DeptId, sectionId: SectionId });
                PatrolInspectionOption.cols = [
                    { display: '姓名', name: 'Fullname', width: 70, align: 'center' },
                    { display: '工作单位', name: 'WorkUnit', width: 220, align: 'center' },
                    { display: '时间', name: 'Date', width: 100, align: 'center' },
                    { display: '内容', name: 'Content', width: 450, align: 'left' }
                ];
                $Table.Patrol = $('#PatrolInspectionList').btcTable(PatrolInspectionOption);
                // #endregion
            }
            $CURR_Table = $Table.Patrol;
            break;
        case 1:
            if ($Table.PostsAndStaff == null) {
                // #region 2.“定岗定职”专项督导
                var PostsAndStaffOption = $.extend(true, {}, option);
                PostsAndStaffOption.parms.table = dy_tablename.VPostsAndStaffInspection;
                PostsAndStaffOption.parms = $.extend({}, PostsAndStaffOption.parms, { deptId: DeptId, sectionId: SectionId });
                PostsAndStaffOption.cols = [
                    { display: '姓名', name: 'Fullname', width: 70, align: 'center' },
                    { display: '工作单位', name: 'WorkUnit', width: 220, align: 'center' },
                    { display: '时间', name: 'Date', width: 100, align: 'center' },
                    { display: '内容', name: 'Content', width: 450, align: 'center' }
                ];
                $Table.PostsAndStaff = $('#PostsAndStaffList').btcTable(PostsAndStaffOption);
                // #endregion
            }
            $CURR_Table = $Table.PostsAndStaff;
            break;
    }
}

//加载编制表格
function loadInstTable(index) {
    var option = $.extend({
        url: $.mvcData.path('Method.GetIntitionList'),
        // parms: { PersonalId: PersonalId },
        parms: { deptId: DeptId },
        heightDiff: 165 + DIFF_Height
    }, COMMON_Option);

    option.form = null;
    option.ondblclick = null;
    option.radio = false;

    switch (index) {
        case 0:
            if ($Table.Institutions == null) {
                // #region 干部编制情况
                var InstitutionsOption = $.extend(true, {}, option);
                InstitutionsOption.radio = true;
                InstitutionsOption.parms.table = dy_tablename.Institutions;
                InstitutionsOption.parms = $.extend({}, InstitutionsOption.parms, { deptId: DeptId, sectionId: SectionId });
                InstitutionsOption.cols = [
                    { display: '单位', name: 'WorkUnit', width: 220, align: 'left' },
                    { display: '正职<br/>编制数', name: 'hdLeadership', width: 50, align: 'right' },
                    { display: '副职<br/>编制数', name: 'hdLeaderDeputy', width: 50, align: 'right' },
                    { display: '中层<br/>编制数', name: 'hdMiddleLvel', width: 50, align: 'right' },
                    { display: '正职<br/>人数', name: 'sjLeadership', width: 50, align: 'right' },
                    { display: '副职<br/>人数', name: 'sjLeaderDeputy', width: 50, align: 'right' },
                    { display: '中层<br/>人数', name: 'sjMiddleLvel', width: 50, align: 'right' },
                    //{ display: '正职<br/>超编数', name: 'ls', width: 50, align: 'right' },

                    {
                        display: '正职<br/>超编数',
                        width: 50,
                        template: [
                            ['ls', 'lsSign'],  //在对应的视图新增一个字段 lsSign, ls>0 时为1，ls=0为0，ls<0 时为 -1
                            '<span class="dy-color{1}">{0}</span>' //在default.aspx 中新增三个样式，我已经加好了
                        ]
                    },
                    {
                        display: '副职<br/>超编数',
                        width: 50,
                        template: [
                            ['ld', 'ldSign'],  //在对应的视图新增一个字段 lsSign, ls>0 时为1，ls=0为0，ls<0 时为 -1
                            '<span class="dy-color{1}">{0}</span>' //在default.aspx 中新增三个样式，我已经加好了
                        ]
                    },
                    {
                        display: '中层<br/>超编数',
                        width: 50,
                        template: [
                            ['ml', 'mlSign'],  //在对应的视图新增一个字段 lsSign, ls>0 时为1，ls=0为0，ls<0 时为 -1
                            '<span class="dy-color{1}">{0}</span>' //在default.aspx 中新增三个样式，我已经加好了
                        ]
                    }
                ];
                //InstitutionsOption.onloaded = function () {
                //    $('#InstitutionsList').find('[dy-ls="1"]').addClass('');
                //    $('#InstitutionsList').find('[dy-ls="0"]').addClass('');
                //    $('#InstitutionsList').find('[dy-ls=""]').addClass('');
                //}
                $Table.Institutions = $('#InstitutionsList').btcTable(InstitutionsOption);

                // #endregion
            }
            $CURR_Table = $Table.Institutions;
            break;
        case 1:
            if ($Table.AgeStructure == null) {
                // #region 年龄结构
                var AgeStructureOption = $.extend(true, {}, option);
                AgeStructureOption.parms.table = dy_tablename.AgeStructure;
                AgeStructureOption.cols = [
                    { display: '单位', name: 'WorkUnit', width: 220, align: 'left' },
                    { display: '35周岁<br/>及以下', name: 'Under35', width: 50, align: 'right' },
                    { display: '36-45<br/>周岁', name: 'Between36_45', width: 50, align: 'right' },
                    { display: '46-55<br/>周岁', name: 'Between46_55', width: 50, align: 'right' },
                    { display: '56周岁<br/>及以上', name: 'Up56', width: 50, align: 'right' }
                ];
                //AgeStructureOption.heightDiff = 163;
                $Table.AgeStructure = $('#AgeStructureList').btcTable(AgeStructureOption);
                $Table.AgeStructure.setParms({ deptId: DeptId, sectionId: SectionId });
                // #endregion
            }
            $CURR_Table = $Table.AgeStructure;
            break;
        case 2:
            if ($Table.GenderStructure == null) {
                // #region 性别结构
                var GenderStructureOption = $.extend(true, {}, option);
                GenderStructureOption.parms.table = dy_tablename.GenderStructure;
                GenderStructureOption.cols = [
                    { display: '单位', name: 'WorkUnit', width: 220, align: 'left' },
                    { display: '男', name: 'man', width: 50, align: 'right' },
                    { display: '女', name: 'women', width: 50, align: 'right' }
                ];
                //GenderStructureOption.heightDiff = 163;
                $Table.GenderStructure = $('#GenderStructureList').btcTable(GenderStructureOption);
                $Table.GenderStructure.setParms({ deptId: DeptId, sectionId: SectionId });
                // #endregion
            }
            $CURR_Table = $Table.GenderStructure;
            break;
        case 3:
            if ($Table.EducationStructure == null) {
                // #region 学历结构
                var EducationStructureOption = $.extend(true, {}, option);
                EducationStructureOption.parms.table = dy_tablename.EducationStructure;
                EducationStructureOption.cols = [
                    { display: '单位名称', name: 'WorkUnit', width: 220, align: 'center' },
                    { display: '硕士及以上', name: 'UpMaster', width: 100, align: 'right' },
                    { display: '大学本科', name: 'Undergraduate', width: 100, align: 'right' },
                    { display: '大专', name: 'JuniorCollege', width: 100, align: 'right' },
                    { display: '大专以下', name: 'UnderJuniorCollete', width: 80, align: 'right' }
                ];
                $Table.EducationStructure = $('#EducationStructureList').btcTable(EducationStructureOption);
                $Table.EducationStructure.setParms({ deptId: DeptId, sectionId: SectionId });
                // #endregion
            }
            $CURR_Table = $Table.EducationStructure;
            break;
        case 4:
            //if ($Table.LeaderStructure == null) {
            //    // #region 经历结构
            //    var LeaderStructureOption = $.extend(true, {}, option);
            //    LeaderStructureOption.parms.table = dy_tablename.LeaderStructure;
            //    LeaderStructureOption.cols = [
            //        { display: '单位名称', name: 'WorkUnit', width: 220, align: 'left' },
            //        { display: '正科', name: 'Leadership', width: 100, align: 'left' },
            //        { display: '副科', name: 'LeaderDeputy', width: 100, align: 'left' },
            //        { display: '中层正职', name: 'MiddleLvelDeputy', width: 100, align: 'left' },
            //        { display: '中层副职', name: 'MiddleLvelDeputy', width: 40 }
            //    ];
            //    $Table.LeaderStructure = $('#LeaderStructureList').btcTable(LeaderStructureOption);
            //    $Table.LeaderStructure.setParms({ deptId: DeptId, sectionId: SectionId });
            //    // #endregion
            //}
            break;

        case 5:
            if ($Table.MajorStructure == null) {
                // #region 专业结构
                var MajorStructureOption = $.extend(true, {}, option);
                MajorStructureOption.parms.table = dy_tablename.MajorStructure;
                MajorStructureOption.cols = [
                    { display: '单位名称', name: 'WorkUnit', width: 220, align: 'center' },
                    { display: '高级', name: 'Leadership', width: 100, align: 'right' },
                    { display: '中级', name: 'Middle', width: 100, align: 'right' },
                    { display: '初级', name: 'Primary', width: 40, align: 'right' }
                ];
                $Table.MajorStructure = $('#MajorStructureList').btcTable(MajorStructureOption);
                $Table.MajorStructure.setParms({ deptId: DeptId, sectionId: SectionId });
                //#endregion
            }
            $CURR_Table = $Table.MajorStructure;
            break;
        default:
    }
}

//加载考察情况表格
function loadInstTable_Investigate(index) {
    var option = $.extend({
        url: $.mvcData.path('Method.GetPersonalList'),
        parms: {},
        heightDiff: 165 + DIFF_Height
    }, COMMON_Option);

    switch (index) {
        case 2:
            if ($Table.Ordinary == null) {
                // #region 平时考察
                var OrdinaryInspectionOption = $.extend(true, {}, option);
                OrdinaryInspectionOption.parms = { deptId: DeptId, sectionId: SectionId, table: 'vvInvestigate0' };
                OrdinaryInspectionOption.parms = $.extend({}, OrdinaryInspectionOption.parms, { deptId: DeptId, sectionId: SectionId });
                OrdinaryInspectionOption.cols = [
                    { display: '姓名', name: 'Fullname', width: 70, align: 'center' },
                    { display: '工作单位', name: 'WorkUnit', width: 220, align: 'center' },
                    { display: '时间', name: 'Date', width: 100, align: 'center' },
                    { display: '效果', name: 'Effect', width: 450, align: 'left' }
                ];
                $Table.Ordinary = $('#OrdinaryInspectionList').btcTable(OrdinaryInspectionOption);
                //$Table.Ordinary.setParms({ deptId: DeptId, sectionId: SectionId });
                // #endregion
            }
            $CURR_Table = $Table.Ordinary;
            break;
        case 3:
            if ($Table.Special == null) {
                // #region 专项考察
                var SpecialInspectionOption = $.extend(true, {}, option);
                SpecialInspectionOption.parms.table = 'vvInvestigate1';
                SpecialInspectionOption.parms = $.extend({}, SpecialInspectionOption.parms, { deptId: DeptId, sectionId: SectionId });
                SpecialInspectionOption.cols = [
                    { display: '姓名', name: 'Fullname', width: 70, align: 'center' },
                    { display: '工作单位', name: 'WorkUnit', width: 220, align: 'center' },
                    { display: '考察内容', name: 'InspectionContent', width: 150, align: 'center' },
                    { display: '上级考察部门', name: 'Superior', width: 150, align: 'center' },
                    { display: '时间', name: 'Date', width: 100, align: 'center' },
                    { display: '结论', name: 'Conclusion', width: 200 }
                ];
                $Table.Special = $('#SpecialInspectionList').btcTable(SpecialInspectionOption);
                //$Table.Special.setParms({ deptId: DeptId, sectionId: SectionId });
                // #endregion
            }
            $CURR_Table = $Table.Special;
            break;
        case 4:
            if ($Table.Annual == null) {
                // #region 年度考核
                var annualOption = $.extend(true, {}, option);
                annualOption.parms.table = 'vvInvestigate2';
                annualOption.parms = $.extend({}, annualOption.parms, { deptId: DeptId, sectionId: SectionId });
                annualOption.cols = [
                    { display: '姓名', name: 'Fullname', width: 70, align: 'center' },
                    { display: '工作单位', name: 'WorkUnit', width: 220, align: 'center' },
                    //{ display: '在职单位', name: 'WorkUnit', width: 200, align: 'center' },
                    { display: '时间', name: 'Date', width: 150, align: 'center' },
                    { display: '等级', name: 'Degree', width: 100, align: 'center' }
                ];
                $Table.Annual = $('#AnnualAppraisalList').btcTable(annualOption);
                // #endregion
            }
            $CURR_Table = $Table.Annual;
            break;
        case 5:
            if ($Table.Evaluation == null) {
                // #region 民主测评
                var DemocraticEvaluationOption = $.extend(true, {}, option);
                DemocraticEvaluationOption.parms.table = 'vvInvestigate3';
                DemocraticEvaluationOption.parms = $.extend({}, DemocraticEvaluationOption.parms, { deptId: DeptId, sectionId: SectionId });
                DemocraticEvaluationOption.cols = [
                    { display: '姓名', name: 'Fullname', width: 80, align: 'center' },
                    { display: '工作单位', name: 'WorkUnit', width: 220, align: 'center' },
                    { display: '测评内容', name: 'content', width: 150, align: 'center' },
                    { display: '参加测评人数', name: 'Number', width: 50, align: 'right' },
                    { display: '评价', name: 'Conclusion', width: 200, align: 'center' },
                    { display: '时间', name: 'Date', width: 120, align: 'center' }
                ];
                $Table.Evaluation = $('#DemocraticEvaluationList ').btcTable(DemocraticEvaluationOption);
                // #endregion
            }
            $CURR_Table = $Table.Evaluation;
            break;
        case 6:
            if ($Table.DemocraticRecommendation == null) {
                // #region 民主推荐
                var DemocraticRecommendationOption = $.extend(true, {}, option);
                DemocraticRecommendationOption.parms.table = 'vvInvestigate4';
                DemocraticRecommendationOption.parms = $.extend({}, DemocraticRecommendationOption.parms, { deptId: DeptId, sectionId: SectionId });
                DemocraticRecommendationOption.cols = [
                    { display: '姓名', name: 'Fullname', width: 70, align: 'center' },
                    { display: '单位', name: 'RecommendationUnit', width: 200, align: 'center' },
                    { display: '地点', name: 'Place', width: 200, align: 'center' },
                    { display: '人数', name: 'Number', width: 50, align: 'right' },
                    { display: '占比%', name: 'Proportion', width: 50, align: 'center' },
                    { display: '时间', name: 'Date', width: 100, align: 'right' },
                    { display: '内容', name: 'Content', width: 200 }
                ];
                $Table.DemocraticRecommendation = $('#DemocraticRecommendationList').btcTable(DemocraticRecommendationOption);
                // #endregion
            }
            $CURR_Table = $Table.DemocraticRecommendation;
            break;
    }
}

function importPersonal() {
    layer.open({
        type: 2,
        content: '../ExImport/Import.aspx',
        title: '导入信息'
    });
}

function onDeptClick(e, treeId, treeNode) {
    //ZTreeObj.expandAll(false);
    $.each($Table,
        function (key, value) {
            if (value == null || key == 'psntForQuery') {
                return true;
            }
            value.setParms({ deptId: treeNode.id, sectionId: treeNode.id });
        });

    if (treeNode.id > 0) {
        if (DeptId > 0 && DeptId != treeNode.id && treeNode.id < 1000) {
            ZTreeObj.expandNode(ZTreeObj.getNodeByParam('id', DeptId), false);
        }
        if (DeptId > 1000 && treeNode.id < 1000) {
            ZTreeObj.expandNode(ZTreeObj.getNodeByParam('id', ParentDeptId), false);
        }
        ZTreeObj.expandNode(treeNode, true);

        var parentNode = treeNode.getParentNode();
        DeptId = treeNode.id;
        DeptName = treeNode.name;
        if (parentNode != null) {
            ParentDeptId = parentNode.id;
        }
    }

    CurrNode = treeNode;

    console.log('deptId: ' + DeptId + ', ' + 'parent: ' + ParentDeptId);

    IsDept = DeptId >= 1000 && DeptId < 1000000;

    fillDeptEditFormValue();
}

function fillDeptEditFormValue() {
    var id = CurrNode.id;

    $('#frmEditDept').find('input').enabled(id > 0);
    $('#frmNewDept').find('input').enabled(id > 0);
    $('#frmSubDept').find('input').enabled(id < 1000);

    $('#frmEditDept [name="id"]').val(id);
    $('#frmEditDept [name="name"]').val(DeptName);

    $('#frmNewDept [name="pId"]').val(ParentDeptId);
    $('#frmNewDept [name="id"]').val(ParentDeptId);
    $('#frmSubDept [name="pId"], #frmSubDept [name="id"]').val(id);
}

function showViewDlg(isEdit) {
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

function setTableOption() {
    var option = $.extend({
        form: '#frmSearch',
        heightDiff: 170 + DIFF_Height
    }, COMMON_Option);
    var colParm = {
        personal: [
            { display: '姓名', name: 'Fullname', width: 70, align: 'center' },
            { display: '身份证号', name: 'PersonalIdCard', width: 150 },
            { display: '性别', name: 'Gender', width: 32, rend: [1, '男', 0, '女'] },
            { display: '出生日期', name: 'Birthday', width: 80 },
            { display: '民族', name: 'Ethnicity', width: 90, align: 'center' },
            { display: '政治面貌', name: 'PoliticsStatus', width: 80, align: 'center' },
            { display: '工作单位', name: 'WorkUnit', width: 220, align: 'center' },
            { display: '科室', name: 'SectionName', width: 150, align: 'center' },
            { display: '职务', name: 'Duty', width: 90, align: 'center' },
            { display: '职级', name: 'WorkDegree', width: 80, align: 'center' },
            { display: '专业', name: 'MajorDegree', width: 80, align: 'center' },
            { display: '参加工作时间', name: 'WorkDate', width: 90 }
        ],
        'inspection': [
            { display: '姓名', name: 'Fullname', width: 70, align: 'center' },
            { display: '单位名称', name: 'WorkUnit', width: 240, align: 'center' },
            { display: '预警内容', name: 'Content', width: 200, align: 'left' },
            { display: '预警类型', name: 'ContentKind', width: 100, align: 'center' },
            { display: '处理结果', name: 'TreatmentResult', width: 100, align: 'left' },
            { display: '上报时间', name: 'Date', width: 100, align: 'center' },
            { display: '上报单位', name: 'ReportUnit', width: 100, align: 'center' },
            { display: ' 处理时间', name: 'TreatmentDate', width: 100, align: 'center' }

        ],
        'other': [
            { display: '姓名', name: 'Fullname', width: 70, align: 'center' },
            { display: '单位名称', name: 'WorkUnit', width: 220, align: 'center' },
            { display: '职务', name: 'Duty', width: 100, align: 'center' },
            { display: '培训班次', name: 'TrainingClass', width: 200, align: 'right' },
            { display: '开始时间', name: 'StartDate', width: 100, align: 'center' },
            { display: '学时', name: 'ClassHour', width: 100, align: 'right' }

        ]
    }
    for (var i = 0; i < KEY_Arr.length; i++) {
        var key = KEY_Arr[i];
        TABLE_Option[key] = $.extend(true, {}, option);
        TABLE_Option[key].url = $.mvcData.path('Method.GetPersonalList') + '?table=' + TABLE_Name[key];
        TABLE_Option[key].cols = colParm[key];
    }
    TABLE_Option.personal.heightDiff = 132 + DIFF_Height;
    TABLE_Option.inspection.heightDiff = 132 + DIFF_Height;
    TABLE_Option.other.heightDiff = 132 + DIFF_Height;
}

function loadTable(index) {
    if (index >= KEY_Arr.length) {
        return;
    }
    var key = KEY_Arr[index];
    if (key == '') {
        return;
    }

    if ($Table[key] == null) {
        TABLE_Option[key].parms = $.extend({}, TABLE_Option[key].parms, { deptId: DeptId, sectionId: SectionId });
        $Table[key] = $('#' + key).btcTable(TABLE_Option[key]);
    }
    $CURR_Table = $Table[key];

    //if (DeptId > 0) {
    //    $Table[key].setParms({ deptId: DeptId, sectionId: SectionId });
    //}
}
function reloadTable() {
    for (var i = 0; i < KEY_Arr.length; i++) {
        var key = KEY_Arr[i];
        if ($Table[key] != null) {
            $Table[key].reload();
        }
    }
}
function fillDeptList() {
    var setting = {
        view: {
            selectedMulti: false, //设置是否能够同时选中多个节点
            showIcon: true,  //设置是否显示节点图标
            showLine: true,  //设置是否显示节点与节点之间的连线
            showTitle: true,  //设置是否显示节点的title提示信息
            dblClickExpand: false
        },
        data: {
            simpleData: {
                enable: true, //设置是否启用简单数据格式（zTree支持标准数据格式跟简单数据格式，上面例子中是标准数据格式）
                idKey: "id",  //设置启用简单数据格式时id对应的属性名称
                pidKey: "pId", //设置启用简单数据格式时parentId对应的属性名称,ztree根据id及pid层级关系构建树结构
                rootPId: -1
            }
        },
        callback: {
            onClick: onDeptClick
        }
    };

    var data = $.btcData.get(dy_url.getList('SysDepartment')).rows;
    ZTreeObj =
        $.fn.zTree.init($("#left"),
            setting,
            data); //初始化zTree，三个参数一次分别是容器(zTree 的容器 className 别忘了设置为 "ztree")、参数配置、数据源
    ZTreeObj.expandNode(ZTreeObj.getNodeByParam('id', 0), true);
}

function changeType(index, dom) {
    /// <summary>更改显示的类型（0 基本情况, 1 督查信息, 2 分管情况, 3 考察情况, 4 专项督查, 5 培训信息, 6 综合查询, 7 编制）</summary>
    /// <param name='index' type='int'>类型索引</param>
    /// <param name='dom' type='object'>单击的dom对象</param>
    $('#div0').hide();
    $('#list').show();
    $('#divList').show();
    $('#div03').hide();
    $('#div02').hide();
    $('#div04').hide();
    $('#query').hide();
    $('#divDeptMgr').hide();

    IS_Train = $('#lblTrain').hide().prop("checked");
    $('#lblTrain').prop('checked', false);
    if (dom != null) {
        var $thisLi = $(dom).parent();

        //修改选中状态
        $thisLi.siblings().removeClass('li-selected');
        $thisLi.addClass('li-selected');
    }

    //显示隐藏工具栏按钮
    var $toolSpan = $('#tool').find('span');
    $toolSpan.hide();

    $('#divList').children().hide();

    switch (index) {
        case 0:
            $toolSpan.show();
            $('#' + KEY_Arr[index]).show();
            break;
        case 1:
            $('#' + KEY_Arr[index]).show();
            $toolSpan.showPart(0, 1, 2, 3, 7);
            break;
        case 2:
            showDivision();
            $toolSpan.showPart(0, 1, 2, 3, 7);
            break;
        case 3:
            showSpecial();
            $toolSpan.showPart(0, 1, 2, 3, 7);
            break;
        case 4:
            showInst_Investigate(0);
            $toolSpan.showPart(0, 1, 2, 3, 7);
            break;
        case 5:
            $('#' + KEY_Arr[index]).show();
            $toolSpan.showPart(0, 1, 2, 3, 7);
            $('#lblTrain').show().prop("checked", IS_Train);
            break;
        case 6:
            $('#list').hide();
            showQuery();
            break;
        case 7:
            showInst();
            $toolSpan.showPart(0, 1, 2, 7);
            break;
        case 8:
            $('#divDeptMgr').show().Huitab();
            $toolSpan.showPart(0, 1, 2, 4);
            break;
    }

    loadTable(index);

    //todo 修改查看类型
    TYPE_No = index;

    FILE_Name = TYPE_Names[index];
}

// #region 单击工具按钮功能

// 综合查询
function showQuery() {
    $('#query').show();
    if ($Table.psntForQuery != null) {
        return;
    }
    var option = {
        url: $.mvcData.path('List.Query'),
        parms: {},
        heightDiff: 274,
        form: '#frmQuerySearch',
        radio: false,
        ondblclick: function (item, $td) {
            var info = layer.open({
                type: 2,
                content: 'ApprovalTable.aspx?PersonalIdCard=' + item.PersonalIdCard,
                title: 'test'
            });
            layer.full(info);
        }
    };

    // #region
    var eduExperienceOption = $.extend(true, {}, option);
    eduExperienceOption.cols = [
        { display: '姓名', name: 'Fullname', width: 60, align: 'left' },
        { display: '性别', name: 'Gender', width: 32, rend: [1, '男', 0, '女'], align: 'center' },
        { display: '出生日期', name: 'Birthday', width: 80, align: 'center' },
        { display: '工作单位', name: 'WorkUnit', width: 220, align: 'center' },
        { display: '职务', name: 'Duty', width: 90, align: 'center' },
        { display: '职级', name: 'WorkDegree', width: 80, align: 'center' },
        //{ display: '学校', name: 'School', width: 150, align: 'left' },
        //{ display: '院系', name: 'Department', width: 100, align: 'left' },
        { display: '毕业专业', name: 'Major', width: 100, align: 'center' },
        { display: '学历', name: 'EduBackground', width: 120, align: 'center' },
        { display: '奖励等级', name: 'RewardDegree', width: 120, align: 'center' },
        { display: '奖励次数', name: 'RewardCount', width: 120, align: 'right' },
        { display: '处分等级', name: 'PunishDegree', width: 120, align: 'lecenterft' },
        { display: '处分次数', name: 'PunishCount', width: 120, align: 'right' }
    ];
    $Table.psntForQuery = $('#psntForQuery').btcTable(eduExperienceOption);
}

function showSpecial() {
    $('#div03').show();
    if ($Table.Ordinary == null) {
        $('#div03').Huitab();
    }
    loadInstTable_Investigate(2);
}

function getPersonalId() {
    //return $Table[KEY_Arr[TYPE_No]].getSelectedValue('PersonalIdCard');
    //var isVisibledTables = [];
    $.each($Table,
        function (key, value) {
            if ($Table[key] != null && $Table[key]._$element.is(':visible')) {
                //isVisibledTables.push($Table[key]._$element.attr('id'));
                $CURR_Table = $Table[key];
            }
        });
    //layer.alert(isVisibledTables.join('<br/>'));
    return $CURR_Table.getSelectedItem();//.getSelectedValue('PersonalIdCard', 'Fullname');
}

function operate(index) {
    /// <summary>进行相关操作</summary>
    /// <param name='index' type='int'>操作编码
    /// 0 导出，1 查看，2 新增，3 修改，4 调动，5 调离，6 退休
    /// </param >

    if (index == 0) {
        exportInfo();
        return;
    }
    if (TYPE_No == 0 && index == 2) {
        if (!IsDept) {
            layer.msg('请选择单位后重试。');
            return;
        }
        LAYER_Dlg = showHtml('personal.aspx?deptId={0}&deptName={1}&sectionId={2}&sectionName={3}'.format(DeptId, DeptName, SectionId, SectionName),
            '添加个人信息',
            DLG_Location.width, DLG_Location.height,
            DLG_Location.top, DLG_Location.left);
        return;
    }

    if (TYPE_No == 5 && index == 2) {//新增培训信息
        layer.open({
            type: 1,
            content: $('#dlgTra'),
            area: '400px'
        });
        $('#fullName').empty().btcNamebox({
            valueTarget: "#personalIdCard",
            url: '/AjaxList/GetPersonal.cspx',
            maxColumn: 1,
            id: 'PersonalIdCard',
            cols: [{ name: "Fullname", width: 70 }, { name: "WorkUnit", width: 200 }],
            width: 270,
            diffTop: -2,
            diffLeft: -6,
            //showName: "fullname",
            value: ""
        });

        return;
    }

    if (index > 3 && index < 7) {
        var titles = ['', '查看', '新增', '修改', '调动', '调离', '退休'],
            psnlInfo = getPersonalId();

        if (psnlInfo == null) {
            layer.msg('请选择人员后重试。');
            return;
        }
        $('#dlgMovePersonal')
            .setFormCtrlValue(psnlInfo)
            .find('input[type="radio"]').readonly();
        $('[name="StartDate"]').val('');
        $('#dlgMovePersonal [name="Degree"]').val(psnlInfo.WorkDegree);
        var area = ['410px', '470px'];
        if (index == 6) {
            $('#dlgMovePersonal form div').hide().showPart(0, -1);
            area[1] = '305px';
            $('#NowWorkUnit,[name="SectionName"],[name="Duty"],[name="Degree"]').val('');
            $('#DeptID').val(-1);
        } else {
            if (index == 5) {
                $('#DeptID').val(-1);
            }
            $('#dlgMovePersonal form div').show();
            area[1] = '470px';
        }
        layer.open({
            type: 1,
            content: $('#dlgMovePersonal'),
            title: psnlInfo.Fullname + ' ' + titles[index] + '操作',
            area: area
        });
        if (index == 4) {
            $('#WorkUnit').empty().btcNamebox({
                valueTarget: '#DeptID',
                cols: [{ name: 'name', width: 300 }],
                url: '/AjaxList/GetDept.cspx?isDept=true',
                onchange: function (item) {
                    $('#NowWorkUnit').val(item.name);
                }
            });
        } else {
            $('#WorkUnit').hide();
            $('#NowWorkUnit').show();
        }
        return;
    }
    showThisDlg(index);
}
function exportInfo() {
    /// <summary>导出信息</summary>
    var opt = $CURR_Table._options;
    var url = opt.url,
        cols = [],
        parms = $.extend(true, {}, $CURR_Table._parms);
    for (var i = 0; i < opt.cols.length; i++) {
        cols.push(opt.cols[i].name);
        cols.push(opt.cols[i].display.replace('<br/>', ''));
    }
    parms.colName = cols.join('~');
    var urlParms = [];
    $.each(parms,
        function (key, value) {
            if (key == 'page' || key == 'pagesize' || value == null || value == 'null') {
                return true;
            }
            urlParms.push(key + '=' + value);
        });
    urlParms.push('page=0&pagesize=0');
    //urlParms.push('fileName=' + TYPE_Names[TYPE_No]);

    url = url + (url.indexOf('?') >= 0 ? '&' : '?') + urlParms.join('&');
    window.open(url);
    //layer.msg('此功能正在开发...');
}

function showThisDlg(index) {
    var titles = ['', '查看', '新增', '调动', '调离', '退休'];

    if (index == 2) {
        $('#selFullName').empty().btcNamebox({
            valueTarget: "#selPersonalIdCard",
            url: '/AjaxList/GetPersonal.cspx',
            maxColumn: 1,
            id: 'PersonalIdCard',
            cols: [{ name: "Fullname", width: 70 }, { name: "WorkUnit", width: 200 }],
            width: 300,
            diffLeft: -6,
            //showName: "fullname",
            value: ""
        });

        layer.open({
            type: 1,
            content: $('#dlgSelectPsnl'),
            area: '400px'
        });

        $('#btnInputIdCard').unbind('click').on('click',
            function () {
                var personalId = $('#selPersonalIdCard').val();
                if (personalId != '') {
                    layer.closeAll();
                    LAYER_Dlg = showHtml(HTML_Urls[TYPE_No] + '?personalIdCard=' + personalId + '&height=' + DLG_Location.height,
                        titles[index] + ' ' + $('.nameInput').val() + TYPE_Names[TYPE_No],
                        DLG_Location.width, DLG_Location.height,
                        DLG_Location.top, DLG_Location.left);
                } else {
                    layer.msg('请输入姓名。');
                }
            });
        return;
    }
    var personalShorInfo = getPersonalId();
    if (personalShorInfo == null || personalShorInfo == '') {
        layer.msg('请选择人员后进行相应操作。');
        return;
    }

    if (index > 3) {
        showDlg($('#dlgMovePersonal'), 300, 200);
        return;
    }

    LAYER_Dlg = showHtml(HTML_Urls[TYPE_No] +
        '?personalId=' +
        personalShorInfo.ID +
        '&personalIdCard=' +
        personalShorInfo.PersonalIdCard +
        '&height=' +
        DLG_Location.height,
        titles[index] + ' ' + personalShorInfo.Fullname + ' ' + TYPE_Names[TYPE_No],
        DLG_Location.width,
        DLG_Location.height,
        DLG_Location.top,
        DLG_Location.left);
}
// #endregion

function logout() {
    layer.confirm('确定要退出吗？', function (index) {
        layer.close(index);
        $.mvcData.get('User.Logout');
        window.parent.location.href = '/user/login.aspx';
    });
}

function downTemplate() {
    window.open('/download/模板.zip');
}