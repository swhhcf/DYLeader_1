/// <reference path="../../jquery/jquery-1.7.2-vsdoc.js" />
(function ($, window, document, undefined) {
    var BtcNamebox = function (ele, opt) {
        this._$element = ele;
        this._defaults = {
            valueTarget: null,      //输入的值的存放目标
            //maxColumn: 7,         //每行显示已输入项的个数
            isSingle: true,         //是否为单选
            //rowsize: 5,           //下拉列表数
            cols: null,             //列参数，如[{name:'b', width:60},{name:'d', width:60}]  {name:'',width:}
            root: 'rows',           //返回的数据键名
            url: null,              //ajax地址
            //action: 'local',      //是否是本地
            //order: '',            //排序字段, 加asc或desc
            id: 'id',               //主键名
            width: 100,             //控件宽度
            listWidth: 0,           //列表宽度
            key: 'key',             //查询参数名
            value: null,            //初始化值
            showName: null,         //显示名称的字段名
            data: null,             //要传到后端的其他参数
            timeout: 300,
            diffLeft: 0,
            diffTop: 0,
            isBlank: false,         //当值为空时也搜索，默认不搜索
            oninput: null,
            isInput: false,         //允许输入值提交
            onchange: null          //当值更改时触发的事件，默认传入所选择的对象
        };
        this._curSelected = -1;
        this._kbSelName = '';
        this._container = null;
        this._prevValue = '';
        this._tipwinWidth = 0;
        this._timeout = null;
        this._selectedObj = null;
        this._selectedShowname = null;
        this._options = $.extend({}, this._defaults, opt);
        this._isPopulated = false;
    }

    BtcNamebox.prototype = {
        _deleteMe: function (name) {
            var thisObj = this;
            var namebox = thisObj._$element[0];
            var csList = namebox.getAttribute("csn");
            if (csList == "" || csList == undefined) {
                return;
            }
            else {
                var cArr = csList.split(",");
                for (var i = 0; i < cArr.length; i++) {
                    if (cArr[i] == name) {
                        cArr.splice(i, 1);
                        break;
                    }
                }
                namebox.setAttribute("csn", cArr.join(","));
            }
            //thisObj._initNameBoxData(thisObj.getValue());
            thisObj.renderNamebox();
        },
        _initNameBoxData: function (data) {
            data = data == null ? '' : data;
            this._$element.attr('csn', data);
        },
        _translatedString: function (nameList) {
            var thisObj = this;
            var result = "";
            if (nameList == null || nameList == "") {
                return "";
            }
            var id = thisObj._options.id;
            var dataObj = $.extend({}, thisObj._options.data);
            dataObj[id] = nameList;
            $.ajax({
                url: thisObj._options.url,
                method: "get",
                data: dataObj,
                dataType: "json",
                async: false,
                success: function (data) {
                    data = data[thisObj._options.root];
                    var names = new Array(data.length),
                        ids = nameList.split(",");
                    for (var i = 0; i < data.length; i++) {
                        var index = $.inArray(String(data[i][id]), ids);
                        names[index] = data[i][thisObj._options.showName];
                    }
                    result = names.join(",");
                }
            });
            return result;
        },
        _setInputCSS: function () {
            //var thisObj = this;
            //if (thisObj._options.isSingle !== true) {
            //    return;
            //}
            //var $input = thisObj._$element.find('.nameInput');
            //var value = thisObj.getValue();
            //if (value == '') {
            //    $input.css('margin-left', 0);
            //} else {
            //    $input.css('margin-left', -1 * (thisObj._options.width + 6) + 'px');
            //}

            //if ($input.val().replace(/(^\s*)|(\s*$)/g, '') != '') {
            //    $input.css('background-color', '#fff');
            //} else {
            //    $input.val('');
            //    $input.css('background-color', 'transparent');
            //}
        },
        renderNamebox: function () {
            var thisObj = this;
            var $element = thisObj._$element;
            var $namebox = $element;
            var ccList = $namebox.attr('csn');
            if (ccList == null) {
                ccList = '';
            }
            var csList = thisObj._translatedString(ccList);
            var $input = thisObj._$element.find('.nameInput');
            var isSingle = thisObj._options.isSingle;
            var isInput = thisObj._options.isInput;
            var inputValue = $input.val();
            if (csList == '' || csList == undefined) {
                if (!isInput) {
                    inputValue = '';
                }
                csList = 'inputbox';
                if (thisObj._options.onchange != null) {
                    thisObj._options.onchange({});
                }
                if (thisObj._options.oninput != null) {
                    thisObj._options.oninput(inputValue);
                }
            } else {
                csList += ',inputbox';
            }
            var csArr = csList.split(",");
            var ccArr = ccList.split(",");
            var dHeight = 20;
            var dWidth = thisObj._options.width;
            var allHTML = "";
            var csResults = [];
            var ccResults = [];
            if (isSingle === true) {
                if (csArr.length <= 2) {
                    csResults = csArr;
                } else {
                    csResults.push(csArr[csArr.length - 2]);
                    csResults.push(csArr[csArr.length - 1]);
                }
                if (ccArr.length == 1) {
                    ccResults = ccArr;
                } else {
                    ccResults.push(ccArr[ccArr.length - 1]);
                }
            } else {
                csResults = csArr;
                ccResults = ccArr;
            }
            var boxWidth = thisObj._$element.width(),
                boxHeight = thisObj._$element.height();
            if (isSingle) {
                allHTML =
                    '<input type="text" class="nameInput" autocomplete="off" value="" style="width:{0}px; margin-left:{1}px; height:{2}px; border: none; line-height: {2}px;margin:0;" />';
                allHTML = allHTML.format(boxWidth, 4, boxHeight);
            } else {
                for (var i = 0; i < csResults.length; i++) {
                    var twidth = thisObj._options.width;// (dWidth) * maxColumn - (i % maxColumn) * dWidth;
                    var oHTML = "";
                    if (csResults[i] != "inputbox") {
                        oHTML = '<div id="{0}" style="float: left; width: {1}px; height: {2}px;">' +
                            '<span>{3}</span>' +
                            '<span class="x-control" title="删除" csn="{4}">×</span>' +
                            '</div>';
                        oHTML = oHTML.format(ccResults[i], dWidth, dHeight, csResults[i], ccResults[i]);
                    } else {
                        oHTML = '<input type="text" class="nameInput" autocomplete="off" value="" style="width:{0}px; margin-left:{1}px; height: 16px; border: none; line-height: 16px; margin-top:0" />';
                        var mt = 0;
                        oHTML = oHTML.format(twidth, mt);
                    }
                    allHTML += oHTML;
                }
            }
            $namebox.empty().append(allHTML);
            $input = thisObj._$element.find('.nameInput');

            //如果允许输入，输入框的值为已选择或已输入的值
            if (isSingle) {
                if (csResults.length > 1) {
                    $input.val(csResults[0]);
                } else {
                    if (isInput) {
                        $input.val(inputValue);
                        $(thisObj._options.valueTarget).val(inputValue);
                    } else {
                        $(thisObj._options.valueTarget).val('');
                    }
                    $namebox.attr('csn', '');
                }
            }
            inputValue = $input.val();
            thisObj._setInputCSS();
            $('.x-control').click(function () {
                thisObj._deleteMe($(this).attr('csn'));
            });
            $input.on("input focus",
                function () {
                    if (thisObj._options.oninput != null) {
                        thisObj._options.oninput($(this).val().replace(/(^\s*)|(\s*$)/g, ''));
                    }
                    if (isInput) {
                        $(thisObj._options.valueTarget).val($(this).val().replace(/(^\s*)|(\s*$)/g, ''));
                    }

                    //if ($(this).val().replace(/(^\s*)|(\s*$)/g, '') === inputValue) {
                    //    //$(this).val(inputValue);
                    //    return;
                    //}

                    thisObj._setInputCSS();
                    if (thisObj._timeout != null) {
                        window.clearTimeout(thisObj._timeout);
                    }
                    thisObj._timeout = window.setTimeout(thisObj._pop($(this).val()), thisObj._options.timeout);
                });

            $namebox.on("click",
                function () {
                    thisObj._setInputCSS();
                    $input.focus();
                });
            var objs = null;
            $input.on("keydown",
                function (event) {
                    thisObj._setInputCSS();
                    if (isInput) {
                        $(thisObj._options.valueTarget).val($(this).val().replace(/(^\s*)|(\s*$)/g, ''));
                    }
                    if (thisObj._options.oninput != null) {
                        thisObj._options.oninput($(this).val());
                    }
                    if (event.keyCode == 38) {
                        objs = $("#tipwin table tr");
                        if (thisObj._curSelected == -1) {
                            if (objs.length > 0) {
                                thisObj._selectItem(objs[0].id);
                            }
                        } else {
                            if (thisObj._curSelected == 0) {
                                thisObj._selectItem(objs[thisObj._curSelected].id);
                            } else {
                                thisObj._selectItem(objs[thisObj._curSelected - 1].id);
                            }
                        }

                        thisObj._scrollToItem(thisObj._curSelected, "up");
                    } else if (event.keyCode == 40) {
                        objs = $("#tipwin table tr");
                        if (thisObj._curSelected == -1) {
                            if (objs.length > 0) {
                                thisObj._selectItem(objs[0].id);
                            }
                        } else {
                            if (thisObj._curSelected == objs.length - 1) {
                                thisObj._selectItem(objs[objs.length - 1].id);
                            } else {
                                thisObj._selectItem(objs[thisObj._curSelected + 1].id);
                            }
                        }
                        thisObj._scrollToItem(thisObj._curSelected, "down");
                    } else if (event.keyCode == 13 || event.keyCode == 32) {
                        //alert($("#tip table tr")[curSelected].innerText);
                        if (thisObj._curSelected != -1) {
                            thisObj._doItemSelect($($("#tipwin table tr")[thisObj._curSelected]));
                        }
                    } else if (event.keyCode == 8 || event.keyCode == 46) {
                        var selBgColor = "#007ACC";
                        var selFgColor = "#FFFFFF";
                        if ($element.find(".nameInput").val() == "") {
                            $namebox = $element;
                            var $divs = $namebox.find("div");
                            if (thisObj._kbSelName == '') {
                                if ($divs.length > 0) {
                                    $divs.last().css('background-color', selBgColor);
                                    $divs.last().css('color', selFgColor);
                                    thisObj._kbSelName = $divs.last().attr('id');
                                }
                            } else {
                                thisObj._deleteMe(thisObj._kbSelName);
                                thisObj._kbSelName = '';
                                $element.find(".nameInput").focus();
                            }
                        }
                    } else if (event.keyCode == 27) {
                        thisObj._dismissTipWindow();
                    }
                    thisObj.setTargetValue();
                });

            if (isSingle && !isInput) {
                $input.on('blur',
                    function () {
                        $.get(thisObj._options.url,
                            { key: $(this).val(), isExact: 1 },
                            function (data) {
                                if (data[thisObj._options.root].length <= 0) {
                                    $input.val('');
                                    $(thisObj._options.valueTarget).val('');
                                    $namebox.attr('csn', '');
                                }
                            },
                            'json');
                    });
            }

            $(document)
                .bind("click",
                function (event) {
                    if (event.target.id == "tipwin") {
                        return;
                    } else {
                        thisObj._dismissTipWindow();
                    }
                });
            thisObj.setTargetValue();
        },
        _pop: function (value) {
            var thisObj = this;
            return function () {
                thisObj.populate(value);
            }
        },
        _doItemSelect: function ($tr) {
            var str = $tr.attr('id');
            var thisObj = this;
            var namebox = thisObj._$element[0];
            var csList = namebox.getAttribute("csn");
            this._prevValue = csList;
            var item = {};
            item[this._options.id] = str;
            $tr.children('input').each(function () {
                var name = $(this).attr('colname'),
                    value = $(this).val();
                item[name] = value;
            });
            if (csList == "" || csList == undefined || thisObj._options.isSingle === true) {
                csList = str;
            }
            else {
                csList += "," + str;
            }
            if (thisObj._options.onchange != null) { //csList != thisObj._prevValue &&
                thisObj._options.onchange(item);
            }
            thisObj._selectedObj = item;
            namebox.setAttribute("csn", csList);
            thisObj._curSelected = -1;
            thisObj._dismissTipWindow();
            thisObj.renderNamebox(true);
            var $ipt = thisObj._$element.find(".nameInput");
            $ipt.focus();
            thisObj._isPopulated = true;
        },
        _scrollToItem: function (itemIndex, direction) {
            var panelHeight = Number($("#tipwin")[0].style.height.replace(/px/g, ""));
            var cTop = $("#tipwin table tr")[itemIndex].offsetTop;
            var cBottom = cTop + $("#tipwin table tr")[itemIndex].clientHeight;
            if ($("#tipwin")[0].scrollTop <= cTop && $("#tipwin")[0].scrollTop + panelHeight >= cBottom) {
                //do nothing
            }
            else {
                if (direction == "up") {
                    $("#tipwin")[0].scrollTop = $("#tipwin table tr")[itemIndex].offsetTop;
                }
                else if (direction == "down") {
                    $("#tipwin")[0].scrollTop = $("#tipwin table tr")[itemIndex].offsetTop - (100 - $("#tipwin table tr")[itemIndex].clientHeight);
                }
            }
        },
        _selectItem: function (keyName) {
            var objs = $("#tipwin table tr");
            for (var i = 0; i < objs.length; i++) {
                var obj = objs[i];
                if (obj.id == keyName) {
                    obj.className = "tipSelected";
                    this._curSelected = i;
                } else {
                    obj.className = "tipUnSelected";
                }
            }
        },
        init: function () {
            var thisObj = this;
            if (thisObj._options.showName == null || thisObj._options.showName === '') {
                thisObj._options.showName = thisObj._options.cols[0].name;
            }
            thisObj._$element.css('padding-left', '4px').css('background-color', '#fff');
            thisObj._initNameBoxData(thisObj._options.value);
            thisObj.renderNamebox();
        },

        getValue: function () {
            var value = this._$element.attr('csn');
            if (value == null) value = '';
            return value;
        },
        setTargetValue: function () {
            if (this._options.valueTarget == null || this._options.valueTarget == '') {
                return;
            }
            $(this._options.valueTarget).val(this._$element.attr('csn'));
        },
        setValue: function (value) {
            this._options.value = value;
            this.init();
        },
        setParm: function (key, value) {
            if (typeof key === 'object') {
                this._options.data = $.extend({}, this._options.data, key);
            }
            this._options.data[key] = value;
            //this.init();
        },
        setOption: function (key, value) {
            this._options[key] = value;
        },
        reload: function () {
            this.init();
        },
        _nameExist: function (name) {
            var $namebox = this._$element;
            var csList = $namebox.attr('csn');
            if (csList == "" || csList == undefined) {
                return false;
            }
            else {
                var cArr = csList.split(",");
                for (var i = 0; i < cArr.length; i++) {
                    if (cArr[i] == name) {
                        return true;
                    }
                }

                return false;
            }
        },
        _showTipWindow: function () {
            var thisObj = this;
            var $nameboxParent = thisObj._$element;
            var tipwin = document.getElementById("tipwin");
            var $ipt = $nameboxParent.find(".nameInput").eq(0);
            var top = $ipt.offset().top + 24 + thisObj._options.diffTop;
            var left = $ipt.offset().left + thisObj._options.diffLeft;
            //if (thisObj._options.isSingle === true && thisObj.getValue() != '') {
            //    left -= $ipt.prev().width();
            //}
            var tipwinWidth = 0;
            $.each(thisObj._options.cols, function (i, item) {
                var width = item.width == null ? 60 : item.width;
                tipwinWidth += width;
            });
            if (tipwinWidth < thisObj._options.listWidth) {
                tipwinWidth = thisObj._options.listWidth;
            }
            if (tipwin == null) {
                var obj = document.createElement("DIV");
                obj.id = "tipwin";
                obj.style.position = "absolute";
                obj.style.top = String(top) + "px";
                obj.style.left = String(left + $(document).scrollLeft()) + "px";
                obj.style.width = String(tipwinWidth) + "px";
                obj.style.height = "100px";
                obj.style.zIndex = '99999999';
                obj.style.backgroundColor = "#FFFFFF";
                obj.style.border = "1px #e8e8e8 solid";
                obj.className = "tipShadow";
                document.body.appendChild(obj);
            }
            else {
                tipwin.style.visibility = "visible";
                tipwin.style.display = "block";
                tipwin.style.top = String(top) + "px";
                tipwin.style.left = left;
            }
        },
        _dismissTipWindow: function () {
            var tipwin = document.getElementById("tipwin");
            if (tipwin != null) {
                document.body.removeChild(tipwin);
            }
        },
        _trySelectFirstItem: function () {
            var thisObj = this;
            var objs = $("#tipwin table tr");
            if (objs.length > 0) {
                for (var i = 0; i < objs.length; i++) {
                    var obj = objs[i];
                    if (i == 0) {
                        obj.className = "tipSelected";
                        thisObj._curSelected = i;
                    }
                    else {
                        obj.className = "tipUnSelected";
                    }
                }
            }
        },
        _mouseOver: function ($obj) {
            //alert(o.innerText);
            var key = $obj.attr('id');//.getAttribute("id");
            this._selectItem(key);
        },
        _tipClick: function ($obj) {
            this._doItemSelect($obj);
        },
        enable: function (isEnabled, isEnableAll) {
            this._$element.find('.nameInput').enabled(isEnabled);
            if (isEnableAll && this._options.valueTarget != null) {
                $(this._options.valueTarget).enabled(isEnabled);
            }
        },
        populate: function (searchText) {
            var thisObj = this;
            if (thisObj._isPopulated) {
                thisObj._isPopulated = false;
                return;
            }
            //thisObj._isPopulated = true;
            searchText = searchText.replace(/(^\s*)|(\s*$)/g, '');
            if (thisObj._options.isBlank || searchText != "") {
                $.ajax({
                    url: thisObj._options.url,
                    method: "get",
                    data: $.extend({}, thisObj._options.data, { key: searchText }),//"key=" + searchText,
                    dataType: "JSON",
                    async: true,
                    success: function (result) {
                        //if (thisObj._options.onchange != null) {
                        //    thisObj._options.onchange({});
                        //}
                        if (thisObj._options.oninput != null) {
                            thisObj._options.oninput(thisObj._$element.find('.nameInput').val());
                        }

                        var data = result.rows;
                        if (data.length > 0) {
                            var html = "";
                            var hasContent = false;
                            html = '<table style="width: 100%">';
                            var tr = '<tr id="{0}">{1}{2}</tr>',
                                hidden = '<input type="hidden" colname="{0}" value="{1}"/>',
                                td = '<td style="width:{0}px;">{1}</td>';
                            thisObj._tipwinWidth = 0;
                            for (var i = 0; i < data.length; i++) {
                                if (thisObj._options.isSingle || !thisObj._nameExist(data[i].id)) {
                                    var tds = [],
                                        hiddens = [];
                                    $.each(thisObj._options.cols,
                                        function (j, item) {
                                            var thisTd = td.format(item.width, data[i][item.name]);
                                            tds.push(thisTd);
                                        });
                                    $.each(data[i],
                                        function (key, value) {
                                            hiddens.push(hidden.format(key, value));
                                        });
                                    var thisTr = tr.format(data[i][thisObj._options.id], hiddens.join(''), tds.join(''));
                                    html += thisTr;
                                    hasContent = true;
                                }
                            }
                            html += "</table>";

                            if (hasContent) {
                                thisObj._showTipWindow();
                                var obj = document.getElementById("tipwin");
                                obj.innerHTML = html;
                                $('#tipwin').find('tr')
                                    .on('mouseover',
                                    function () {
                                        thisObj._mouseOver($(this));
                                    })
                                    .bind("click", function () {
                                        thisObj._tipClick($(this));
                                    });
                                thisObj._trySelectFirstItem();
                            }
                            else {
                                thisObj._dismissTipWindow();
                            }
                        }
                        else {
                            thisObj._dismissTipWindow();
                        }
                    }
                });
            }
            else {
                thisObj._dismissTipWindow();
            }
        }
    }
    $.fn.btcNamebox = function (options) {
        var btcNamebox = new BtcNamebox(this, options);
        btcNamebox.init();
        return btcNamebox;
    }
})(window.jQuery, window, document);