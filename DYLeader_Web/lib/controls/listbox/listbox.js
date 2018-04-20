/// <reference path="../../jquery/jquery-1.7.2-vsdoc.js" />
/// <reference path="E:\WorkDoc\BtcSellOrder\BtcSellOrder\script/common.js" />

;
(function ($, window, document, undefined) {
    /*
     * cols sample:
     [
         {display: 'abcd', name: 'a'}
     ]
     */

    var BtcListbox = function (ele, opt) {
        this._$element = ele;
        this.defaults = {
            height: 360,
            width: 200,
            isShowDetail: true, //显示详细信息（显示返回的所有数据，在cols中有定义的）
            cols: null,         //列参数
            data: null,         //本地数据
            action: 'local',
            url: null,
            root: 'rows',
            parms: {},
            showName: 'name',
            idField: 'id',      //主键
            onloaded: null,     //数据加载完成后，要执行的方法
            onclick: null       //单击行事件
        };
        this._parms = {};
        this._localData = [];
        this._options = $.extend({}, this.defaults, opt);
    }

    BtcListbox.prototype = {
        _bindOnClickTr: function () {
            var thisObj = this;
            if (this._options.onclick != null) {
                $(this._$element)
                    .children('div')
                    .css('cursor', 'pointer')
                    .click(function () {
                        var id = $(this).children('[name="' + thisObj._options.idField + '"]').val();
                        thisObj._options.onclick(id);
                    });
            }
        },
        _deepCopy: function (o) {
            if (o instanceof Array) {
                var n = [];
                for (var i = 0; i < o.length; ++i) {
                    n[i] = this._deepCopy(o[i]);
                }
                return n;
            } else if (o instanceof Object) {
                var n = {}
                for (var i in o) {
                    n[i] = this._deepCopy(o[i]);
                }
                return n;
            } else {
                return o;
            }
        },
        _fillData: function (result, tableBodyHeight, isInit) {
            var thisObj = this,
                options = thisObj._options,
                data = result[options.root],
                template = {
                    text: '<div>{0}</div>',  //{0}为显示的文字，{1}由各个hidden组成，显示详细信息时使用
                    detailItem: '<div>{0}: {1}</div>',
                    detailDiv: '<div style="display:none;position:absolute;">{0}</div>'
                },
                $element = thisObj._$element,
                defaultCol = { display: '', name: '' };

            //添加div
            var listDivs = [];
            for (var j = 0; j < data.length; j++) {
                var divs = [],
                    item = data[j];
                $.each(options.cols, function (i, col) {
                    divs.push(template.detailItem.format(col.display, item[col.name]));
                });
                listDivs.push(template.text.format(item[options.showName]),
                    template.detailDiv.format(divs.join('')));
            }
            $element.empty().append(listDivs.join(''));
        },
        init: function (parms, isInit) {
            var thisObj = this,
                options = thisObj._options;
            thisObj._parms = $.extend(
                {},
                options.parms,
                parms);
            if (options.url == null || options.action == 'local') {
                thisObj._fillData(options.data[options.root], isInit);
                return;
            }
            $.ajax({
                type: 'post',
                url: options.url,
                data: thisObj._parms, //$.extend({}, { page: options.page, pagesize: options.pagesize, order: options.order }, parms),
                dataType: 'json',
                success: function (result) {
                    thisObj._fillData(result[options.root], isInit);
                }
            });
            if (options.onloaded != null) {
                options.onloaded();
            }
        },
        setParms: function (parms) {
            this.init(parms);
        }
    }

    $.fn.BtcListbox = function (options, parms) {
        var btcListbox = new BtcListbox(this, options);
        btcListbox.init(parms, true);
        return BtcListbox;
    }

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(window.jQuery, window, document);