function killerrors() {
    return true;
}
//window.onerror = killerrors;

parent.document.title = document.title;
// 隐藏消息
function hideFilterdata() {
    document.getElementById("noFilterdata").style.display = "none";
}
//ENTERキーを押下時、TABキーの動きを割り当てる
document.onkeydown = function () {

    //ボタンとサブミットボタン以外のエレメントを対象とする
    //テキストエリアの場合、ENTERキーを処理しない

    if (!(event.srcElement.type == "button" || event.srcElement.type == "submit" || event.srcElement.type == "textarea")) {

        if (!(event.srcElement.type == "button" || event.srcElement.type == "submit" || event.srcElement.type == "textarea" )) {

            //13:enter,9:tab
            if (event.keyCode == 13) {
                event.keyCode = 13;
            }
        }
    }

}
window.status = '';
var cal;
var isFocus = false; //是否为焦点
//自加
var objdate

var objdate1

//选择日期
function SelectDate(obj, strFormat) {
    //自加
    objdate = obj;

    var date = new Date();
    var by = date.getFullYear() - 50;  //最小值 → 50 年前
    var ey = date.getFullYear() + 50;  //最大值 → 50 年后
    cal = (cal == null) ? new Calendar(by, ey, 0) : cal;    //初始化英文版，0 为中文版
    cal.dateFormatStyle = strFormat;
    cal.show(obj);
}
/**//**//**/
/**
 * 返回日期
 * @param d the delimiter
 * @param p the pattern of your date
 * 根据用户指定的 style 来确定；
 */
//String.prototype.toDate = function(x, p) {
String.prototype.toDate = function (style) {
    var y = this.substring(style.indexOf('y'), style.lastIndexOf('y') + 1);//年
    var m = this.substring(style.indexOf('M'), style.lastIndexOf('M') + 1);//月
    var d = this.substring(style.indexOf('d'), style.lastIndexOf('d') + 1);//日
    if (isNaN(y)) y = new Date().getFullYear();
    if (isNaN(m)) m = new Date().getMonth();
    if (isNaN(d)) d = new Date().getDate();
    var dt;
    eval("dt = new Date('" + y + "', '" + (m - 1) + "','" + d + "')");
    return dt;
}

/**//**//**/
/**
 * 格式化日期
 * @param   d the delimiter
 * @param   p the pattern of your date
 * @author  meizz
 */
