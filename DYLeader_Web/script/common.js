/// <reference path="../lib/jquery/jquery-1.7.2-vsdoc.js"/>
/// <reference path="../lib/common.js"/>
/// <reference path="../lib/jquery.ext.js"/>
/// <reference path="../lib/jquery.form.js"/>

var dy_url = {
    save: function (tablename) {
        return '/AjaxMethod/Save.cspx?table=' + tablename;
    },
    get: function (tablename, id) {
        return '/AjaxMethod/Get.cspx?table=' + tablename + '&id=' + id;
    },
    getList: function (tablename) {
        return '/AjaxMethod/GetList.cspx?table=' + tablename;
    }
}

var dy_tablename = {
    personal: 'Personal',
    politics: 'Politics',
    workExperience: 'WorkExperience',
    addr: 'Addr',
    eduExperience: 'EduExperience',
    majorDegree: 'MajorDegree',
    rewardPunish: 'RewardPunish',
    annualAppraisal: 'AnnualAppraisal',
    familyMember: 'FamilyMember',
    planeAppointRemove: 'PlaneAppointRemove',
    DivisionWork: 'DivisionWork',
    KeyProjectAndWork: 'KeyProjectAndWork',
    OrdinaryInspection: 'OrdinaryInspection',
    SpecialInspection: 'SpecialInspection',
    DemocraticEvaluation: ' DemocraticEvaluation',
    DemocraticRecommendation: 'DemocraticRecommendation',
    PatrolInspection: 'PatrolInspection',
    PostsAndStaffInspection: 'PostsAndStaffInspection',
    TrainingLearning: 'TrainingLearning',
    ViolatingLaw: 'InspectorInspection', // 'ViolatingLaw',
    Petition: 'Petition',
    Filing: 'Filing',
    ViolationHouse: 'ViolationHouse',
    InspectorInspection: 'InspectorInspection',
    Institutions: 'vvInstitutions',
    AgeStructure: 'v_AgeStructure',
    GenderStructure: 'v_GenderStructure',
    EducationStructure: 'v_EducationStructure',
    LeaderStructure: 'v_LeaderStructure',
    MajorStructure: 'v_MajorStructure',
    VPatrolInspection: 'VPatrolInspection',
    VPostsAndStaffInspection: 'VPostsAndStaffInspection'
}

function delInfo() {
    if ($CURR_Table == null) {
        return;
    }
    var item = $CURR_Table.getSelectedItem();
    if (item == null) {
        layer.msg('请选择某一项后重试。');
        return;
    }
    layer.confirm('确定要删除此项吗？',
        function (index) {
            layer.close(index);
            $.mvcData.get('Method.Delete',
                {
                    table: $CURR_Table._options.parms.table,
                    id: item.ID
                });
            $CURR_Table.reload();
            layer.msg('信息删除成功。');
        });
}

function setDiv0Area() {
    var height = $.btcData.getQueryString('height') * 1 - 45;
    $('#div0').Huitab();
    $('#div0').height(height);
    //$(document).height(height);
    $('#div0').width($(document).width() - 2);
}

function removeOther() {
    if (parent.USER_Name != 'admin') {
        $('#divToolBar').find('span').hide().eq(-1).show();
    }
}

function submitAll($form, url, data, fun) {
    if (url == null) {
        url = $form.attr('action');
    }
    $form.ajaxSubmit({
        url: url,
        data: data,
        success: function (data) {
            if (!data.success) {
                layer.alert(data.errorMsg);
                return;
            }
            if (fun != null) {
                fun(data);
            }
        },
        error: function () {
            layer.msg('服务器错误，请重试。');
        }
    });
}

function showDlg($conent, title, width, height, top, left) {
    var dlgOption = {
        type: 1,
        title: title,
        content: $conent
    }
    if (width != null) {
        var area = [width + 'px'];
        if (height != null) {
            area.push(height + 'px');
        }
        dlgOption.area = area;
    }
    if (top != null) {
        var offset = [top + 'px'];
        if (left != null) {
            offset.push(left + 'px');
        }
        dlgOption.offset = offset;
    }

    var layerDlgIndex = layer.open(dlgOption);
    return layerDlgIndex;
}

function showHtml(url, title, width, height, top, left) {
    var dlgOption = {
        type: 2,
        title: title,
        content: url,
        //closeBtn: 0,
        //move: false
    }
    if (width != null) {
        var area = [width + 'px'];
        if (height != null) {
            area.push(height + 'px');
        }
        dlgOption.area = area;
    }
    if (top != null) {
        var offset = [top + 'px'];
        if (left != null) {
            offset.push(left + 'px');
        }
        dlgOption.offset = offset;
    }

    var layerDlgIndex = layer.open(dlgOption);
    //layer.full(layerDlgIndex);
    return layerDlgIndex;
}

//function showTable(tablename,form, cols,)