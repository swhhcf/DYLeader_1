/// <reference path='../lib/jquery/jquery-1.7.2-vsdoc.js' />
/// <reference path='../lib/encode/jQuery.md5.js' />
/// <reference path='common.js' />

//#region jquery扩展
(function ($) {
    jQuery.fn.extend({
        /* 设置表单值 */
        setRadioChecked: function (value) {
            $(this).each(function () {
                if ($(this).val() == value) {
                    $(this).prop('checked', 'checked');
                } else {
                    $(this).removeProp('checked');
                }
            });
            return $(this);
        },
        showPart: function () {
            var args = arguments,
                $this = $(this);
            $this.hide();
            if (args.length < 1) {
                $this.show();
                return $this;
            }
            for (var i = 0; i < args.length; i++) {
                $this.eq(args[i]).show();
            }
            return $this;
        },

        setCheckboxChecked: function (value) {
            var vals = value.split(',');
            $(this).each(function () {
                if ($.inArray($(this).val(), vals) >= 0) {
                    $(this).prop('checked', 'checked');
                } else {
                    $(this).removeProp('checked');
                }
            });
            return $(this);
        },
        fillAreaList: function (isForList) {
            isForList = isForList === true;
            var $ddl = $(this);
            $ddl.addItems('UserForOrder.GetDept', { isForList: isForList }, 'code', 'shortName', false, false);
            return $ddl;
        },
        setFormCtrlValue: function (data, prefix, firstLetterIsUpper) {
            return $(this)._setCtrlValue(data, prefix, firstLetterIsUpper, false);
        },
        setDivDomText: function (data, prefix, firstLetterIsUpper) {
            return $(this)._setCtrlValue(data, prefix, firstLetterIsUpper, true);
        },
        _setCtrlValue: function (data, prefix, firstLetterIsUpper, isSetText) {
            /// <summary>设置表单的控件值</summary>
            /// <param name='data' type='json'></param>
            /// <param name='prefix' type='String'>前缀, 包括分隔符，如"patient."</param>
            /// <param name='firstLetterIsUpper' type='bool'>如果后端返回的字段首字母大小写与前端不匹配，则为true</param>
            if (prefix == null) {
                prefix = '';
            }
            firstLetterIsUpper = firstLetterIsUpper === true ? true : false;
            //} else {
            //    if (prefix.right(1)!='.')
            //    {prefix = prefix + '.';}
            //}
            var $form = $(this);
            //var $realForm = $form.is('form') ? $form : $form.find('form');
            //if ($realForm.length > 0) {
            //    $realForm[0].reset();
            //}
            if (data == null) {
                return $form;
            }
            if (data instanceof Array) {
                if (data.length === 0) return $form;
                data = data[0];
            }
            $.each(data,
                function (key, value) {
                    if (firstLetterIsUpper) {
                        key = key[0].toUpperCase() + key.substr(1);
                    }
                    key = prefix + key;
                    var $dom = $form.find('[name="' + key + '"]'),
                        domType = '';
                    if ($dom.length == 0) {
                        $dom = $('#' + key);
                        if ($dom.length == 0) {
                            return true;
                        } else {
                            isSetText = true;
                        }
                    } else {
                        isSetText = false;
                        domType = $dom.attr('type');
                        //console.log(key + ': ' + value + ', type:' + domType + ', isSetText: ' + isSetText);
                    }
                    if (isSetText == true) {
                        $dom.text(value);
                        return true;
                    }
                    if (domType === 'radio') {
                        $dom.setRadioChecked(value);
                        return true;
                    }
                    if (domType === 'checkbox') {
                        $dom.setCheckboxChecked(value);
                        return true;
                    }
                    $dom.val(value);
                    //$dom.toggle(addUserList);
                });
            return $form;
        },
        clearFormCtrlValue: function () {
            $(this)[0].reset();
            return $(this);
        },
        //#region 下拉列表框插件
        readonly: function (isReadonly) {
            var $dom = $(this);
            $dom.each(function () {
                var $this = $(this);
                if ($this.is('select')) {
                    $this.attr('onchange', 'this.selectedIndex=this.defaultIndex;');
                    $this.attr('onfocus', 'this.defaultIndex=this.selectedIndex;');
                    return $this;
                }
                if ($this.is('input')) {
                    var thisType = $this.attr('type');
                    if (thisType === 'checkbox' || thisType === 'radio') {
                        $this.attr('onclick', 'return false;');
                    }
                    $this.attr('readonly', 'readonly');
                    return $this;
                }
            });
            return $dom;
        },
        addItems: function (url, data, valueFieldname, textFieldname, isNotAddTip, isAsync) {
            /// <summary>添加下拉框的所有Option，当选项有多项时，添加请选择的提示</summary>
            /// <param name='data' type='json'>要添加的项</param>
            /// <param name='value' type='String'>value的属性名称, 默认为value</param>
            /// <param name='text' type='String'>text的属性名称,默认为text</param>
            /// <param name='isNotAddTip' type='bool'>
            /// 选项只有一项时添加“请选择”的提示，默认不添加</param>
            var $thisObj = $(this);
            if (typeof url === 'string') {
                if (url.left(5).toLowerCase() !== '/ajax') {
                    url = $.mvcData.path(url);
                }
                $.ajax({
                    type: 'post',
                    url: url,
                    data: data,
                    async: isAsync === false ? false : true,
                    dataType: 'json',
                    success: function (result) {
                        $thisObj._addItems(result.rows, valueFieldname, textFieldname, isNotAddTip);
                        //$thisObj.selectIndex(0);
                    }
                });
            } else {
                // url = data, data = valueFieldname, valueFieldname = textFieldname, textFieldname = isNotAddTip;
                $thisObj._addItems(url, data, valueFieldname, textFieldname);
            }
            return $thisObj;
        },
        _addItems: function (data, valueFieldname, textFieldname, isNotAddTip) {
            /// <summary>添加下拉框的所有Option，当选项有多项时，添加请选择的提示</summary>
            /// <param name='data' type='json'>要添加的项</param>
            /// <param name='value' type='String'>value的属性名称, 默认为value</param>
            /// <param name='text' type='String'>text的属性名称,默认为text</param>
            /// <param name='isNotAddTip' type='bool'>
            /// 选项只有一项时添加“请选择”的提示，默认不添加</param>
            if (typeof data === "string") {
            }
            var $ddl = $(this),
                dataItem = null,
                len = data == null ? 0 : data.length,
                template = '<option value="{0}">{1}</option>',
                options = [];
            if (len == 0) {
                $ddl.empty().addItem('', '无数据');
                return $ddl;
            }
            if (valueFieldname == null) {
                valueFieldname = 'value';
                textFieldname = 'text';
            }
            textFieldname = textFieldname == null
                ? valueFieldname : textFieldname;

            //isNotAddTip = isNotAddTip !== false;
            if (len > 1) {
                if (!isNotAddTip) {
                    options.push(template.format('', '=请选择='));
                    //$ddl.addItem('', '=请选择=');
                }
            }
            for (var i = 0; i < len; i++) {
                dataItem = data[i];
                options.push(template.format(dataItem[valueFieldname],
                    dataItem[textFieldname]));
            }
            $ddl.empty().append(options.join(''));
            $ddl.selectIndex(0);
            return $ddl;
        },
        moveItem: function (isUp) {
            /// <summary>移动select的选项</summary>
            /// <param name='isUp' type='bool'>是上移还是下移</param>
            var $ddl = $(this),
                items = $ddl.get(0),
                selectedIndex = items.selectedIndex,
                ddlLen = items.length,
                preNextIndex = isUp === true ? selectedIndex - 1 : selectedIndex + 1;

            if (selectedIndex < 0 || preNextIndex < 0
                || preNextIndex > ddlLen - 1) {
                return $ddl;
            }
            var $currItem = $(items[selectedIndex]),
                $preNextItem = $(items[preNextIndex]);
            if (isUp) {
                $currItem.insertBefore($preNextItem);
            } else {
                $currItem.insertAfter($preNextItem);
            }
            return $ddl;
        },
        delItem: function () {
            /// <summary>删除下拉列表框中选中的选项</summary>
            var $ddl = $(this),
                items = $ddl.get(0),
                selectedIndex = items.selectedIndex;
            if (selectedIndex < 0) {
                return $ddl;
            }
            $(items[selectedIndex]).remove();
            return $ddl;
        },
        addItem: function (value, text, isNotAddHastext) {
            /// <summary>添加下拉列表框的选项</summary>
            /// <param name='value' type='String'>项的值</param>
            /// <param name='text' type='String'>项的文本</param>
            /// <param name='isNotAddHastext' type='bool'>是否添加与已有文本项重复的项，默认添加</param>
            var $ddl = $(this),
                itemText = '<option value="{0}">{1}</option>';
            value = value + '';
            text = text + '';
            value = value.replace(/ /g, '');
            if (text.isNullWhiteEmpty() && value.isNullWhiteEmpty()) {
                return $ddl;
            }
            if (isNotAddHastext === true) {
                //                for (var i = 0, len = ivts.length; i < len; i++) {
                ////                    if (text == ivts[i].Text) {
                ////                        return $ddl;
                ////                    }
                //                }
            }
            text = text.isNullWhiteEmpty() ? value : text;
            $ddl.append(itemText.format(value, text));
            return $ddl;
        },
        selectedText: function () {
            /// <summary>获取下拉列表框中已选择文本</summary>
            var $ddl = $(this);
            return $ddl.find('option:selected').text();
        },
        selectIndex: function (index) {
            var $ddl = $(this);
            if (index == null) {
                return $ddl.get(0).selectedIndex;
            }
            $ddl[0].selectedIndex = index;
            return $ddl;
        },
        getIndexsValuesTexts: function () {
            /// <summary>
            /// 返回select每个选项的索引Index,值Value,文本Text
            /// 返回形式为对象数组,属性有：Index,Value,Text
            /// </summary>
            var items = $(this).get(0),
                indexsValuesTexts = new Array();
            for (var i = 0, len = items.length; i < len; i++) {
                indexsValuesTexts.push({
                    'Index': i,
                    'Value': $(items[i]).val(),
                    'Text': $(items[i]).text()
                });
            }
            return indexsValuesTexts;
        },
        //#endregion

        //#region div复选框
        checkboxList: function (data, colCount, isHaveCheckAll, valueFieldname, textFieldname) {
            /// <summary>div填充checkbox</summary>
            /// <param name='dat'a type='json'>要填充的数据</param>
            /// <param name='colCount' type='int'>分几列填充</param>
            /// <param name='valueFieldname' type='String'>值字段名</param>
            /// <param name='textFieldname' type='String'>文本字段名</param>
            var $div = $(this),
                dataCount = data.length;
            if (dataCount < 1) {
                return $div;
            }
            var divTemplate = "<div id='divChk{0}' style='float:left;margin-right:6px;'></div>",
                chkTemplate = "<input style='margin-top:3px;margin-right:3px;' type='checkbox' id='chk{0}' value='{1}' {3}/>"
                    + "<label for='chk{0}' style='padding-bottom:3px;'>{2}</label><br />";
            valueFieldname = valueFieldname == null ? "ID" : valueFieldname;
            textFieldname = textFieldname == null ? "Name" : textFieldname;
            isHaveCheckAll = isHaveCheckAll == null ? true : isHaveCheckAll;
            colCount = colCount == null ? 1 : colCount;
            $div.empty();

            if (isHaveCheckAll) {
                $div.append(chkTemplate.format("All", "-1", "全选", ''));
                $("#chkAll").bind("click", function () {
                    var isChecked = $(this).attr("checked") == "checked";
                    $div.selectAll(isChecked);
                });
            }
            $div.append("<div><div>");
            var chkIdIndex = 0;
            var $divChks = [];
            for (var i = 0; i < colCount; i++) {
                $div.append(divTemplate.format(i));
                $divChks.push($("#divChk" + i));
            }
            $.each(data, function (index, item) {
                var checked = item.checked == true ? 'checked="checked"' : '',
                    divIndex = parseInt(chkIdIndex / (dataCount / colCount));
                $divChks[divIndex].append(
                    chkTemplate.format(chkIdIndex++, item[valueFieldname], item[textFieldname], checked));
            });
            return $div;
        },
        selectAll: function (isChecked) {
            /// <summary>选择所有复选框</summary>
            var $div = $(this);
            if (isChecked) {
                $div.find('input:checkbox').not('#chkAll').each(function () {
                    $(this).attr('checked', 'checked');
                });
            } else {
                $div.find('input:checkbox').not('#chkAll').each(function () {
                    $(this).removeAttr('checked');
                });
            }
            return $div;
        },
        getAllValue: function () {
            /// <summary>获取所有复选框值</summary>
            return $(this).getValue(true);
        },
        getValueAndChecked: function () {
            /// <summary>获取所有复选框值及对应的选择状态，0表示未选，1表示已选</summary>
            var $div = $(this),
                values = [];
            $div.find('input:checkbox[id!="chkAll"]').each(function () {
                values.push(this.value + ","
                    + ($(this).prop('checked') ? 1 : 0));
            });
            if (!values.length) return null;
            return values;
        },
        //#endregion

        //#region div 添加文本和按钮
        addValueText: function (value, text) {
            /// <summary>div 添加值，文本及删除按钮</summary>
            /// <param name='value' type='String'>值</param>
            /// <param name='text' type='String'>显示的文本</param>
            var $div = $(this);
            if (value == null) {
                return $div;
            }
            var showTemplate = "<div id='Major{0}' style='margin-top:3px;margin-left:-15px;'>"
                + " <input id='del{0}' type='button' style='margin-right:6px;' onclick='delMajor({0})' class='sm-button' value='删除' />"
                + "<span id='majorName{0}'>{1}</span>"
                + "<input id='hdn{0}' type='hidden' value='{0}'/>"
                + "</div>",
                haveValues = $div.getValue();
            for (var i = 0; i < haveValues.length; i++) {
                if (value == haveValues[i]) {
                    return $div;
                }
            }
            $div.append(showTemplate.format(value, text));
            return $div;
        },
        getValue: function (isAll) {
            var $div = $(this),
                values = [],
                checkbox = "input:checkbox" + (!isAll ? ":checked" : '');
            $div.find(checkbox).each(function () {
                values.push(this.value);
            });
            $div.find("input:hidden").each(function () {
                values.push(this.value);
            });
            return values;
        },
        //#endregion

        //所有控件
        disabled: function () {
            return $(this).enabled(false);
        },
        enabled: function (isEnabled) {
            var $ctrl = $(this),
                isBtn = $ctrl.attr("type") === "button" || $ctrl.attr("type") === "submit";
            if (isEnabled === false) {
                $ctrl.prop("disabled", "disabled");
                if (isBtn) {
                    $ctrl.addClass("disabled");
                }
            } else {
                $ctrl.removeProp("disabled");
                if (isBtn) {
                    $ctrl.removeClass("disabled");
                }
            }
            return $ctrl;
        },
        showHide: function (isShow) {
            var $ctrl = $(this);
            if (isShow) {
                return $ctrl.show();
            }
            return $ctrl.hide();
        }
    });
})(window.jQuery);

