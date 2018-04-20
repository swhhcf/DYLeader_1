/// <reference path='../../jquery/jquery-1.7.2-vsdoc.js' />
/// <reference path='E:\WorkDoc\BtcSellOrder\BtcSellOrder\script/common.js' />

;
(function ($, window, document, undefined) {
    /*
     cols sample:
     [
         //普通列
         {display: "abcd", name: "a", width: 60, align: "center", order:true, rend:[]}, align 默认 center, rend 更新显示文字
         //自定义模板列
         {display: "abcd", name: "a", width: 60, align: "center",
         template: [["a", "b"], "<input type='button' value='{0},{1}'>"]}
     ]
     */

    var BtcTable = function (ele, opt) {
        this._$element = ele;
        this.defaults = {
            page: 1,        //页码
            pagesize: 50,   //每页记录数
            cols: null,     //列参数
            total: "total", //总记录数键
            root: "rows",   //数据键
            url: null,      //ajax地址
            data: null,     //本地数据
            action: "local",//是否是本地
            order: null,    //排序字段, 加asc或desc
            heightDiff: 0,  //高度差补偿
            checkbox: false,//是否有选择框列
            radio: false,   //是否有单选框
            idField: "id",  //主键
            nameField: "name",
            form: null,     //搜索条件表单
            parms: {},      //查询参数，如：{name:"name",id:1}
            onloaded: null, //数据加载完成后，要执行的方法
            onclick: null,  //单击行事件
            ondblclick: null,
            pager: true,
            colIsFromData: false,
            colWidth: null
        };
        this._parms = {};
        this._record = {
            total: 0,
            pageCount: 0,
            currFirst: 0,
            currLast: 0
        };
        this._widths = null;
        this._localData = [];
        this._template = {
            header: '<div style="width:100%; background-color: #f5f5f5; border:1px solid #c8c8c8;">' +
                '<div>' +
                '   <div bt-table-id="bt-table-header-div" style="overflow:hidden !important; border:1px solid #c8c8c8; border-left:none;border-top:none;">' +
                '      <table bt-table-id="bt-table-header" class="bt-table-resize" style="width:{1}px;">' +
                '         <thead class="bt-table-header"><tr>{0}</tr>' +
                '         </thead>' +
                '      </table>' +
                '   </div>' +
                '</div>',
            body: '<div bt-table-id="bt-table-body" style="overflow:auto; background-color: #fff !important;">' +
                '<table  style="width:{1}px;">' +
                '<tbody class="bt-table-body" bt-table-id="bt-table-content">{0}</tbody>' +
                '</table>' +
                '</div>' +
                '</div>',
            th: '<th style="width:{0}px !important; text-align:center;"><div style="width:{3}px !important; margin:auto !important;" bt-table-id="bt-table_col_{2}">{1}</div></th>',
            td: '<td style="width:{0}px !important;text-align:{1}; border-top:none !important;" {3}>{2}</td>',
            tdlast: '<td style="width:{0}px !important;text-align:{1}; border-bottom:none !important;" {3}>{2}</td>',
            tdOther: '<td id-value="{0}" style="text-align:{1}"  {3}>{2}</td>',
            tr: '<tr btvalue="{0}" btindex="{2}">{1}</tr>',
            pager: '<div class="bt-table-pager" style="background-color: #f5f5f5 !important; width: 100%; border:1px solid #ccc; border-top:none;">' +
                '<input type="button" value="　" bt-table-change_page="bt-pager-first" />' +
                '<input type="button" value="　" bt-table-change_page="bt-pager-prev" class="bt-table-pager" />' +
                '<input type="button" value="　" bt-table-change_page="bt-pager-next" class="bt-table-pager" />' +
                '<input type="button" value="　" bt-table-change_page="bt-pager-last" class="bt-table-pager" style="margin-right:12px !important;" />' +
                '第 <input type="text" bt-table-change_page="bt-pageindex" style="width:40px; height:16px;" value=""/> 页 / ' +
                '共&nbsp;<span bt-table-change_page="bt-pagecount"></span>&nbsp;页，&nbsp;&nbsp;' +
                '<select bt-table-change_page="bt-pagesize">' +
                '<option value="10">10</option>' +
                '<option value="20">20</option>' +
                '<option value="50">50</option>' +
                '<option value="100">100</option>' +
                '</select> 条 / 页，' +
                '第&nbsp;<span bt-table-change_page="bt-curr-first"></span>&nbsp;-&nbsp;' +
                '<span bt-table-change_page="bt-curr-last"></span>&nbsp;条 / ' +
                '共&nbsp;<span bt-table-change_page="bt-total"></span>&nbsp;条' +
                '</div>',
            checkbox: '<input type="checkbox" style="margin:0" value="{0}" bt-table-change_page="bt-table-chk_{1}">',
            radio: '<input type="radio" value="{0}" name="btcTableRadioId" bt-table-change_page="bt-table-rad_{1}">'
        };
        this._options = $.extend({}, this.defaults, opt);
        var $list = this._$element;
        this._pagerBtn = {
            first: '[bt-table-change_page="bt-pager-first"]',
            last: '[bt-table-change_page="bt-pager-last"]',
            prev: '[bt-table-change_page="bt-pager-prev"]',
            next: '[bt-table-change_page="bt-pager-next"]'
        };
        this._orderCols = {
            indexs: [],
            displays: []
        };
        this._items = null;
    }

    BtcTable.prototype = {
        _disableBtn: function () {
            var $list = this._$element;
            $.each(this._pagerBtn,
                function (i, value) {
                    $list.find(value).removeAttr('disabled');
                });
            if (this._options.page == this._record.pageCount) {
                $list.find(this._pagerBtn.last).attr('disabled', 'disabled');
                $list.find(this._pagerBtn.next).attr('disabled', 'disabled');
            }
            if (this._options.page == 1) {
                $list.find(this._pagerBtn.first).attr('disabled', 'disabled');
                $list.find(this._pagerBtn.prev).attr('disabled', 'disabled');
            }
        },
        _bindSearch: function () {
            if (this._options.form != null) {
                var thisObj = this;
                $(this._options.form)
                    .submit(function () {
                        var json = $(this).serializeObject();
                        thisObj.setParms(json);
                        return false;
                    });
            }
        },
        format: function () {
            var args = arguments[1] instanceof Array ? arguments[1] : arguments.splice(1);
            return arguments[0].replace(/\{(\d+)\}/g, function (m, i) {
                return args[i];
            });
        },
        _bindCheck: function () {
            var thisObj = this;
            if (thisObj._options.checkbox) {
                $('[bt-table-change_page="bt-table-chk_all"]')
                    .click(function () {
                        var $chks = $(thisObj._$element).find("input[type='checkbox']");
                        if ($(this).prop('checked')) {
                            $chks.prop('checked', 'checked');
                        } else {
                            $chks.removeProp('checked');
                        }
                    });
            }
        },
        _bindOnClickTr: function () {
            var thisObj = this;
            if (this._options.onclick != null) {
                $(this._$element)
                    .find("td")
                    .css("cursor", "pointer")
                    .click(function () {
                        var $td = $(this);
                        if ($td.find("a,input").length > 0) return;
                        var index = $td.parent().attr("btindex") * 1;
                        thisObj._options.onclick(thisObj._items[index], $td);
                    });
            }
        },
        _bindOnDblClickTr: function () {
            var thisObj = this;
            if (thisObj._options.ondblclick != null) {
                $(this._$element)
                    .find("td")
                    .css("cursor", "pointer")
                    .dblclick(function () {
                        var $td = $(this);
                        if ($td.find("a,input").length > 0) return;
                        var index = $td.parent().attr("btindex") * 1;
                        thisObj._options.ondblclick(thisObj._items[index], $td);
                    });
            }
        },
        _deepCopy: function (o) {
            var n;
            var i;
            if (o instanceof Array) {
                n = [];
                for (i = 0; i < o.length; ++i) {
                    n[i] = this._deepCopy(o[i]);
                }
                return n;
            } else if (o instanceof Object) {
                n = {};
                for (i in o) {
                    if (o.hasOwnProperty(i)) {
                        n[i] = this._deepCopy(o[i]);
                    }
                }
                return n;
            } else {
                return o;
            }
        },
        _setPager: function (total, isInit) {
            var thisObj = this,
                $list = thisObj._$element;
            this._record.total = total;
            this._record.pageCount = parseInt((this._record.total - 1) / this._options.pagesize) + 1;
            this._record.currFirst = total > 0 ? this._options.pagesize * (this._options.page - 1) + 1 : 0;
            var tmpLast = this._options.pagesize * this._options.page;
            this._record.currLast = tmpLast < this._record.total ? tmpLast : this._record.total;
            $list.find('[bt-table-change_page="bt-curr-first"]').html(this._record.currFirst);
            $list.find('[bt-table-change_page="bt-curr-last"]').html(this._record.currLast);
            $list.find('[bt-table-change_page="bt-total"]').html(this._record.total);
            $list.find('[bt-table-change_page="bt-pageindex"]').val(this._options.page);
            $list.find('[bt-table-change_page="bt-pagecount"]').html(this._record.pageCount);
            $list.find('[bt-table-change_page="bt-pagesize"]').val(this._options.pagesize)
                .bind('change', function () {
                    thisObj._options.pagesize = $(this).val();
                    thisObj._options.page = 1;
                    thisObj.init();
                });
            if (isInit === true) {
                $list.find(thisObj._pagerBtn.first)
                    .click(function () {
                        thisObj.first();
                    });
                $list.find(thisObj._pagerBtn.prev)
                    .click(function () {
                        thisObj.prev();
                    });
                $list.find(thisObj._pagerBtn.next)
                    .click(function () {
                        thisObj.next();
                    });
                $list.find(thisObj._pagerBtn.last)
                    .click(function () {
                        thisObj.last();
                    });
                $list.find('[bt-table-change_page="bt-pageindex"]')
                    .keyup(function (e) {
                        if (e.keyCode == 13) {
                            var page = thisObj.gotoPage($(this).val());
                            if (page + '' != $(this).val()) {
                                $(this).val(page);
                            }
                        }
                    });
            }
        },
        _bindOrder: function () {
            var thisObj = this;
            $.each(thisObj._options.cols,
                function (i, colItem) {
                    if (colItem.order === true) {
                        thisObj._orderCols.indexs.push(i);
                        thisObj._orderCols.displays.push(colItem.display + "↑↓");

                        $("#bt-table_col_" + i)
                            .html(colItem.display + "↑↓")
                            .css("cursor", "pointer")
                            .bind('click', function () {
                                var displayCurr = $(this).html(),
                                    displayLastestChar = displayCurr.substr(displayCurr.length - 2),
                                    orderAsc = true,
                                    displaySrc = colItem.display;
                                if (displayLastestChar == " ↑") {
                                    displayCurr = displaySrc + " ↓";
                                    orderAsc = false;
                                } else {
                                    if (displayCurr == displaySrc + "↑↓" || displayLastestChar == " ↓") {
                                        displayCurr = displaySrc + " ↑";
                                    }
                                }

                                for (var j = 0; j < thisObj._orderCols.indexs.length; j++) {
                                    var index = thisObj._orderCols.indexs[j];
                                    $("#bt-table_col_" + index).html(thisObj._orderCols.displays[j]);
                                }

                                $(this).html(displayCurr);
                                thisObj._options.order = orderAsc === true ? colItem.name : colItem.name + " desc";
                                thisObj.init();
                            });
                    }
                });
        },
        _getCurrPageData: function () {
            var rows = [],
                firstIndex = (this._options.page - 1) * this._options.pagesize,
                lastIndex = firstIndex + this._options.pagesize;
            this._localData = this._deepCopy(this._options.data);
            //for (var j = 0; j < this._options.data.length; j++) {
            //    this._localData.push(this._options.data[j]);
            //}

            //var tmp =
            var newData = this._deepCopy(this._localData).rows;
            //$.each(this._parms, function (key, value) {
            //    if (newData.length > 0 && newData[0][key] == undefined) {
            //        return true;
            //    }
            //    var result = [];
            //    for (var j = 0; j < newData.length; j++) {
            //        if (value == "" || (newData[j][key] !== undefined && newData[j][key].indexOf(value) >= 0)) {
            //            result.push(newData[j]);
            //        }
            //    }
            //    newData = result;
            //});
            lastIndex = lastIndex > newData.length ? newData.length : lastIndex;
            for (var i = firstIndex; i < lastIndex; i++) {
                rows.push(newData[i]);
            }
            return { total: newData.length, success: true, rows: rows };
        },
        _fillTable: function (result, tableBodyHeight, isInit) {
            var headThs = [],
                trs = [],
                thisObj = this,
                options = thisObj._options,
                data = result[options.root],
                template = thisObj._template,
                $element = thisObj._$element,
                defaultColWidth = options.colWidth == null ? 60 : options.colWidth;
            defaultCol = { display: "", name: "", width: defaultColWidth, align: "center", template: null, rend: null },
                widthSum = 30,
                tdAlign = {
                    center: 'center',
                    left: 'left',
                    right: 'right',
                    c: 'center',
                    l: 'left',
                    r: 'right'
                };
            this._items = data;
            if (options.colIsFromData) {
                options.cols = [];
                if (data.length > 0) {
                    $.each(data[0],
                        function (key, value) {
                            var arr = key.split('_'),
                                width = arr.length > 1 ? arr[1] * 1 : defaultColWidth,
                                align = arr.length > 2 ? arr[2] : 'c';
                            options.cols.push($.extend({}, defaultCol, { display: arr[0], name: key, width: width, align: align }));
                        });
                }
            }
            //添加表体
            for (var j = 0; j < data.length; j++) {
                var widthStartIndex = 1;
                var tds = [];
                var tdTemplate = j == 0 ? template.td : template.tdOther; //(j == data.length - 1 ? template.tdlast :
                tds.push(tdTemplate.format(30, 'right', j + 1));

                //插入checkbox
                if (options.checkbox) {
                    tds.push(tdTemplate.format(20, 'center', template.checkbox.format(data[j][options.idField], j)));
                    widthStartIndex++;
                    widthSum += j == 0 ? 20 : 0;
                }
                if (options.radio) {
                    tds.push(tdTemplate.format(20, 'center', template.radio.format(data[j][options.idField], j)));
                    widthStartIndex++;
                    widthSum += j == 0 ? 20 : 0;
                }
                var isHaveWidth = thisObj._widths != null;
                $.each(options.cols, function (i, colItem) {
                    var tmpTd = null,
                        item = $.extend({}, defaultCol, colItem);
                    if (item.template != null) {
                        var tmpDatas = [];
                        for (var k = 0; k < item.template[0].length; k++) {
                            tmpDatas.push(data[j][item.template[0][k]]);
                        }
                        tmpTd = item.template[1].format(tmpDatas);
                    } else {
                        var value = data[j][item.name];
                        value = value == null ? '' : value;
                        if (item.rend != null) {
                            var indexOfValue = $.inArray(value, item.rend);
                            if (indexOfValue >= 0) {
                                value = item.rend[indexOfValue + 1];
                            }
                        }
                        tmpTd = value;
                    }
                    var tdWidth = isHaveWidth ? thisObj._widths[i + widthStartIndex] : item.width;
                    widthSum += j == 0 ? tdWidth : 0;
                    tds.push(tdTemplate.format(tdWidth,
                        tdAlign[item.align],
                        tmpTd,
                        item.classname != null ? 'class="' + item.classname + '"' : ''));
                });
                trs.push(template.tr.format(data[j][options.idField], tds.join(""), j));
            }
            var bodyTr = trs.join("");
            if (isInit !== true) {
                $element.find('[bt-table-id="bt-table-content"]').empty().append(bodyTr);
                $element.find('[bt-table-id="bt-table-body"]').scrollTop(-10000);
            } else {
                //添加表头
                headThs.push(template.th.format(30, '', 0, 30));
                //insert checkbox
                if (options.checkbox) {
                    headThs.push(template.th.format(20, template.checkbox.format('', 'all'), 0, 20));
                }
                if (options.radio) {
                    headThs.push(template.th.format(20, '', 0, 20));
                }
                $.each(options.cols,
                    function (i, item) {
                        headThs.push(template.th.format(item.width, item.display, i, item.width));
                    });
                var header = template.header.format(headThs.join(""), widthSum),
                    body = template.body.format(bodyTr, widthSum);

                var isHasPager = thisObj._options.pager === true;

                //显示Pager
                var pager = isHasPager ? template.pager : '';
                $element.empty().append(header + body + pager);

                var headerHeight = $element.find('thead').height();
                if (isHasPager) {
                    $element.find('[bt-table-id="bt-table-body"]').height(tableBodyHeight - headerHeight);
                }

                //绑定事件
                thisObj._bindCheck();
                thisObj._bindSearch();
                thisObj._bindOrder();
            }
            $('[bt-table-id="bt-table-body"] table')
                .find("tr").eq(0).css("border-top-width", "0")
                .find("td").css("border-top-width", "0");
            if (thisObj._options.pager === true) {
                thisObj._setPager(result[thisObj._options.total], isInit);
                thisObj._disableBtn();
            }
            thisObj._bindOnClickTr();
            thisObj._bindOnDblClickTr();
        },
        _sort: function (data, order) {
            var orders = order.split(" "),
                colId = orders[0],
                isAsc = orders.length == 1 || orders[1].toLowerCase() == "asc";
            var desc = function (x, y) {
                return (x[colId] < y[colId]) ? 1 : -1;
            }
            //对json进行升序排序函数
            var asc = function (x, y) {
                return (x[colId] > y[colId]) ? 1 : -1;
            }
            data.sort(isAsc ? asc : desc);
            return data;
        },
        getSelectedValues: function () {
            var values = [];
            this._$element.find('[bt-table-id="bt-table-body"] input:checked').each(function () {
                values.push($(this).val());
            });
            return values.join(",");
        },
        getSelectedValue: function (fieldName) {
            var $checkedRadio = this._$element.find('[bt-table-id="bt-table-body"] input:checked');
            if ($checkedRadio.length < 1) {
                return null;
            }
            var index = $checkedRadio.parent().parent().attr("btindex"),
                item = this._options.nameField == null ? null : this._items[index];
            var returnValue = { id: $checkedRadio.val(), name: item[this._options.nameField] };
            if (fieldName != null) {
                returnValue[fieldName] = item[fieldName];
            }
            return returnValue;
        },
        getSelectedItem: function () {
            var $checkedRadio = this._$element.find('[bt-table-id="bt-table-body"] input:checked');
            if ($checkedRadio.length < 1) {
                return null;
            }
            var index = $checkedRadio.parent().parent().attr("btindex");
            return this._items[index];
        },
        getSelectedItems: function () {
            var returnItems = [];
            var thisObj = this;
            var $checkedRadio = this._$element.find('[bt-table-id="bt-table-body"] input:checked');
            if ($checkedRadio.length < 1) {
                return null;
            }
            $checkedRadio.each(function () {
                var index = $(this).parent().parent().attr("btindex");
                returnItems.push(thisObj._items[index]);
            });
            return returnItems;
        },
        init: function (parms, isInit) {
            var thisObj = this,
                isHasLayer = layer != null,
                delayTip = isHasLayer ? layer.load(2) : null,
                options = thisObj._options,
                //template = thisObj._template,
                $element = $(thisObj._$element),
                prevHeight = $element.prev().height(),
                tableBodyHeight = $(document).height() - prevHeight - 61 - options.heightDiff,
                formParm = null;
            if (thisObj._options.form != null) {
                formParm = $(thisObj._options.form).serializeObject();
            }
            thisObj._parms = $.extend(
                thisObj._parms,
                options.parms,
                { page: options.page, pagesize: options.pagesize, order: options.order },
                formParm,
                parms);
            if (options.url == null) {
                if (options.order != null && options.order != "") {
                    thisObj._sort(options.data, options.order);
                }
                var currPageData = thisObj._getCurrPageData();
                thisObj._fillTable(currPageData, tableBodyHeight, isInit);
                thisObj._setOther(currPageData);
                return;
            }
            var url = options.url;
            url += (url.indexOf("?") >= 0 ? "&" : "?") + "time_rand=" + Date.now();
            $.ajax({
                type: "get",
                url: url,
                data: thisObj._parms, //$.extend({}, { page: options.page, pagesize: options.pagesize, order: options.order }, parms),
                dataType: "json",
                //async: false,
                error: function () {
                    var msg = '服务器出错，请重试。';
                    if (isHasLayer) {
                        layer.close(delayTip);
                        layer.msg(msg);
                    } else {
                        alert(msg);
                    }
                },
                success: function (result) {
                    thisObj._fillTable(result, tableBodyHeight, isInit);

                    //设置滚动
                    thisObj._setOther(result);
                    //var $contentDiv = thisObj._$element.find('[bt-table-id="bt-table-body"]'),
                    //    $headDiv = thisObj._$element.find('[bt-table-id="bt-table-header-div"]');
                    //if ($contentDiv.width() > 0) {
                    //    $headDiv.width($contentDiv.width() - ($contentDiv.width() - $contentDiv[0].clientWidth));
                    //}

                    //$contentDiv.unbind('scroll').scroll(function () {
                    //    $headDiv.scrollLeft($contentDiv.scrollLeft());
                    //});

                    //disabledCols = [0];
                    //if (thisObj._options.checkbox || thisObj._options.radio) {
                    //    disabledCols.push(1);
                    //}

                    //thisObj._$element.find('.bt-table-resize').colResizable({
                    //    liveDrag: true,
                    //    resizeMode: 'overflow',
                    //    disabledColumns: disabledCols,
                    //    onDrag: function (e) {
                    //        var $th = $(e.currentTarget).find('th'),
                    //            widths = [],
                    //            widthSum = 0;
                    //        $th.each(function () {
                    //            widths.push($(this).width());
                    //        });
                    //        thisObj._$element.find('tbody').find('tr').eq(0).find('td').each(function (i) {
                    //            $(this).width(widths[i]);
                    //            widthSum += widths[i];
                    //        });
                    //        thisObj._$element.find('tbody').parent().width(widthSum);
                    //        thisObj._widths = widths;
                    //    }
                    //});

                    //if (!result.success) {
                    //    var msg = "没有数据，请修改查询条件后重试。";
                    //    if (result.errorMsg != null && result.errorMsg != "") {
                    //        msg = result.errorMsg;
                    //    }
                    //    //layer.msg(msg);
                    //}
                    //if (isHasLayer) {
                    //    layer.close(delayTip);
                    //}
                    //if (options.onloaded != null) {
                    //    options.onloaded();
                    //}
                }
            });
        },
        _setOther: function (result) {
            var thisObj = this;
            var isHasLayer = layer != null;
            var options = thisObj._options;
            var $contentDiv = thisObj._$element.find('[bt-table-id="bt-table-body"]'),
                $headDiv = thisObj._$element.find('[bt-table-id="bt-table-header-div"]');
            if ($contentDiv.width() > 0) {
                $headDiv.width($contentDiv.width() - ($contentDiv.width() - $contentDiv[0].clientWidth));
            }

            $contentDiv.unbind('scroll').scroll(function () {
                $headDiv.scrollLeft($contentDiv.scrollLeft());
            });

            var disabledCols = [0];
            if (thisObj._options.checkbox || thisObj._options.radio) {
                disabledCols.push(1);
            }

            thisObj._$element.find('.bt-table-resize').colResizable({
                liveDrag: true,
                resizeMode: 'overflow',
                disabledColumns: disabledCols,
                onDrag: function (e) {
                    var $th = $(e.currentTarget).find('th'),
                        widths = [],
                        widthSum = 0;
                    $th.each(function () {
                        widths.push($(this).width());
                    });
                    thisObj._$element.find('tbody').find('tr').eq(0).find('td').each(function (i) {
                        $(this).width(widths[i]);
                        widthSum += widths[i];
                    });
                    thisObj._$element.find('tbody').parent().width(widthSum);
                    thisObj._widths = widths;
                }
            });

            if (!result.success) {
                var msg = "没有数据，请修改查询条件后重试。";
                if (result.errorMsg != null && result.errorMsg != "") {
                    msg = result.errorMsg;
                }
                //layer.msg(msg);
            }
            if (isHasLayer) {
                layer.closeAll();
            }
            if (options.onloaded != null) {
                options.onloaded();
            }
        },

        next: function () {
            if (this._options.page == this._record.pageCount) return;
            this._options.page += 1;
            this.init();
        },
        prev: function () {
            if (this._options.page == 1) return;
            this._options.page -= 1;
            this.init();
        },
        first: function () {
            if (this._options.page == 1) return;
            this._options.page = 1;
            this.init();
        },
        last: function () {
            if (this._options.page == this._record.pageCount) return;
            this._options.page = this._record.pageCount;
            this.init();
        },
        gotoPage: function (page) {
            if (!/^\d+$/.test(page)) {
                return this._options.page;
            }
            page = parseInt(page);
            if (page > this._record.pageCount) {
                return this._options.page;
            }
            if (this._options.page == page) return page;
            this._options.page = page;
            this.init();
        },
        setParms: function (parms) {
            this._options.page = 1;
            this.init(parms);
        },
        reload: function () {
            this._options.page = 1;
            this.init();
        },
        getValue: function () {
            alert(this._$element.attr('id'));
        }
    }
    $.fn.btcTable = function (options, parms) {
        /// <summary>生成表格</summary>
        /// <param name="options" type="object">
        ///  options: 选项
        ///  page: 页码 int.
        ///  pagesize: 每页记录数 int.
        ///  cols: 列参数, 如[{display: "abcd", name: "a", width: 60, align: "center", order:true}].
        ///  total: 总记录数键,string 默认"total".
        ///  root: 数据键, string 默认 "rows".
        ///  url: ajax地址.
        ///  data: 本地数据.
        ///  action: 是否是本地.
        ///  order: 排序字段, 加asc或desc.
        ///  heightDiff: 高度差补偿, int.
        ///  checkbox: 是否有选择框列, bool 默认 false.
        ///  idField: 主键，string 默认 "id".
        ///  form: 搜索条件表单 jquery 选择器.
        ///  onloaded: 数据加载完成后，要执行的方法 function.
        ///  onclick: 单击行事件 function
        /// </param >
        /// <param name="parms" type="object">查询参数，如：{name:"name",id:1}</param>
        var btcTable = new BtcTable(this, options);
        btcTable.init(parms, true);
        return btcTable;
    }

    $.fn.serializeObject = function () {
        var o = {};
        var arr = $(this).serializeArray();
        $.each(arr, function () {
            var key = this.name;
            key = key.replace('[]', '');
            if (o[key] !== undefined) {
                if (!o[key].push) {
                    o[key] = [o[key]];
                }
                o[key].push(this.value || "");
            } else {
                o[key] = this.value || "";
            }
        });

        var $radio = $('input[type=radio],input[type=checkbox]', this);
        var temp = o;
        $.each($radio, function () {
            if ($("input[name='" + this.name + "']:checked").length == 0) {
                temp[this.name] = "";
                //a.push({ name: this.name, value: "" });
            }
        });
        return o;
    };
})(window.jQuery, window, document);

