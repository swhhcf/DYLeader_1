/// <reference path="../lib/jquery/jquery-1.7.2-vsdoc.js" />
/// <reference path="../lib/encode/jQuery.md5.js" />

/*
 * 添加多选控件, 参数详见下面注释:
 * $().addSelectionCtrl()
 * 获取已选值列表:
 * $().getSelectionValues()
 */
(function ($) {
    jQuery.fn.extend({
        setFilterInput: function (domId) {
            var $this = $(this);
            $(domId).on('input',
                function () {
                    var key = $(this).val();
                    $this.filterFromKeyword(key);
                });
        },
        addSelectionCtrl: function (data, valueField, pinyinField, textField, width, height, isMuli, fun) {
            /// <summary>添加多选控件</summary>
            /// <param name="data" type="object">josn 对象数组</param>
            /// <param name="valuefield" type="String">值字段名</param>
            /// <param name="pinyinField" type="String">拼音字段名</param>
            /// <param name="textField" type="String">显示文本字段名</param>
            /// <param name="width" type="String">每个选项的宽度</param>
            /// <param name="height" type="String">每个选项的高度</param>
            /// <param name="isMuli" type="bool">是否多选，默认多选</param>
            var $pnl = $(this),
                borderColor = '#c8c8c8',
                backColor = '#efefef',//'#f9f9f9',
                selectedBackColor = '#3398fe',
                template =
                    "<div style='cursor:pointer;float:left;margin:3px;padding-top:5px;padding-left:5px;font-size:14px;" +
                    "text-align:left;width:{0}px;height:{1}px;border:0px solid {2};" +
                    "background-color:{3};' class='btcSCOption'>" +
                    "<input type='hidden' isSelected='{6}' value='{4},{7}'/><span>{5}</span>" +
                    "</div>",
                divs = [];
            isMuli = isMuli !== false;
            template = template.format(width, height, borderColor, backColor, '{0}', '{1}', '{2}', '{3}');
            var btcSCSelectAll = template.format(0, "全选", 0, 0).replace("btcSCOption", "btcSCSelectAll").replace(",0,0", ""),
                btcSCUnSelectAll = template.format(0, "反选", 0, 0).replace("btcSCOption", "btcSCUnSelectAll").replace(",0,0", "");
            divs.push("<input type='hidden' value='0,{0}'/>".format(data.length));
            if (isMuli) {
                divs.push(btcSCSelectAll);
                divs.push(btcSCUnSelectAll);
                divs.push("<div style='clear:both;'></div>");
            }
            for (var i = 0; i < data.length; i++) {
                divs.push(template.format(data[i][valueField],
                    data[i][textField],
                    0,
                    pinyinField == "" || pinyinField == null ? "" : data[i][pinyinField]));
            }
            $pnl.empty().append(divs.join(""));
            $pnl.children(".btcSCSelectAll")
                .unbind("click")
                .bind("click",
                function () {
                    var isSelectAll = true;//thisColor != backColor;

                    $pnl.children(".btcSCOption")
                        .each(function () {
                            $(this)._setBackColor(backColor, selectedBackColor, isSelectAll);
                        });
                });

            $pnl.children(".btcSCUnSelectAll")
                .unbind("click")
                .bind("click",
                function () {
                    $pnl.children(".btcSCOption")
                        .each(function () {
                            $(this)._setBackColor(backColor, selectedBackColor);
                        });
                    //$(this)._setSelectAllBackColor(backColor, selectedBackColor);
                });

            $pnl.children(".btcSCOption")
                .unbind("click")
                .bind("click",
                function () {
                    if (!isMuli) {
                        $pnl.children(".btcSCOption")._setBackColor(backColor, selectedBackColor, false);
                        if (fun != null) {
                            var value = $(this).children().eq(0).val().split(',')[0];
                            fun(value);
                        }
                    }
                    $(this)._setBackColor(backColor, selectedBackColor);
                });
            return $pnl;
        },
        getSelectionValues: function (isVisible) {
            /// <summary>获取已选值列表, 当isVisible为false时，返回所有已选中的，默认只返回可见已选中的</summary>
            return $(this)._getSelectionValueOrTexts(true, isVisible);
        },
        getSelectionTexts: function (isVisible) {
            return $(this)._getSelectionValueOrTexts(false, isVisible);
        },
        _getSelectionValueOrTexts: function (isValue, isVisible) {
            var values = [];
            $(this)
                .children(".btcSCOption")
                .each(function () {
                    if (isVisible === false || $(this).is(":visible") == true) {
                        var $input = $(this).children("input");
                        if ($input.attr('isSelected') == "1") {
                            var value = isValue ? $input.val().split(",")[0] : $input.next().html();
                            values.push(value);
                        }
                    }
                });
            return values.join(",");
        },
        filterFromKeyword: function (key) {
            key = key.toLowerCase();
            $(this)
                .children(".btcSCOption")
                .each(function () {
                    var $this = $(this),
                        filterValues = $this.children("input").val().split(","),
                        pinyin = filterValues[1].toLowerCase(),
                        value = filterValues[0].toLowerCase(),
                        text = $this.children("span").html().toLowerCase();
                    if ($this.attr('ishide') != '1') {
                        if (pinyin.indexOf(key) < 0 && text.indexOf(key) < 0 && value.indexOf(key) < 0) {
                            $this.hide();
                        } else {
                            $this.show();
                        }
                    }
                });
            return $(this);
        },
        hideSelectionOption: function (codes) {
            var $div = $(this);
            $div.find(".btcSCOption")
                .each(function () {
                    var $this = $(this),
                        value = $this.children("input").val().split(",")[0];
                    if ($.inArray(value, codes) >= 0) {
                        $this.hide();
                        $this.attr('ishide', 1);
                    } else {
                        $this.show();
                        $this.attr('ishide', 0);
                    }
                });
            return $div;
        },
        _setBackColor: function (backColor, selectedBackColor, isAlwaysSelect) {
            var color = colorRGB2Hex($(this).css("background-color")),
                isSelected = isAlwaysSelect == true ? false : color == selectedBackColor;
            if (isAlwaysSelect == false) {
                isSelected = true;
            }
            var $this = $(this);
            var $hdn = $this.children("input"),
                //values = $hdn.val().split(","),
                newBackColor = !isSelected ? selectedBackColor : backColor,
                newFontColor = !isSelected ? '#ffffff' : '#000000',
                isTrueSelected = color == selectedBackColor;
            $this.css("background-color", newBackColor);
            $this.css('color', newFontColor);
            var className = $this.attr("class");
            if (className == "btcSCSelectAll" || className == "btcSCUnSelectAll") {
                return;
            }
            $hdn.attr('isSelected', isSelected ? 0 : 1);
            //$hdn.val((isSelected ? 0 : 1) + "," + values[1] + "," + values[2]);
            var $count = $this.parent().children("input"),
                counts = $count.val().split(","),
                selectedCount = counts[0],
                allCount = counts[1];
            if (!isTrueSelected) {
                selectedCount++;
            } else {
                selectedCount = selectedCount == 0 ? 0 : selectedCount - 1;
            }
            $count.val(selectedCount + "," + allCount);
        },
        _isDivboxSelected: function (selectedColor) {
            var color = colorRGB2Hex($(this).css("background-color"));
            return color == selectedColor;
        },
        _setSelectAllBackColor: function (backColor, selectedBackColor) {
            var $count = $(this).parent().children("input"),
                counts = $count.val().split(","),
                selectedCount = counts[0] * 1,
                $this = $(this),
                allCount = counts[1] * 1;
            if (selectedCount < allCount) {
                $this.parent().children(".btcSCSelectAll")._setBackColor(backColor, selectedBackColor, false);
            } else {
                $this.parent().children(".btcSCSelectAll")._setBackColor(backColor, selectedBackColor, true);
            }
        }
    });
})(window.jQuery);

function colorRGB2Hex(color) {
    var rgb = color.split(',');
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);

    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}