//#endregion
$.swhExt = {
    //#region 日期、生日
    isDateTime: function (str) {
        /// <summary>检查是否为日期型</summary>
        /// <param name='str' type='String'>字符串</param>
        if (str == null || str == '') {
            return false;
        }
        var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
        var r = (str + '').match(reg);
        if (r == null) return false;
        r[2] = r[2] - 1;
        var d = new Date(r[1], r[2], r[3], r[4], r[5], r[6]);
        if (d.getFullYear() != r[1]) return false;
        if (d.getMonth() != r[2]) return false;
        if (d.getDate() != r[3]) return false;
        if (d.getHours() != r[4]) return false;
        if (d.getMinutes() != r[5]) return false;
        if (d.getSeconds() != r[6]) return false;
        return true;
    },
    isDate: function (str) {
        /// <summary>检查是否为日期型</summary>
        /// <param name='str' type='String'>字符串</param>
        if (str == null || str == '') {
            return false;
        }
        str = (str + '').replace(/[^0-9]/mg, "-");
        var reg = /^(\d+)-(\d{1,2})-(\d{1,2})$/;
        var r = (str + '').match(reg);
        if (r == null) return false;
        r[2] = r[2] - 1;
        var d = new Date(r[1], r[2], r[3]);
        if (d.getFullYear() != r[1]) return false;
        if (d.getMonth() != r[2]) return false;
        if (d.getDate() != r[3]) return false;
        return true;
    },
    toDate: function (str) {
        /// <summary>取日期时间值的日期</summary>
        if (str == null || str == '') {
            return '';
        }
        if ($.swhExt.isDateTime(str)) {
            return str.substr(0, str.indexOf(" "));
        }
        if ($.swhExt.isDate(str)) {
            str = str.replace(/[^0-9]/mg, "-");
            var reg = /^(\d+)-(\d{1,2})-(\d{1,2})$/;
            var r = (str + '').match(reg);
            str = r[1] + "-" + (r[2] * 1 < 10 ? "0" + r[2] * 1 : r[2])
                + "-" + (r[3] * 1 < 10 ? "0" + r[3] * 1 : r[3]);
        }
        return str;
    },
    setToBirthdayGender: function (PersonalIdCardNoId, birthdayId, genderId) {
        /// <summary>根据身份证号生成生日</summary>
        /// <param name='birthdayId' type='String'>身份证号文本框id</param>
        /// <param name='genderId' type='String'>性别下拉列表框</param>
        var value = $(idCardNoId).val();
        $(birthdayId).val(value.substr(6, 4) +
            "-" + value.substr(10, 2) + "-" + value.substr(12, 2));
        var genderIndex = value.substr(16, 1) % 2 == 0 ? 1 : 2;
        $(genderId).selectIndex(genderIndex);
    }
    //#endregion
}
//#endregion