/**
               _ _____           _          _     _
              | |  __ \         (_)        | |   | |
      ___ ___ | | |__) |___  ___ _ ______ _| |__ | | ___
     / __/ _ \| |  _  // _ \/ __| |_  / _` | '_ \| |/ _ \
    | (_| (_) | | | \ \  __/\__ \ |/ / (_| | |_) | |  __/
     \___\___/|_|_|  \_\___||___/_/___\__,_|_.__/|_|\___|

	v1.6 - jQuery plugin created by Alvaro Prieto Lauroba

	Licences: MIT & GPL
	Feel free to use or modify this plugin as far as my full name is kept

	If you are going to use this plug-in in production environments it is
	strongly recommended to use its minified version: colResizable.min.js

*/

(function ($) {
    var d = $(document); 		//window object
    var h = $("head");			//head object
    var drag = null;			//reference to the current grip that is being dragged
    var tables = {};			//object of the already processed tables (table.id as key)
    var count = 0;				//internal count to create unique IDs when needed.

    //common strings for packing
    var ID = "id";
    var PX = "px";
    var SIGNATURE = "JColResizer";
    var FLEX = "JCLRFlex";

    //short-cuts
    var I = parseInt;
    var M = Math;
    var ie = navigator.userAgent.indexOf('Trident/4.0') > 0;
    var S;
    try { S = sessionStorage; } catch (e) { }	//Firefox crashes when executed as local file system

    //append required CSS rules
    h.append("<style type='text/css'>  .JColResizer{table-layout:fixed;} .JColResizer > tbody > tr > td, .JColResizer > tbody > tr > th{overflow:hidden;padding-left:0!important; padding-right:0!important;}  .JCLRgrips{ height:0px; position:relative;} .JCLRgrip{margin-left:-5px; position:absolute; z-index:5; } .JCLRgrip .JColResizer{position:absolute;background-color:red;filter:alpha(opacity=1);opacity:0;width:10px;height:100%;cursor: e-resize;top:0px} .JCLRLastGrip{position:absolute; width:1px; } .JCLRgripDrag{ border-left:1px dotted black;	} .JCLRFlex{width:auto!important;} .JCLRgrip.JCLRdisabledGrip .JColResizer{cursor:default; display:none;}</style>");

	/**
	 * Function to allow column resizing for table objects. It is the starting point to apply the plugin.
	 * @param {DOM node} tb - reference to the DOM table object to be enhanced
	 * @param {Object} options	- some customization values
	 */
    var init = function (tb, options) {
        var t = $(tb);				    //the table object is wrapped
        t.opt = options;                //each table has its own options available at anytime
        t.mode = options.resizeMode;    //shortcuts
        t.dc = t.opt.disabledColumns;
        if (t.opt.disable) return destroy(t);				//the user is asking to destroy a previously colResized table
        var id = t.id = t.attr(ID) || SIGNATURE + count++;	//its id is obtained, if null new one is generated
        t.p = t.opt.postbackSafe; 							//short-cut to detect postback safe
        if (!t.is("table") || tables[id] && !t.opt.partialRefresh) return; 		//if the object is not a table or if it was already processed then it is ignored.
        if (t.opt.hoverCursor !== 'e-resize') h.append("<style type='text/css'>.JCLRgrip .JColResizer:hover{cursor:" + t.opt.hoverCursor + "!important}</style>");  //if hoverCursor has been set, append the style
        t.addClass(SIGNATURE).attr(ID, id).before('<div class="JCLRgrips"/>');	//the grips container object is added. Signature class forces table rendering in fixed-layout mode to prevent column's min-width
        t.g = []; t.c = []; t.w = t.width(); t.gc = t.prev(); t.f = t.opt.fixed;	//t.c and t.g are arrays of columns and grips respectively
        if (options.marginLeft) t.gc.css("marginLeft", options.marginLeft);  	//if the table contains margins, it must be specified
        if (options.marginRight) t.gc.css("marginRight", options.marginRight);  	//since there is no (direct) way to obtain margin values in its original units (%, em, ...)
        t.cs = I(ie ? tb.cellSpacing || tb.currentStyle.borderSpacing : t.css('border-spacing')) || 2;	//table cellspacing (not even jQuery is fully cross-browser)
        t.b = I(ie ? tb.border || tb.currentStyle.borderLeftWidth : t.css('border-left-width')) || 1;	//outer border width (again cross-browser issues)
        // if(!(tb.style.width || tb.width)) t.width(t.width()); //I am not an IE fan at all, but it is a pity that only IE has the currentStyle attribute working as expected. For this reason I can not check easily if the table has an explicit width or if it is rendered as "auto"
        tables[id] = t; 	//the table object is stored using its id as key
        createGrips(t);		//grips are created
    };

	/**
	 * This function allows to remove any enhancements performed by this plugin on a previously processed table.
	 * @param {jQuery ref} t - table object
	 */
    var destroy = function (t) {
        var id = t.attr(ID), t = tables[id];		//its table object is found
        if (!t || !t.is("table")) return;			//if none, then it wasn't processed
        t.removeClass(SIGNATURE + " " + FLEX).gc.remove();	//class and grips are removed
        delete tables[id];						//clean up data
    };

	/**
	 * Function to create all the grips associated with the table given by parameters
	 * @param {jQuery ref} t - table object
	 */
    var createGrips = function (t) {
        var th = t.find(">thead>tr:first>th,>thead>tr:first>td"); //table headers are obtained
        if (!th.length) th = t.find(">tbody>tr:first>th,>tr:first>th,>tbody>tr:first>td, >tr:first>td");	 //but headers can also be included in different ways
        th = th.filter(":visible");					//filter invisible columns
        t.cg = t.find("col"); 						//a table can also contain a colgroup with col elements
        t.ln = th.length;							//table length is stored
        if (t.p && S && S[t.id]) memento(t, th);		//if 'postbackSafe' is enabled and there is data for the current table, its coloumn layout is restored
        th.each(function (i) {						//iterate through the table column headers
            var c = $(this); 						//jquery wrap for the current column
            var dc = t.dc.indexOf(i) != -1;           //is this a disabled column?
            var g = $(t.gc.append('<div class="JCLRgrip"></div>')[0].lastChild); //add the visual node to be used as grip
            g.append(dc ? "" : t.opt.gripInnerHtml).append('<div class="' + SIGNATURE + '"></div>');
            if (i == t.ln - 1) {                        //if the current grip is the las one
                g.addClass("JCLRLastGrip");         //add a different css class to stlye it in a different way if needed
                if (t.f) g.html("");                 //if the table resizing mode is set to fixed, the last grip is removed since table with can not change
            }
            g.bind('touchstart mousedown', onGripMouseDown); //bind the mousedown event to start dragging

            if (!dc) {
                //if normal column bind the mousedown event to start dragging, if disabled then apply its css class
                g.removeClass('JCLRdisabledGrip').bind('touchstart mousedown', onGripMouseDown);
            } else {
                g.addClass('JCLRdisabledGrip');
            }

            g.t = t; g.i = i; g.c = c; c.w = c.width();		//some values are stored in the grip's node data as shortcut
            t.g.push(g); t.c.push(c);						//the current grip and column are added to its table object
            c.width(c.w).removeAttr("width");				//the width of the column is converted into pixel-based measurements
            g.data(SIGNATURE, { i: i, t: t.attr(ID), last: i == t.ln - 1 });	 //grip index and its table name are stored in the HTML
        });
        t.cg.removeAttr("width");	//remove the width attribute from elements in the colgroup

        t.find('td, th').not(th).not('table th, table td').each(function () {
            $(this).removeAttr('width');	//the width attribute is removed from all table cells which are not nested in other tables and dont belong to the header
        });
        if (!t.f) {
            t.removeAttr('width').addClass(FLEX); //if not fixed, let the table grow as needed
        }
        syncGrips(t); 				//the grips are positioned according to the current table layout
        //there is a small problem, some cells in the table could contain dimension values interfering with the
        //width value set by this plugin. Those values are removed
    };

	/**
	 * Function to allow the persistence of columns dimensions after a browser postback. It is based in
	 * the HTML5 sessionStorage object, which can be emulated for older browsers using sessionstorage.js
	 * @param {jQuery ref} t - table object
	 * @param {jQuery ref} th - reference to the first row elements (only set in deserialization)
	 */
    var memento = function (t, th) {
        var w, m = 0, i = 0, aux = [], tw;
        if (th) {										//in deserialization mode (after a postback)
            t.cg.removeAttr("width");
            if (t.opt.flush) { S[t.id] = ""; return; } 	//if flush is activated, stored data is removed
            w = S[t.id].split(";");					//column widths is obtained
            tw = w[t.ln + 1];
            if (!t.f && tw) {							//if not fixed and table width data available its size is restored
                t.width(tw *= 1);
                if (t.opt.overflow) {				//if overfolw flag is set, restore table width also as table min-width
                    t.css('min-width', tw + PX);
                    t.w = tw;
                }
            }
            for (; i < t.ln; i++) {						//for each column
                aux.push(100 * w[i] / w[t.ln] + "%"); 	//width is stored in an array since it will be required again a couple of lines ahead
                th.eq(i).css("width", aux[i]); 	//each column width in % is restored
            }
            for (i = 0; i < t.ln; i++)
                t.cg.eq(i).css("width", aux[i]);	//this code is required in order to create an inline CSS rule with higher precedence than an existing CSS class in the "col" elements
        } else {							//in serialization mode (after resizing a column)
            S[t.id] = "";				//clean up previous data
            for (; i < t.c.length; i++) {	//iterate through columns
                w = t.c[i].width();		//width is obtained
                S[t.id] += w + ";";		//width is appended to the sessionStorage object using ID as key
                m += w;					//carriage is updated to obtain the full size used by columns
            }
            S[t.id] += m;							//the last item of the serialized string is the table's active area (width),
            //to be able to obtain % width value of each columns while deserializing
            if (!t.f) S[t.id] += ";" + t.width(); 	//if not fixed, table width is stored
        }
    };

	/**
	 * Function that places each grip in the correct position according to the current table layout
	 * @param {jQuery ref} t - table object
	 */
    var syncGrips = function (t) {
        t.gc.width(t.w);			//the grip's container width is updated
        for (var i = 0; i < t.ln; i++) {	//for each column
            var c = t.c[i];
            t.g[i].css({			//height and position of the grip is updated according to the table layout
                left: c.offset().left - t.offset().left + c.outerWidth(false) + t.cs / 2 + PX,
                height: t.opt.headerOnly ? t.c[0].outerHeight(false) : t.outerHeight(false)
            });
        }
    };

	/**
	* This function updates column's width according to the horizontal position increment of the grip being
	* dragged. The function can be called while dragging if liveDragging is enabled and also from the onGripDragOver
	* event handler to synchronize grip's position with their related columns.
	* @param {jQuery ref} t - table object
	* @param {number} i - index of the grip being dragged
	* @param {bool} isOver - to identify when the function is being called from the onGripDragOver event
	*/
    var syncCols = function (t, i, isOver) {
        var inc = drag.x - drag.l, c = t.c[i], c2 = t.c[i + 1];
        var w = c.w + inc; var w2 = c2.w - inc;	//their new width is obtained
        c.width(w + PX);
        t.cg.eq(i).width(w + PX);
        if (t.f) { //if fixed mode
            c2.width(w2 + PX);
            t.cg.eq(i + 1).width(w2 + PX);
        } else if (t.opt.overflow) {				//if overflow is set, incriment min-width to force overflow
            t.css('min-width', t.w + inc);
        }
        if (isOver) {
            c.w = w;
            c2.w = t.f ? w2 : c2.w;
        }
    };

	/**
	* This function updates all columns width according to its real width. It must be taken into account that the
	* sum of all columns can exceed the table width in some cases (if fixed is set to false and table has some kind
	* of max-width).
	* @param {jQuery ref} t - table object
	*/
    var applyBounds = function (t) {
        var w = $.map(t.c, function (c) {			//obtain real widths
            return c.width();
        });
        t.width(t.w = t.width()).removeClass(FLEX);	//prevent table width changes
        $.each(t.c, function (i, c) {
            c.width(w[i]).w = w[i];				//set column widths applying bounds (table's max-width)
        });
        t.addClass(FLEX);						//allow table width changes
    };

	/**
	 * Event handler used while dragging a grip. It checks if the next grip's position is valid and updates it.
	 * @param {event} e - mousemove event binded to the window object
	 */
    var onGripDrag = function (e) {
        if (!drag) return;
        var t = drag.t;		//table object reference
        var oe = e.originalEvent.touches;
        var ox = oe ? oe[0].pageX : e.pageX;    //original position (touch or mouse)
        var x = ox - drag.ox + drag.l;	        //next position according to horizontal mouse position increment
        var mw = t.opt.minWidth, i = drag.i;	//cell's min width
        var l = t.cs * 1.5 + mw + t.b;
        var last = i == t.ln - 1;                 			//check if it is the last column's grip (usually hidden)
        var min = i ? t.g[i - 1].position().left + t.cs + mw : l;	//min position according to the contiguous cells
        var max = t.f ? 	//fixed mode?
            i == t.ln - 1 ?
                t.w - l :
                t.g[i + 1].position().left - t.cs - mw :
            Infinity; 								//max position according to the contiguous cells
        x = M.max(min, M.min(max, x));				//apply bounding
        drag.x = x; drag.css("left", x + PX); 	//apply position increment
        if (last) {									//if it is the last grip
            var c = t.c[drag.i];					//width of the last column is obtained
            drag.w = c.w + x - drag.l;
        }
        if (t.opt.liveDrag) { 			//if liveDrag is enabled
            if (last) {
                c.width(drag.w);
                if (!t.f && t.opt.overflow) {			//if overflow is set, incriment min-width to force overflow
                    t.css('min-width', t.w + x - drag.l);
                } else {
                    t.w = t.width();
                }
            } else {
                syncCols(t, i); 			//columns are synchronized
            }
            syncGrips(t);
            var cb = t.opt.onDrag;							//check if there is an onDrag callback
            if (cb) { e.currentTarget = t[0]; cb(e); }		//if any, it is fired
        }
        return false; 	//prevent text selection while dragging
    };

	/**
	 * Event handler fired when the dragging is over, updating table layout
     * @param {event} e - grip's drag over event
	 */
    var onGripDragOver = function (e) {
        d.unbind('touchend.' + SIGNATURE + ' mouseup.' + SIGNATURE).unbind('touchmove.' + SIGNATURE + ' mousemove.' + SIGNATURE);
        $("head :last-child").remove(); 				//remove the dragging cursor style
        if (!drag) return;
        drag.removeClass(drag.t.opt.draggingClass);		//remove the grip's dragging css-class
        if (!(drag.x - drag.l == 0)) {
            var t = drag.t;
            var cb = t.opt.onResize; 	    //get some values
            var i = drag.i;                 //column index
            var last = i == t.ln - 1;         //check if it is the last column's grip (usually hidden)
            var c = t.g[i].c;               //the column being dragged
            if (last) {
                c.width(drag.w);
                c.w = drag.w;
            } else {
                syncCols(t, i, true);	//the columns are updated
            }
            if (!t.f) applyBounds(t);	//if not fixed mode, then apply bounds to obtain real width values
            syncGrips(t);				//the grips are updated
            if (cb) { e.currentTarget = t[0]; cb(e); }	//if there is a callback function, it is fired
            if (t.p && S) memento(t); 	//if postbackSafe is enabled and there is sessionStorage support, the new layout is serialized and stored
        }
        drag = null;   //since the grip's dragging is over
    };

	/**
	 * Event handler fired when the grip's dragging is about to start. Its main goal is to set up events
	 * and store some values used while dragging.
     * @param {event} e - grip's mousedown event
	 */
    var onGripMouseDown = function (e) {
        var o = $(this).data(SIGNATURE);			//retrieve grip's data
        var t = tables[o.t], g = t.g[o.i];			//shortcuts for the table and grip objects
        var oe = e.originalEvent.touches;           //touch or mouse event?
        g.ox = oe ? oe[0].pageX : e.pageX;            //the initial position is kept
        g.l = g.position().left;
        g.x = g.l;

        d.bind('touchmove.' + SIGNATURE + ' mousemove.' + SIGNATURE, onGripDrag).bind('touchend.' + SIGNATURE + ' mouseup.' + SIGNATURE, onGripDragOver);	//mousemove and mouseup events are bound
        h.append("<style type='text/css'>*{cursor:" + t.opt.dragCursor + "!important}</style>"); 	//change the mouse cursor
        g.addClass(t.opt.draggingClass); 	//add the dragging class (to allow some visual feedback)
        drag = g;							//the current grip is stored as the current dragging object
        if (t.c[o.i].l) for (var i = 0, c; i < t.ln; i++) { c = t.c[i]; c.l = false; c.w = c.width(); } 	//if the colum is locked (after browser resize), then c.w must be updated
        return false; 	//prevent text selection
    };

	/**
	 * Event handler fired when the browser is resized. The main purpose of this function is to update
	 * table layout according to the browser's size synchronizing related grips
	 */
    var onResize = function () {
        for (var t in tables) {
            if (tables.hasOwnProperty(t)) {
                t = tables[t];
                var i, mw = 0;
                t.removeClass(SIGNATURE);   //firefox doesn't like layout-fixed in some cases
                if (t.f) {                  //in fixed mode
                    t.w = t.width();        //its new width is kept
                    for (i = 0; i < t.ln; i++) mw += t.c[i].w;
                    //cell rendering is not as trivial as it might seem, and it is slightly different for
                    //each browser. In the beginning i had a big switch for each browser, but since the code
                    //was extremely ugly now I use a different approach with several re-flows. This works
                    //pretty well but it's a bit slower. For now, lets keep things simple...
                    for (i = 0; i < t.ln; i++) t.c[i].css("width", M.round(1000 * t.c[i].w / mw) / 10 + "%").l = true;
                    //c.l locks the column, telling us that its c.w is outdated
                } else {     //in non fixed-sized tables
                    applyBounds(t);         //apply the new bounds
                    if (t.mode == 'flex' && t.p && S) {   //if postbackSafe is enabled and there is sessionStorage support,
                        memento(t);                     //the new layout is serialized and stored for 'flex' tables
                    }
                }
                syncGrips(t.addClass(SIGNATURE));
            }
        }
    };

    //bind resize event, to update grips position
    $(window).bind('resize.' + SIGNATURE, onResize);

	/**
	 * The plugin is added to the jQuery library
	 * @param {Object} options -  an object that holds some basic customization values
	 */
    $.fn.extend({
        colResizable: function (options) {
            var defaults = {
                //attributes:

                resizeMode: 'fit',                    //mode can be 'fit', 'flex' or 'overflow'
                draggingClass: 'JCLRgripDrag',	//css-class used when a grip is being dragged (for visual feedback purposes)
                gripInnerHtml: '',				//if it is required to use a custom grip it can be done using some custom HTML
                liveDrag: false,				//enables table-layout updating while dragging
                minWidth: 15, 					//minimum width value in pixels allowed for a column
                headerOnly: false,				//specifies that the size of the the column resizing anchors will be bounded to the size of the first row
                hoverCursor: "e-resize",  		//cursor to be used on grip hover
                dragCursor: "e-resize",  		//cursor to be used while dragging
                postbackSafe: false, 			//when it is enabled, table layout can persist after postback or page refresh. It requires browsers with sessionStorage support (it can be emulated with sessionStorage.js).
                flush: false, 					//when postbakSafe is enabled, and it is required to prevent layout restoration after postback, 'flush' will remove its associated layout data
                marginLeft: null,				//in case the table contains any margins, colResizable needs to know the values used, e.g. "10%", "15em", "5px" ...
                marginRight: null, 				//in case the table contains any margins, colResizable needs to know the values used, e.g. "10%", "15em", "5px" ...
                disable: false,					//disables all the enhancements performed in a previously colResized table
                partialRefresh: false,			//can be used in combination with postbackSafe when the table is inside of an updatePanel,
                disabledColumns: [],            //column indexes to be excluded

                //events:
                onDrag: null, 					//callback function to be fired during the column resizing process if liveDrag is enabled
                onResize: null					//callback function fired when the dragging process is over
            }
            var options = $.extend(defaults, options);

            //since now there are 3 different ways of resizing columns, I changed the external interface to make it clear
            //calling it 'resizeMode' but also to remove the "fixed" attribute which was confusing for many people
            options.fixed = true;
            options.overflow = false;
            switch (options.resizeMode) {
                case 'flex': options.fixed = false; break;
                case 'overflow': options.fixed = false; options.overflow = true; break;
            }

            return this.each(function () {
                init(this, options);
            });
        }
    });
})(jQuery);