Date.prototype.format = function (style) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),      //day
        "h+": this.getHours(),     //hour
        "m+": this.getMinutes(),   //minute
        "s+": this.getSeconds(),   //second
        "w+": "天一二三四五六".charAt(this.getDay()),   //week
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(style)) {
        style = style.replace(RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(style)) {
            style = style.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return style;
};

/**//**//**/
/**
 * 日历类
 * @param   beginYear 1990
 * @param   endYear   2010
 * @param   lang      0(中文)|1(英语) 可自由扩充
 * @param   dateFormatStyle  "yyyy-MM-dd";
 * @version 2006-04-01
 * @author  KimSoft (jinqinghua [at] gmail.com)
 * @update
 */
function Calendar(beginYear, endYear, lang, dateFormatStyle) {
    this.beginYear = 1990;
    this.endYear = 2010;
    this.lang = 0;            //0(中文) | 1(英文)
    this.dateFormatStyle = "yyyy-MM-dd hh：mm：ss";

    if (beginYear != null && endYear != null) {
        this.beginYear = beginYear;
        this.endYear = endYear;
    }
    if (lang != null) {
        this.lang = lang
    }

    if (dateFormatStyle != null) {
        this.dateFormatStyle = dateFormatStyle
    }

    this.dateControl = null;
    this.panel = this.getElementById("calendarPanel");
    this.container = this.getElementById("ContainerPanel");
    this.form = null;

    this.date = new Date();
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth();


    this.colors = {
        "cur_word": "red",  //当日日期文字颜色
        "cur_bg": "#FFFFFF",  //当日日期单元格背影色
        "sel_bg": "#FFCCCC",  //已被选择的日期单元格背影色 2006-12-03 寒羽枫添加
        "sun_word": "#FF0000",  //星期天文字颜色
        "sat_word": "#0000FF",  //星期六文字颜色
        "td_word_light": "#333333",  //单元格文字颜色
        "td_word_dark": "#CCCCCC",  //单元格文字暗色
        "td_bg_out": "#EFEFEF",  //单元格背影色
        "td_bg_over": "#FFCC00",  //单元格背影色
        "tr_word": "#FFFFFF",  //日历头文字颜色
        "tr_bg": "#666666",  //日历头背影色
        "input_border": "#CCCCCC",  //input控件的边框颜色
        "input_bg": "#EFEFEF"   //input控件的背影色
    }

    this.draw();
    this.bindYear();
    this.bindMonth();
    this.changeSelect();
    this.bindData();
}

/**//**//**/
/**
 * 日历类属性（语言包，可自由扩展）
 */
Calendar.language = {
    "year": [[""], [""]],
    "months": [["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    ],
    "weeks": [["日", "一", "二", "三", "四", "五", "六"],
        ["SUN", "MON", "TUR", "WED", "THU", "FRI", "SAT"]
    ],
    "clear": [["清空"], ["CLS"]],
    "today": [["今天"], ["TODAY"]],
    "close": [["关闭"], ["CLOSE"]]
}

Calendar.prototype.draw = function () {
    calendar = this;

    var mvAry = [];
    mvAry[mvAry.length] = '  <div name="calendarForm" style="margin: 0px;">';
    mvAry[mvAry.length] = '    <table width="100%" border="0" cellpadding="0" cellspacing="1">';
    mvAry[mvAry.length] = '      <tr>';
    mvAry[mvAry.length] = '        <th align="left" width="1%"><input style="border: 1px solid ' + calendar.colors["input_border"] + ';background-color:' + calendar.colors["input_bg"] + ';width:16px;height:20px;" name="prevMonth" type="button" id="prevMonth" value="&lt;" /></th>';
    mvAry[mvAry.length] = '        <th align="center" width="98%" nowrap="nowrap"><select name="calendarYear" id="calendarYear" style="font-size:12px;"></select><select name="calendarMonth" id="calendarMonth" style="font-size:12px;"></select></th>';
    mvAry[mvAry.length] = '        <th align="right" width="1%"><input style="border: 1px solid ' + calendar.colors["input_border"] + ';background-color:' + calendar.colors["input_bg"] + ';width:16px;height:20px;" name="nextMonth" type="button" id="nextMonth" value="&gt;" /></th>';
    mvAry[mvAry.length] = '      </tr>';
    mvAry[mvAry.length] = '    </table>';
    mvAry[mvAry.length] = '    <table id="calendarTable" width="100%" style="border:0px solid #CCCCCC;background-color:#FFFFFF;font-size:9pt" border="0" cellpadding="2" cellspacing="1">';
    mvAry[mvAry.length] = '      <tr>';
    for (var i = 0; i < 7; i++) {
        mvAry[mvAry.length] = '      <th style="font-weight:normal;background-color:' + calendar.colors["tr_bg"] + ';color:' + calendar.colors["tr_word"] + ';">' + Calendar.language["weeks"][this.lang][i] + '</th>';
    }
    mvAry[mvAry.length] = '      </tr>';
    for (var i = 0; i < 6; i++) {
        mvAry[mvAry.length] = '    <tr align="center">';
        for (var j = 0; j < 7; j++) {
            if (j == 0) {
                mvAry[mvAry.length] = '  <td style="cursor:default;color:' + calendar.colors["sun_word"] + ';"></td>';
            } else if (j == 6) {
                mvAry[mvAry.length] = '  <td style="cursor:default;color:' + calendar.colors["sat_word"] + ';"></td>';
            } else {
                mvAry[mvAry.length] = '  <td style="cursor:default;"></td>';
            }
        }
        mvAry[mvAry.length] = '    </tr>';
    }
    mvAry[mvAry.length] = '      <tr style="background-color:' + calendar.colors["input_bg"] + ';">';
    mvAry[mvAry.length] = '        <th colspan="2"><input name="calendarClear" type="button" id="calendarClear" value="' + Calendar.language["clear"][this.lang] + '" style="border: 1px solid ' + calendar.colors["input_border"] + ';background-color:' + calendar.colors["input_bg"] + ';width:100%;height:18px;font-size:9pt;"/></th>';
    mvAry[mvAry.length] = '        <th colspan="3"><input name="calendarToday" type="button" id="calendarToday" value="' + Calendar.language["today"][this.lang] + '" style="border: 1px solid ' + calendar.colors["input_border"] + ';background-color:' + calendar.colors["input_bg"] + ';width:100%;height:18px;font-size:9pt;"/></th>';
    mvAry[mvAry.length] = '        <th colspan="2"><input name="calendarClose" type="button" id="calendarClose" value="' + Calendar.language["close"][this.lang] + '" style="border: 1px solid ' + calendar.colors["input_border"] + ';background-color:' + calendar.colors["input_bg"] + ';width:100%;height:18px;font-size:9pt;"/></th>';
    mvAry[mvAry.length] = '      </tr>';
    mvAry[mvAry.length] = '    </table>';
    mvAry[mvAry.length] = '  </div>';
    this.panel.innerHTML = mvAry.join("");

    /**/
    /******** 以下代码由寒羽枫 2006-12-01 添加 **********/
    var obj = this.getElementById("prevMonth");
    obj.onclick = function () {
        calendar.goPrevMonth(calendar);
    }
    obj.onblur = function () {
        calendar.onblur();
    }
    this.prevMonth = obj;

    obj = this.getElementById("nextMonth");
    obj.onclick = function () {
        calendar.goNextMonth(calendar);
    }
    obj.onblur = function () {
        calendar.onblur();
    }
    this.nextMonth = obj;


    obj = this.getElementById("calendarClear");
    obj.onclick = function () {
        calendar.dateControl.value = "";
        calendar.hide();
    }
    this.calendarClear = obj;

    obj = this.getElementById("calendarClose");
    obj.onclick = function () {
        calendar.hide();
    }
    this.calendarClose = obj;

    obj = this.getElementById("calendarYear");
    obj.onchange = function () {
        calendar.update(calendar);
    }
    obj.onblur = function () {
        calendar.onblur();
    }
    this.calendarYear = obj;

    obj = this.getElementById("calendarMonth");
    with (obj) {
        onchange = function () {
            calendar.update(calendar);
        }
        onblur = function () {
            calendar.onblur();
        }
    }
    this.calendarMonth = obj;

    obj = this.getElementById("calendarToday");
    obj.onclick = function () {
        var today = new Date();
        calendar.date = today;
        calendar.year = today.getFullYear();
        calendar.month = today.getMonth();
        calendar.changeSelect();
        calendar.bindData();
        calendar.dateControl.value = today.format(calendar.dateFormatStyle);
        calendar.hide();
    }
    this.calendarToday = obj;
}

//年份下拉框绑定数据
Calendar.prototype.bindYear = function () {
    var cy = this.calendarYear;
    cy.length = 0;
    for (var i = this.beginYear; i <= this.endYear; i++) {
        cy.options[cy.length] = new Option(i + Calendar.language["year"][this.lang], i);
    }
}

//月份下拉框绑定数据
Calendar.prototype.bindMonth = function () {
    var cm = this.calendarMonth;
    cm.length = 0;
    for (var i = 0; i < 12; i++) {
        cm.options[cm.length] = new Option(Calendar.language["months"][this.lang][i], i);
    }
}

//向前一月
Calendar.prototype.goPrevMonth = function (e) {
    if (this.year == this.beginYear && this.month == 0) {
        return;
    }
    this.month--;
    if (this.month == -1) {
        this.year--;
        this.month = 11;
    }
    this.date = new Date(this.year, this.month, 1);
    this.changeSelect();
    this.bindData();
}

//向后一月
Calendar.prototype.goNextMonth = function (e) {
    if (this.year == this.endYear && this.month == 11) {
        return;
    }
    this.month++;
    if (this.month == 12) {
        this.year++;
        this.month = 0;
    }
    this.date = new Date(this.year, this.month, 1);
    this.changeSelect();
    this.bindData();
}

//改变SELECT选中状态
Calendar.prototype.changeSelect = function () {
    var cy = this.calendarYear;
    var cm = this.calendarMonth;
    for (var i = 0; i < cy.length; i++) {
        if (cy.options[i].value == this.date.getFullYear()) {
            cy[i].selected = true;
            break;
        }
    }
    for (var i = 0; i < cm.length; i++) {
        if (cm.options[i].value == this.date.getMonth()) {
            cm[i].selected = true;
            break;
        }
    }
}

//更新年、月
Calendar.prototype.update = function (e) {
    this.year = e.calendarYear.options[e.calendarYear.selectedIndex].value;
    this.month = e.calendarMonth.options[e.calendarMonth.selectedIndex].value;
    this.date = new Date(this.year, this.month, 1);
    this.changeSelect();
    this.bindData();
}

//绑定数据到月视图
Calendar.prototype.bindData = function () {
    var calendar = this;
    var dateArray = this.getMonthViewArray(this.date.getFullYear(), this.date.getMonth());
    var tds = this.getElementById("calendarTable").getElementsByTagName("td");
    for (var i = 0; i < tds.length; i++) {
        //tds[i].style.color = calendar.colors["td_word_light"];
        tds[i].style.backgroundColor = calendar.colors["td_bg_out"];
        tds[i].onclick = function () {
            return;
        }
        tds[i].onmouseover = function () {
            return;
        }
        tds[i].onmouseout = function () {
            return;
        }
        if (i > dateArray.length - 1) break;
        tds[i].innerHTML = dateArray[i];
        if (dateArray[i] != "&nbsp;") {
            tds[i].onclick = function () {
                if (calendar.dateControl != null) {
                    calendar.dateControl.value = new Date(calendar.date.getFullYear(),
                        calendar.date.getMonth(),
                        this.innerHTML).format(calendar.dateFormatStyle);
                }
                calendar.hide();
            }
            tds[i].onmouseover = function () {
                this.style.backgroundColor = calendar.colors["td_bg_over"];
            }
            tds[i].onmouseout = function () {
                this.style.backgroundColor = calendar.colors["td_bg_out"];
            }
            if (new Date().format(calendar.dateFormatStyle) ==
                new Date(calendar.date.getFullYear(),
                    calendar.date.getMonth(),
                    dateArray[i]).format(calendar.dateFormatStyle)) {
                //tds[i].style.color = calendar.colors["cur_word"];
                tds[i].style.backgroundColor = calendar.colors["cur_bg"];
                tds[i].onmouseover = function () {
                    this.style.backgroundColor = calendar.colors["td_bg_over"];
                }
                tds[i].onmouseout = function () {
                    this.style.backgroundColor = calendar.colors["cur_bg"];
                }
                //continue; //若不想当天单元格的背景被下面的覆盖，请取消注释
            }

            if (calendar.dateControl != null && calendar.dateControl.value == new Date(calendar.date.getFullYear(),
                    calendar.date.getMonth(),
                    dateArray[i]).format(calendar.dateFormatStyle)) {
                tds[i].style.backgroundColor = calendar.colors["sel_bg"];
                tds[i].onmouseover = function () {
                    this.style.backgroundColor = calendar.colors["td_bg_over"];
                }
                tds[i].onmouseout = function () {
                    this.style.backgroundColor = calendar.colors["sel_bg"];
                }
            }
        }
    }
}

//根据年、月得到月视图数据(数组形式)
Calendar.prototype.getMonthViewArray = function (y, m) {
    var mvArray = [];
    var dayOfFirstDay = new Date(y, m, 1).getDay();
    var daysOfMonth = new Date(y, m + 1, 0).getDate();
    for (var i = 0; i < 42; i++) {
        mvArray[i] = "&nbsp;";
    }
    for (var i = 0; i < daysOfMonth; i++) {
        mvArray[i + dayOfFirstDay] = i + 1;
    }
    return mvArray;
    /*
     var dateArray = new Array(42);
     var dayOfFirstDate = new Date(y, m, 1).getDay();
     var dateCountOfMonth = new Date(y, m + 1, 0).getDate();
     for (var i = 0; i < dateCountOfMonth; i++) {
     dateArray[i + dayOfFirstDate] = i + 1;
     }
     return dateArray;
     */
}

//扩展 document.getElementById(id) 多浏览器兼容性 from meizz tree source
Calendar.prototype.getElementById = function (id) {
    if (typeof(id) != "string" || id == "") return null;
    if (document.getElementById) return document.getElementById(id);
    if (document.all) return document.all(id);
    try {
        return eval(id);
    } catch (e) {
        return null;
    }
}

//扩展 object.getElementsByTagName(tagName)
Calendar.prototype.getElementsByTagName = function (object, tagName) {
    if (document.getElementsByTagName) return document.getElementsByTagName(tagName);
    if (document.all) return document.all.tags(tagName);
}

//取得HTML控件绝对位置
Calendar.prototype.getAbsPoint = function (e) {
    var x = e.offsetLeft;
    var y = e.offsetTop;
    while (e = e.offsetParent) {
        x += e.offsetLeft;
        y += e.offsetTop;
    }
    return {"x": x, "y": y};
}

//显示日历
Calendar.prototype.show = function (dateObj, popControl) {
    if (dateObj == null) {
        throw new Error("arguments[0] is necessary")
    }
    this.dateControl = dateObj;

    this.date = (dateObj.value.length > 0) ? new Date(dateObj.value.toDate(this.dateFormatStyle)) : new Date();
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth();
    this.changeSelect();
    this.bindData();

    if (popControl == null) {
        popControl = dateObj;
    }
    var xy = this.getAbsPoint(popControl);
    this.panel.style.left = xy.x + "px";
    this.panel.style.top = (xy.y + dateObj.offsetHeight) + "px";

    this.panel.style.display = "";
    this.container.style.display = "";

    dateObj.onblur = function () {
        calendar.onblur();
    }
    this.container.onmouseover = function () {
        isFocus = true;
    }
    this.container.onmouseout = function () {
        isFocus = false;
    }
}
//隐藏日历
Calendar.prototype.hide = function () {
    this.panel.style.display = "none";
    this.container.style.display = "none";
    isFocus = false;

    //***2007-01-25*******
    //*-自定义验控件是否为空--*/
//  try
// {
    CheckDate(objdate);
//  }
//  catch(err)
//  {
//  }
}
function CheckDate(obj)	//日期
{
    //var t = document.getElementById('txtPeriod').value;
    var t = obj.value;
    var v = null;
    var tt = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
    var dv = obj.id;
    dv = "dv_" + dv;
    var dvDate = document.getElementById(dv);

    if (dvDate == null) {
        return;
    }
    if (t != "") {
        if (t.search(tt) != -1) {

            dvDate.style.display = 'none';
            v = 0;
        }
        else {
            dvDate.style.display = 'block';
            v = 1;
        }
        if (DateCompare(obj.value, datenow) == true) {
            v = 0;
        }
        else {
            dvDate.style.display = 'block';
            dvDate.innerHTML = "  <font color=red>&nbsp;&nbsp;您的截止日期必须大于今天</font>";
            v = 1
        }

    }
    else {
        dvDate.style.display = 'block';
        v = 1;
    }
    return v;
}

//焦点转移时隐藏日历
Calendar.prototype.onblur = function () {
    if (!isFocus) {
        this.hide();
    }
}
document.write('<div id="ContainerPanel" style="display:none"><div id="calendarPanel" style="_top:expression(eval(document.documentElement.scrollTop)+38);position:absolute;_position:absolute;display: none;z-index: 9999;');
document.write('background-color: #FFFFFF;border: 1px solid #CCCCCC;width:175px;font-size:9px;"></div>');
if (document.all) {
    document.write('<iframe style="position:absolute;z-index:2000;width:expression(this.previousSibling.offsetWidth);');
    document.write('height:expression(this.previousSibling.offsetHeight);');
    document.write('left:expression(this.previousSibling.offsetLeft);top:expression(this.previousSibling.offsetTop);');
    document.write('display:expression(this.previousSibling.style.display);" scrolling="no" frameborder="no"></iframe>');
}
document.write('</div>');


function GetOuterHTML(element) {
    return document.createElement("DIV").appendChild(element.cloneNode(true)).parentNode.innerHTML;
}
/**
 * 共通JS处理
 * 作成者：杭州成楼网络科技有限公司
 * 作成日：2009/08/17
 * 版本号1.0.0 初次作成
 */

function addNode(actionNm, key, value) {

    if (actionNm.substring(actionNm.length - 1, actionNm.length) != "?") {
        actionNm = actionNm + "&";
    }
    actionNm = actionNm + key + "=";
    actionNm = actionNm + value;

    return actionNm;
}

/**
 * 追加？号处理
 */
function addQuestion(str) {

    if (hasQuestion(str)) {
        return str;
    }
    return str + "?";
}

/**
 * 判断有没有？号
 */
function hasQuestion(str) {

    if (str.search(/\?/) == -1) {
        return false;
    }
    return true;
}

/**
 * 共通重置处理
 */
function commonReset() {
    objForm = document.forms[0];
    objForm.reset();
}
/**
 * 機能説明：共通戻る処理
 * 引数    ：アクション名
 * 戻り値　：なし
 * 備考    ：なし
 */
function commonBack(actionNm) {
    objForm = document.forms[0];
    //アクションURLの設定
    objForm.action = actionNm;
    objForm.method = "post";
    //サブミットする
    objForm.submit();
}
function isNull(str) {

    if (str == null || str == "" || str == " ") {
        return true;
    }

    return false;
}
/**
 *    内容页返回按钮
 * 返回值　：NULL
 * 備考    ：当前列表第几页，就返回第几页。
 */
function backx(argUrl) {
    //
    var actionNm = argUrl + "?param=back"
    // 共通处理
    commonBack(actionNm);
}
function backx1(argUrl, args) {
    // 具体地址
    var actionNm = argUrl + "?param=back&" + args
    // 共通处理
    commonBack(actionNm);
}
function backx2(argUrl, args) {
    // 共通处理
    commonBack(argUrl);
}

/**
 * POP框处理
 */
function commonPickup(url, info, features) {
    var sFeatures = "dialogWidth=840px;dialogHeight=680px;resizable=no;scroll=no;status=no;center=yes;help=no;scroll=yes";
    var aInfo = new Array(1);
    if (features != null) {
        sFeatures = features;
    }
    if (info != null) {
        aInfo = info;
    }
    var returnValue = window.showModalDialog(url + "&random=" + Math.random(), window, sFeatures);
    return returnValue;
}

function commonPickupOpen(url) {
    var sFeatures = "top=100,left=200,width=950,height=680,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no ";

    var myWindow = window.open(url + "&random=" + Math.random(), "_blank", sFeatures);
    myWindow.focus();
}

function openSpecfiyWindown(url, data, name) {
    var tempForm = document.createElement("form");
    tempForm.id = "tempForm1";
    tempForm.method = "post";
    tempForm.action = url;
    tempForm.target = name;
    var hideInput = document.createElement("input");
    hideInput.type = "hidden";
    hideInput.name = "content"
    hideInput.value = data;
    tempForm.appendChild(hideInput);
    try {
        tempForm.attachEvent("onsubmit", function () {
            openWindow(name);
        });
    } catch (e) {
        tempForm.addEventListener("onsubmit", openWindow(name), false);
    }
    document.body.appendChild(tempForm);
    try {
        tempForm.fireEvent("onsubmit");
    } catch (e) {
    }
    ;
    tempForm.submit();
    document.body.removeChild(tempForm);
}

function openWindow(name) {
    var sFeatures = "top=100,left=200,width=950,height=680,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no ";
    window.open('about:blank', name, sFeatures);
}
function setWinOpenValue(val) {

    var name = "";
    try {
        name = po("name").value;
    } catch (e) {
        name = po("comm_name").value;
    }
    document.title = name + val;
    var str = name + val;
    try {
        oo("searchDIV1").innerHTML = str;
    } catch (e) {
    }
    oo("tname").innerHTML = str;
    try {
        oo("comm_name").value = name;
    } catch (e) {
    }
    var lid = "";
    try {
        lid = po("lid").value;
    } catch (e) {
        try {
            lid = po("comm_id").value;
        } catch (e) {
        }
    }
    try {
        oo("comm_id").value = lid;
    } catch (e) {
    }
}
function comPickup(url, info, features) {
    var sFeatures = "dialogWidth=680px;dialogHeight=300px;resizable=no;scroll=no;status=no;center=yes;help=no;scroll=yes;";
    var aInfo = new Array(1);
    if (features != null) {
        sFeatures = features;
    }
    if (info != null) {
        aInfo = info;
    }
    //object.name = document.getElementById("communtity").value;
    var returnValue = window.showModelessDialog(url, aInfo, sFeatures);
    return returnValue;
}

/**
 * 共通JS新规方法
 * actionNm  提交的url
 */
function commonInsert(actionNm) {

    objForm = document.forms[0];
    //目标URL设置
    objForm.action = actionNm;
    objForm.method = "post";

    //表单递交
    objForm.submit();
}

/**
 *    共通JS更新,删除方法
 * 返回值　：NULL
 * 備考    ：。
 */
function toExecute(argUrl) {
    objForm = document.forms[0];
    //目标URL设置
    objForm.action = argUrl;
    objForm.method = "post";
    //alert(argUrl)
    //表单递交
    objForm.submit();
}
function toExecute1(argUrl) {
    objForm = document.forms[1];
    //目标URL设置
    objForm.action = argUrl;
    objForm.method = "post";
    //alert(argUrl)
    //表单递交
    objForm.submit();
}
/**
 *    共通排序
 * 返回值　：NULL
 * 備考    ：。
 */
function commonSort(argUrl, argType, argFields) {
    var objForm = document.forms[0];
    objForm.action = argUrl;
    objForm.method = "post";
    objForm.cnd_sort_fields.value = argFields;
    objForm.cnd_sort_type.value = argType;
    objForm.submit();
}
/**
 *    重置搜搜条件
 * 返回值　：NULL
 * 備考    ：。
 */
function resetCon() {

    if (document.forms[0].cnd_search_type != null) {
        document.forms[0].cnd_search_type.value = "";

    }
    if (document.forms[0].cnd_search_type1 != null) {
        document.forms[0].cnd_search_type1.value = "";

    }
    if (document.forms[0].cnd_search_type2 != null) {
        document.forms[0].cnd_search_type2.value = "";
    }
    if (document.forms[0].cnd_search_type3 != null) {
        document.forms[0].cnd_search_type3.value = "";
    }
    if (document.forms[0].cnd_search_type5 != null) {
        document.forms[0].cnd_search_type5.value = "";
    }
    if (document.forms[0].cnd_sort_fields != null) {
        document.forms[0].cnd_sort_fields.value = "";
    }
    if (document.forms[0].cnd_sort_type != null) {
        document.forms[0].cnd_sort_type.value = "";
    }
    if (document.forms[0].cnd_search_name != null) {
        document.forms[0].cnd_search_name.value = "";
    }
    if (document.forms[0].aid != null) {
        document.forms[0].aid.value = "";
    }
    if (document.forms[0].communtity != null) {
        document.forms[0].communtity.value = "";
    }
}
/**
 * 下拉框初期化
 * argControl 控件名
 */
function selectInit(argControl) {
    var objSelect = document.getElementById(argControl);
    // 初期化
    objSelect.options.length = 0;
    // 默认值
    var varItem = new Option("--请选择--", " ");
    objSelect.options.add(varItem);

}

/**
 *    执行搜索
 * 返回值　：NULL
 * 備考    ：。
 */
function subForm(argUrl) {
    if (event.keyCode == 13) {
        var objForm = document.forms[0];
        objForm.action = argUrl;
        objForm.method = "post";
        objForm.submit();
    }
}

/**
 *    执行搜索
 * 返回值　：NULL
 * 備考    ：。
 */
function queryCon(argUrl) {
    var objForm = document.forms[0];
    objForm.action = argUrl;
    objForm.method = "post";
    objForm.submit();
}

/**
 * 共通JS更新方法
 * actionNm  提交的url
 */
function commonUpdate(actionNm) {

    objForm = document.forms[0];
    //确认消息
    if (confirm(CMQ0001) == true) {
        //目标URL设置
        objForm.action = actionNm;
        objForm.method = "post";

        //表单递交
        objForm.submit();
    }
}

/**
 * 共通JS删除方法
 * actionNm  提交的url
 */
function commonDelete(actionNm) {

    objForm = document.forms[0];
    //目标URL设置
    objForm.action = actionNm;
    objForm.method = "post";

    //确认消息
    if (confirm(CMQ0002) == true) {

        //表单递交
        objForm.submit();
    }
}

/**
 * 共通JS查询方法
 * actionNm  提交的url
 */
function commonSelect(argActionNm) {

    objForm = document.forms[0];
    //objForm.intCurrentPage.value = 0;
    //objForm.pagerMethod.value = "";
    //objForm.hidSearchName.value = oo("searchName").value;
    //目标URL设置
    objForm.action = argActionNm;
    objForm.method = "post";

    //表单递交
    objForm.submit();
}


var oForm = new Object();
var oImage = new Image();
oImage.attachEvent('onload', getSize);
oImage.attachEvent('onerror', doWithError);


function checkImage(obj, argName) {
    oForm = obj;
    oImage.src = oo(argName).value;
}
function getSize() {
    var oImgSize = Math.floor(oImage.fileSize / 1024);
    document.body.appendChild(oImage);
    if (oImgSize < 200) {
        //if(window.confirm('您确定上传此图片吗？')){
        // oForm.submit();
        //}else{
        // oForm.reset();
        //return;
        //  }
    } else {
        window.alert('不允许上传大于200KB的图片！');
        oForm.reset();
    }
    var oIEVersion = window.navigator.appVersion;
    if (oIEVersion.indexOf('MSIE 6.0') != -1) {
        oImage.removeNode(true);
    }
}
function doWithError() {
    window.alert('出现错误，请重新选择图片！');
    oForm.reset();
}

function checktext(text) {
    allValid = true;
    for (i = 0; i < text.length; i++) {
        if (text.charAt(i) != " ") {
            allValid = false;
            break;
        }
    }
    return allValid;
}
function gbcount(message, total, used, remain) {
    var max;
    max = total.value;
    if (message.value.length > max) {
        message.value = message.value.substring(0, max);
        used.value = max;
        remain.value = 0;
        alert("短信内容不能超过" + total.value + "个字!");
    }
    else {
        used.value = message.value.length;
        remain.value = max - used.value;
        if (used.value > 64) {
            oo("msgid").innerHTML = "<font color=red>当前信息内容需要分为两条发送，请尽量用一条信息进行描述！！！</font>";

        } else {
            oo("msgid").innerHTML = "";
        }
    }
}
// 获取对象
function oo(objId) {
    return document.getElementById(objId);
}
// 获取对象
function po(objId) {
    return window.opener.document.getElementById(objId);
}
// 图片找不到时处理
function imgError(argObj, argImg) {
    try {
        // 默认图片设置
        argObj.src = argImg;
    } catch (e) {
    }
}
// 整数或小数
function IsFloat(val) {
    var s = document.getElementById(val);
    if (s.value != '' && (isNaN(s.value) || s.value < -1)) {
        return false;
    }
    return true;
}

function openwin(url) {
    var a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("target", "_blank");
    a.setAttribute("id", "openwin");
    document.body.appendChild(a);
    a.click();
}
function send(url, base, workUrl) {
    try {
        var biaoji1 = document.getElementById("cnd_search_type1").value;
        var aid1 = document.getElementById("aid").value;
    }
    catch (ex) {
    }
    $.ajax({
        type: "post",
        contentType: "application/x-www-form-urlencoded",
        url: base + '/building.zzhz?param=createCSV',
        success: function (str) {
            oo('time').value = str;
            var frm = '<iframe id="bulkfrm" frameborder="0" style="width:100%; height:580px;_margin-top:20px;" allowtransparency="true" src="" name=""/>'

            BulkDlg = new Dialog({
                'content': frm,
                modal: true,
                width: 600,
                height: 550,
                center: true,
                drag: true,
                title: 'aa',
                id: 'editor-link'
            });
            BulkDlg.show();
            try {
                document.getElementById('bulkfrm').src = base + '/building.zzhz?param=toShow&time=' + str;
            }
            catch (ex) {
            }
            $.ajax({
                type: "post",
                contentType: "application/x-www-form-urlencoded",
                url: url,
                data: {time: str, biaoji: encodeURIComponent(biaoji1), aid: aid1},
                success: function (str) {
                    if (str == 1) {
                        cls(base, workUrl, biaoji1);
                    }
                }
            });
        }
    });
}
function send1(url, base) {
    try {
        var biaoji1 = document.getElementById("cnd_search_type1").value;
        var aid1 = document.getElementById("aid").value;
    }
    catch (ex) {
    }
    $.ajax({
        type: "post",
        contentType: "application/x-www-form-urlencoded",
        url: base + '/building.zzhz?param=createCSV',
        success: function (str) {
            oo('time').value = str;
            var frm = '<iframe id="bulkfrm" frameborder="0" style="width:100%; height:580px;_margin-top:20px;" allowtransparency="true" src="" name=""/>'
            BulkDlg = new Dialog({
                'content': frm,
                modal: true,
                width: 600,
                height: 550,
                center: true,
                drag: true,
                title: 'aa',
                id: 'editor-link'
            });
            BulkDlg.show();
            try {
                document.getElementById('bulkfrm').src = base + '/building.zzhz?param=toShow&time=' + str;
            }
            catch (ex) {
            }
            toExecute(url + '&time=' + str);
        }
    });
}
// 采集完成
function cls(base, workUrl, biaoji1) {
    try {
        var time = oo('time').value;
    }
    catch (ex) {
    }
    $.ajax({
        type: "post",
        contentType: "application/x-www-form-urlencoded",
        url: base + '/building.zzhz?param=delMessage',
        data: {time: time}
    });
    try {
        if (biaoji1 == "" || typeof biaoji1 == 'undefined')
            parent.close();
    } catch (ex) {
    }
    if (workUrl != '')
        toExecute(base + '/' + workUrl);
    BulkDlg.close();

}