//密码强度检测
// ReSharper disable once NativeTypePrototypeExtending
String.prototype.getStrength = function () {
    var passwd = this;
    var intScore = 0;
    if (passwd.length < 8) {
        return 0;
    }
    if (passwd.match(/[a-z]/)) // [验证]至少一个小写字母
    {
        intScore = (intScore + 1);
    }
    if (passwd.match(/[A-Z]/)) // [验证]至少一个大写字母
    {
        intScore = (intScore + 1);
    } // 单一验证
    if (passwd.match(/\d+/)) // [验证]至少一个数字
    {
        intScore = (intScore + 1);
    }
    if (passwd.match(/[!,@#$%^&*?_~]/)) // [验证]至少一个特殊字符
    {
        intScore = (intScore + 1);
    }
    return intScore;
}

//#region 字符串扩展方法
// ReSharper disable once NativeTypePrototypeExtending
String.prototype.format = function () {
    var args = arguments;
    var realArgs = [];
    for (var j = 0; j < args.length; j++) {
        if (args[j] instanceof Array) {
            for (var k = 0; k < args[j].length; k++) {
                realArgs.push(args[j][k]);
            }
        } else {
            realArgs.push(args[j]);
        }
    }
    return this.replace(/\{(\d+)\}/g, function (m, i, o, n) {
        return realArgs[i];
    });
};

// ReSharper disable once NativeTypePrototypeExtending
String.prototype.md5 = function () {
    return $.md5(this);
};

// ReSharper disable once NativeTypePrototypeExtending
String.prototype.left = function (lngLen) {
    if (lngLen > 0) {
        return this.substring(0, lngLen);
    } else {
        return null;
    }
};

// ReSharper disable once NativeTypePrototypeExtending
String.prototype.right = function (lngLen) {
    // alert(mainStr.length)
    if (this.length - lngLen >= 0 && this.length >= 0
        && this.length - lngLen <= this.length) {
        return this.substring(this.length - lngLen, this.length);
    } else {
        return null;
    }
};

// ReSharper disable once NativeTypePrototypeExtending
String.prototype.mid = function (starnum, endnum) {
    if (this.length >= 0) {
        return this.substr(starnum, endnum);
    } else {
        return null;
    }
};

// ReSharper disable once NativeTypePrototypeExtending
String.prototype.toJson = function () {
    if (this.left(15) == "<!DOCTYPE html>") {
        return null;
    }
    if (this.isNullWhiteEmpty()) {
        return null;
    }
    return (new Function('return ' + this))();
};

// ReSharper disable once NativeTypePrototypeExtending
String.prototype.isNullWhiteEmpty = function () {
    var value = this + '';
    if (value == '') {
        return true;
    }
    value = (this + '').replace(/ /g, '');
    return value == '';
};
// ReSharper disable once NativeTypePrototypeExtending
String.prototype.isNullEmptyZero = function () {
    var value = (this + '').replace(/ /g, '');
    return value == null || value == '' || value == "0";
}
    ;;
//#endregion