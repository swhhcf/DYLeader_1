/// <reference path="../lib/jquery.form.js"/>
/// <reference path="../lib/jquery/jquery-1.7.2-vsdoc.js"/>
/// <reference path="../lib/common.js"/>
/// <reference path="../lib/jquery.ext.js"/>
/// <reference path="../script/common.js"/>
/// <reference path="../lib/controls/btctable/control.js"/>
/// <reference path="../lib/ajaxupload.js"/>
/// <reference path="../lib/controls/NameBox/namebox.js"/>

// 0 个人基本信息, 1 教育简历, 2 工作简历, 3 技术职务, 4 奖惩情况, 5 年度考核情况, 6 家庭成员, 7 拟任免职务
var INFO_Index = 0;

var OBJ_Keys = ['', 'edu', 'work', 'major', 'reward', 'annual', 'family', 'plane'];

var LAYER_Dlg = null;

var $Table = {
    edu: null,
    work: null,
    major: null,
    reward: null,
    annual: null,
    family: null,
    plane: null
};

var FORM_Id = {
    edu: '#frmEdu',
    work: '#frmWorkExperience',
    major: '#frmMajorDegree',
    reward: '#frmRewardPunish',
    annual: '#frmAnnualAppraisal',
    family: '#frmFamilyMember',
    plane: '#frmPlaneAppointRemove'
};

var PersonalIdCard = $.btcData.getQueryString('personalIdCard');
var PersonalId = $.btcData.getQueryString('personalId');

var TABLE_Names = [
    'VPersonal',
    'EduExperience',
    'WorkExperience',
    'MajorDegree',
    'RewardPunish',
    'AnnualAppraisal',
    'FamilyMember',
    'PlaneAppointRemove'
];
// 对话框 div 的 id
var DLG_Ids = [
    '',
    '#dlgEdu',
    '#dlgWorkExperience',
    '#dlgMajorDegree',
    '#dlgRewardPunish',
    '#dlgAnnualAppraisal',
    '#dlgFamilyMember',
    '#dlgPlaneAppointRemove'
];
var TABLE_Objs = new Array(8);

var $CURR_Table = null;

$(function () {
    setDiv0Area();

    var height = $.btcData.getQueryString('height') * 1 - 110;

    $('#divPersonal').height(height);

    $('#divPlaneAppointRemove').height(height - 4);

    $('#ifrApproval').attr('src', 'ApprovalTable.aspx?isShowClose=1&personalIdCard=' + PersonalIdCard);
    //$('#ifrApproval').height($(document))
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

    fillPersonalInfo();

    showHideTab();

    $('form').keydown(function (e) {
        var event = e || window.event;
        if (event.keyCode == 13) {
            event.returnValue = false;
            event.cancelBubble = true;
            return false;
        }
    });

    removeOther();
});

function fillPersonalInfo() {
    if (PersonalId != null) {
        var personalInfo = $.mvcData.get('Method.Get',
            { table: TABLE_Names[0], id: PersonalId }).rows[0];
        psId = personalInfo.politicsId,
            addrId = personalInfo.addrId,
            wId = personalInfo.workExperienceId,
            psInfo = $.mvcData.get('Method.Get',
                { table: 'Politics', id: 0 + psId }).rows[0],
            addrInfo = $.mvcData.get('Method.Get',
                { table: 'Addr', id: 0 + addrId }).rows[0],
            workInfo = $.mvcData.get('Method.Get',
                { table: 'WorkExperience', id: 0 + wId }).rows[0];

        //填充数据
        $('#frmpersonal').setFormCtrlValue(personalInfo);
        $('#frmAddr').setFormCtrlValue(addrInfo);
        $('#frmPolitical').setFormCtrlValue(psInfo);
        $('#frmWorkUnit').setFormCtrlValue(workInfo);

        $('[name="PersonalIdCard"]').val(personalInfo.PersonalIdCard);
        PersonalIdCard = personalInfo.PersonalIdCard;

        //显示照片
        $("#ifrPic").contents().find("#imgPic")
            .attr('src', '../Picture/' + personalInfo.PersonalIdCard + '.jpg?' + Date.now());
    } else {
        var deptName = decodeURI($.btcData.getQueryString('deptName')),
            sectionName = decodeURI($.btcData.getQueryString('sectionName'));
        $('#DeptID').val($.btcData.getQueryString('deptId'));
        //$('#WorkUnit').html(deptName);
        $('#NowWorkUnit').val(deptName);
        $('#SectionID').val($.btcData.getQueryString('sectionId'));
        //$('#SectionName').html(sectionName);
        $('#NowSectionName').val(sectionName);
    }
    //出生地、籍贯更改为自动完成
    //$('#NativeOrigin').btcNamebox(getAreaOption('Area', 'NativeOrigin'));
    //$('#NativePlace').btcNamebox(getAreaOption('Area', 'NativePlace'));
    //$('#Ethnicity').btcNamebox(getAreaOption('Ethnicity', 'Ethnicity', 'Ethnicity'));

    /*
    //单位 科室 更改为自动完成
    $('#SectionName').empty().btcNamebox({
        valueTarget: '#SectionID',
        cols: [{ name: 'name', width: 200 }],
        url: '/AjaxList/GetDept.cspx?isDept=false'
        //value: $('#SectionID').val()
    });
    $('#WorkUnit').btcNamebox({
        valueTarget: '#DeptID',
        //value: $('#DeptID').val(),
        cols: [{ name: 'name', width: 200 }],
        url: '/AjaxList/GetDept.cspx?isDept=true',
        onchange: function (item) {
            $('#NowWorkUnit').val(item.name);

            //科室更改为自动完成
            $('#SectionName').empty().btcNamebox({
                valueTarget: '#SectionID',
                cols: [{ name: 'name', width: 200 }],
                url: '/AjaxList/GetDept.cspx?isDept=false&pId=' + item.id,
                onchange: function (section) {
                    $('#NowSectionName').val(section.name);
                }
            });
        }
    });
    */
}

function showHideTab() {
    var $tab = $('#divTab').find('span');
    if (PersonalId == null) {
        $tab.hide();
        $tab.eq(0).show();
    } else {
        $tab.show();
    }
}

function setVisabledTabIndex(index) {
    /// <summary>设置当前显示的标签index, 并显示和隐藏公用工具栏的按钮</summary>
    var $spans = $('#divToolBar').find('span');
    INFO_Index = index;
    if (index < 1) {
        $spans.hide().eq(-2).show();
    } else {
        $spans.show().eq(-2).hide();
    }
    $spans.eq(-1).show();
    loadTable(index);

    removeOther();
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
    } else {
        $(FORM_Id[key]).clearFormCtrlValue();
        $(FORM_Id[key]).find('[name="ID"]').val('');
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
        //value: $('[name="' + fieldName + '"]').val()
    }
};

function submitPersonal() {
    submitAll($('#frmpersonal'),
        dy_url.save(dy_tablename.personal),
        {},
        function (data) {
            var msg = '成功更新个人信息。';
            if (data.id != null) {
                msg = '成功新增个人信息。';
                PersonalIdCard = $('#IdCard_1').val();
                $('[name="PersonalIdCard"]').val(PersonalIdCard);
                loadTable();
            }
            if (!data.success) {
                msg = data.errorMsg;
            } else {
                // 保存照片
                var idCard = $("#IdCard_1").val();
                $("#ifrPic").contents().find("#picname").val(idCard);
                $("#ifrPic")[0].contentWindow.uploadPic();
                //$("#ifrPic").contents().find("#btnUpPic").trigger('click');

                submitAll($('#frmPolitical'), dy_url.save(dy_tablename.politics));
                submitAll($('#frmAddr'), dy_url.save(dy_tablename.addr));
                submitAll($('#frmWorkUnit'), dy_url.save(dy_tablename.workExperience));
                parent.window.reloadTable();
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
                var id = $frm.find('[name="ID"]').val();
                submitAll($frm, null, {}, function () {
                    $frm.clearFormCtrlValue();
                    $Table[key].reload();
                    if (id != '') {
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
        heightDiff: 40,
        radio: true
    };

    switch (index) {
        case 1:
            if ($Table.edu == null) {
                // #region 教育经历
                var eduOption = $.extend(true, {}, option);
                eduOption.parms.table = dy_tablename.eduExperience;
                eduOption.cols = [
                    { display: '是否为全日制', name: 'IsFullTime', width: 40, rend: [1, '是', 0, '否'] },
                    { display: '学校', name: 'School', width: 100, align: 'center' },
                    { display: '院系', name: 'Department', width: 100, align: 'center' },
                    { display: '专业', name: 'Major', width: 150, align: 'center' },
                    { display: '入学时间', name: 'StartDate', width: 90 },
                    { display: '毕结业时间', name: 'EndDate', width: 90 },
                    { display: '毕结业状态', name: 'Status', width: 40 },
                    { display: '学历', name: 'EduBackground', width: 100, align: 'center' },
                    { display: '学位', name: 'Degree', width: 100, align: 'center' }
                ];
                $Table.edu = $('#eduList').btcTable(eduOption);
                // #endregion
            }
            break;
        case 2:
            if ($Table.work == null) {
                // #region 工作简历
                var workOption = $.extend(true, {}, option);
                workOption.parms.table = dy_tablename.workExperience;
                workOption.cols = [
                    { display: '单位', name: 'WorkUnit', width: 200, align: 'center' },
                    { display: '科室名称', name: 'SectionName', width: 120, align: 'center' },
                    { display: '开始时间', name: 'StartDate', width: 90, align: 'center' },
                    { display: '结束时间', name: 'EndDate', width: 90, align: 'center' },
                    { display: '职务', name: 'Duty', width: 100, align: 'center' },
                    { display: '职级', name: 'Degree', width: 90, align: 'center' },
                    { display: '是否现任', name: 'Status', width: 100, rend: [1, '是', 0, '否'] }
                ];
                $Table.work = $('#WorkExperienceList').btcTable(workOption);
                // #endregion
            }
            break;
        case 3:
            if ($Table.major == null) {
                // #region 技术职务
                var majorOption = $.extend(true, {}, option);
                majorOption.parms.table = dy_tablename.majorDegree;
                majorOption.cols = [
                    { display: '专业方向', name: 'Major', width: 150, align: 'center' },
                    { display: '专业特长', name: 'Speciality', width: 150, align: 'center' },
                    { display: '技术等级', name: 'Degree', width: 100, align: 'center' },
                    { display: '取得时间', name: 'Date', width: 90 }
                ];
                $Table.major = $('#MajorDegreeList').btcTable(majorOption);
                // #endregion
            }
            break;
        case 4:
            if ($Table.reward == null) {
                // #region 奖惩情况
                var rewardOption = $.extend(true, {}, option);
                rewardOption.parms.table = dy_tablename.rewardPunish;
                rewardOption.cols = [
                    { display: '在职单位', name: 'WorkUnit', width: 150, align: 'center' },
                    { display: '奖励或处分', name: 'IsReward', width: 100, align: 'center', rend: [1, '奖励', 0, '处分'] },
                    { display: '时间', name: 'Date', width: 100, align: 'center' },
                    { display: '发布单位', name: 'ReleaseUnit', width: 150, align: 'center' },
                    { display: '级别', name: 'Degree', width: 90 },
                    { display: '事由', name: 'Memo', width: 240, align: 'left' }
                ];
                $Table.reward = $('#RewardPunishList').btcTable(rewardOption);
                // #endregion
            }
            break;
        case 5:
            if ($Table.annual == null) {
                // #region 年度考核
                var annualOption = $.extend(true, {}, option);
                annualOption.parms.table = dy_tablename.annualAppraisal;
                annualOption.cols = [
                    { display: '在职单位', name: 'WorkUnit', width: 200, align: 'center' },
                    { display: '时间', name: 'Date', width: 120, align: 'center' },
                    { display: '等级', name: 'Degree', width: 120, align: 'center' }
                ];
                $Table.annual = $('#AnnualAppraisalList').btcTable(annualOption);
                // #endregion
            }
            break;
        case 6:
            if ($Table.family == null) {
                // #region 家庭成员
                var familyOption = $.extend(true, {}, option);
                familyOption.parms.table = dy_tablename.familyMember;
                familyOption.cols = [
                    { display: '关系', name: 'Relation', width: 90, align: 'center' },
                    { display: '姓名', name: 'Fullname', width: 130, align: 'center' },
                    { display: '出生年月', name: 'FmBirthday', width: 160, align: 'center' },
                    { display: '政治面貌', name: 'PoliticsStatus', width: 100, align: 'center' },
                    { display: '工作单位', name: 'WorkUnit', width: 220, align: 'center' },
                    { display: '职务', name: 'Duty', width: 130, align: 'center' }
                ];
                $Table.family = $('#FamilyMemberList').btcTable(familyOption);
                // #endregion
            }
            break;
        case 7:
            if ($Table.plane == null) {
                // #region 拟任免职务
                var planeOption = $.extend(true, {}, option);
                planeOption.parms.table = dy_tablename.planeAppointRemove;
                planeOption.cols = [
                    { display: '拟任职务', name: 'Appoint', width: 150, align: 'center' },
                    { display: '拟免职务', name: 'Appoint', width: 150, align: 'center' },
                    { display: '任免理由', name: 'Memo', width: 150, align: 'left' },
                    { display: '呈报单位', name: 'ReportingUnit', width: 150, align: 'center' },
                    { display: '呈报时间', name: 'ReportingDate', width: 100, align: 'center' },
                    { display: '审批机关', name: 'ExaminationAuthority', width: 150, align: 'center' },
                    { display: '审批时间', name: 'ExaminationDate', width: 100, align: 'center' },
                    { display: '行政机关任免意见', name: 'AppointmentOpinion', width: 150, align: 'left' },
                    { display: '行政机关任免时间', name: 'AppointmentDate', width: 100, align: 'left' },
                    { display: '填表人姓名', name: 'FillFormName', width: 120, align: 'left' }
                ];
                $Table.plane = $('#PlaneAppointRemoveList').btcTable(planeOption);
                // #endregion
            }
            break;
        default:
            break;
    }

    $CURR_Table = $Table[OBJ_Keys[index]];
}

//从“身份证”中获取“出生年月”和“性别”
function myclick(data) {
    // alert($("#IdCard_1").val());
    // alert($(data).val());
    var idCard = $("#IdCard_1").val();
    var year = idCard.substr(6, 4);
    var month = idCard.substr(10, 2);
    var day = idCard.substr(12, 2);
    var gender = 1 - idCard.substr(16, 1) % 2;
    var ym = (year + '-' + month + "-" + day);
    $("#Birthday_1").val(ym);
    $('[name="Gender"]').removeAttr('checked');
    $('[name="Gender"]').eq(gender).prop('checked', 'checked');
    $("#ifrPic").contents().find("#picname").val(idCard);
}