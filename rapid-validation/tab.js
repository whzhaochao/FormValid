// 取标签名相同的父对象
function GetParentElement(obj, tag) {
    while (obj != null && obj.tagName != tag)
        obj = obj.parentNode;
    return obj;
}

function changeColor(evt) {
    evt = evt ? evt : window.event;
    var el = evt.target ? evt.target : evt.srcElement;
    var tabElement = null;
    while (true) {
        el = GetParentElement(el, "TR")
        if (el) {
            tabElement = GetParentElement(el, "TABLE");
            if (tabElement != null && tabElement.className.toUpperCase() == "LIST") {
                break;
            }
            el = tabElement;
        } else {
            return;
        }
    }
    for (var i = 0; i < el.children.length; i++) {
        if (el.children[i].tagName == "TD") {
            el.children[i].style.backgroundColor = "#eeeeee";
        }
    }
}

function revertColor(evt) {
    evt = evt ? evt : window.event;
    var el = evt.target ? evt.target : evt.srcElement;
    var tabElement = null;
    while (true) {
        el = GetParentElement(el, "TR")
        if (el) {
            tabElement = GetParentElement(el, "TABLE");
            if (tabElement != null && tabElement.className.toUpperCase() == "LIST") {
                break;
            }
            el = tabElement;
        } else {
            return;
        }
    }
    for (var i = 0; i < el.children.length; i++) {
        if (el.children[i].tagName == "TD") {
            el.children[i].style.backgroundColor = "";
        }
    }
}
document.onmouseover = changeColor;
document.onmouseout = revertColor;


function selectAll(sobj) {
    var objs = document.getElementsByTagName("input");
    for (var i = 0; i < objs.length; i++) {
        if (objs[i].type.toLowerCase() == "checkbox" && (objs[i].getAttribute("id") == "dataList" || objs[i].getAttribute("id") == "dataList0" || objs[i].getAttribute("id") == "allcheckbox")) {
            if (sobj == "0") {
                objs[i].checked = document.getElementById("allcheckbox").checked;
            } else {
                objs[i].checked = document.getElementById("dataList0").checked;
            }
        }
    }
}


function doDelete(delactionurl) {
    var allbox = document.getElementsByName("ckId");
    var delIds = "";//sava delids
    for (i = 0; i < allbox.length; i++) {
        if (allbox[i].checked) {
            delIds = delIds + allbox[i].value + ","
        }
    }
    if ("" == delIds) {
        alert('请选择要删除的数据项！');
    }
    else {
        delIds = delIds.substr(0, delIds.length - 1)
        if (confirm("您确定删除此记录吗？")) {
            toExecute(delactionurl + "&delIds=" + delIds);
            //document.getElementById("deleteById").href=delactionurl+"&delIds="+delIds;
        }
    }
}

function doHuanyuan(delactionurl) {
    var allbox = document.getElementsByName("ckId");
    var delIds = "";//sava delids
    for (i = 0; i < allbox.length; i++) {
        if (allbox[i].checked) {
            delIds = delIds + allbox[i].value + ","
        }
    }
    if ("" == delIds) {
        alert('请选择要还原的楼盘！');
    }
    else {
        delIds = delIds.substr(0, delIds.length - 1)
        if (confirm("您确定还原此楼盘吗？")) {
            toExecute(delactionurl + "&delIds=" + delIds);
            //document.getElementById("deleteById").href=delactionurl+"&delIds="+delIds;
        }
    }
}
function doHuanZHK(delactionurl) {
    var allbox = document.getElementsByName("ckId");
    var delIds = "";//sava delids
    for (i = 0; i < allbox.length; i++) {
        if (allbox[i].checked) {
            delIds = delIds + allbox[i].value + ","
        }
    }
    if ("" == delIds) {
        alert('请选择要还原的住杭卡！');
    }
    else {
        delIds = delIds.substr(0, delIds.length - 1)
        if (confirm("您确定还原这些住杭卡吗？")) {
            toExecute(delactionurl + "&delIds=" + delIds);
            //document.getElementById("deleteById").href=delactionurl+"&delIds="+delIds;
        }
    }
}
function doDeleteb(delactionurl) {
    var allbox = document.getElementsByName("ckId");
    var delIds = "";//sava delids
    var build_id = "";//sava build_id
    for (var i = 0; i < allbox.length; i++) {
        if (allbox[i].checked) {
            var temp = allbox[i].value.split(",");
            delIds = delIds + temp[0] + ",";
            build_id = build_id + temp[1] + ",";
        }
    }
    if ("" == delIds) {
        alert('请选择要删除的数据项！');
    }
    else {
        delIds = delIds.substr(0, delIds.length - 1);
        build_id = build_id.substr(0, build_id.length - 1);
        if (confirm("您确定删除此记录吗？")) {
            toExecute(delactionurl + "&delIds=" + delIds + "&build_id=" + build_id);
            //document.getElementById("deleteById").href=delactionurl+"&delIds="+delIds;
        }
    }
}

function doDeletec(delactionurl) {
    var allbox = document.getElementsByName("ckId");
    var delIds = "";//sava delids
    var comment_id = "";//sava comment_id
    for (var i = 0; i < allbox.length; i++) {
        if (allbox[i].checked) {
            var temp = allbox[i].value.split(",");
            delIds = delIds + temp[0] + ",";
            comment_id = comment_id + temp[1] + ",";
        }
    }
    if ("" == delIds) {
        alert('请选择要删除的数据项！');
    }
    else {
        delIds = delIds.substr(0, delIds.length - 1);
        comment_id = comment_id.substr(0, comment_id.length - 1);
        if (confirm("您确定删除此记录吗？")) {
            toExecute(delactionurl + "&delIds=" + delIds + "&comment_id=" + comment_id);
            //document.getElementById("deleteById").href=delactionurl+"&delIds="+delIds;
        }
    }
}
function doDeleteN(delactionurl) {
    var allbox = document.getElementsByName("ckId");
    var delIds = "";//sava delids
    var build_id = "";//sava comment_id
    for (var i = 0; i < allbox.length; i++) {
        if (allbox[i].checked) {
            var temp = allbox[i].value.split(",");
            delIds = delIds + temp[0] + ",";
            build_id = build_id + temp[1] + ",";
        }
    }
    if ("" == delIds) {
        alert('请选择要删除的数据项！');
    }
    else {
        delIds = delIds.substr(0, delIds.length - 1);
        build_id = build_id.substr(0, build_id.length - 1);
        if (confirm("您确定删除此记录吗？")) {
            toExecute(delactionurl + "&delIds=" + delIds + "&ask_id=" + build_id);
            //document.getElementById("deleteById").href=delactionurl+"&delIds="+delIds;
        }
    }
}
function doDeleteById(delactionurl) {
    if (confirm("您确定删除此记录吗？")) {
        return true;
    } else {
        return false;
    }
}


function hiddenSearch() {
    var v = document.getElementById("searchDIV").style;
    v.display = v.display == 'none' ? '' : 'none';

    var v2 = document.getElementById("showModel2");
    var temp = document.all ? "className" : "class";
    v2.setAttribute(temp, v2.getAttribute(temp) == "showModel" ? "showModel2" : "showModel");

}

function hiddenUpload() {
    var v = document.getElementById("uploadDIV").style;
    v.display = v.display == 'none' ? '' : 'none';

    var v2 = document.getElementById("showModel");
    var temp = document.all ? "className" : "class";
    v2.setAttribute(temp, v2.getAttribute(temp) == "showModel" ? "showModel2" : "showModel");

}

//全选/反选
function selectCheck(argId) {
    // 所有的checkbox标签
    var objs = document.getElementsByTagName("input");
    // 查出每个标签
    for (var i = 0; i < objs.length; i++) {
        // 当权限菜单和下级菜单对应时
        if (objs[i].getAttribute("id") == ("submenu" + argId)) {
            objs[i].checked = document.getElementById("submenu" + argId).checked;
            objs[i].checked = document.getElementById("menu" + argId).checked;
        }
    }
}
//全选/反选
function selectCheck1() {
    // 所有的checkbox标签
    var objs = document.getElementsByTagName("input");
    var a = 0;
    // 查出每个标签
    for (var i = 0; i < objs.length; i++) {
        if (objs[i].checked) {
            a++;
        }
    }
    if (a == 0) {

        alert("请选择图片类型");
        return false;
    }
    return null;
}
// 单个事件
function chooseOne(argId) {
    // 所有的checkbox标签
    var objs = document.getElementsByTagName("input");
    // 变量
    var bol = false;
    for (var i = 0; i < objs.length; i++) {
        if (objs[i].getAttribute("id") == ("submenu" + argId)) {
            if (objs[i].checked == true) {
                bol = true;
            }
        }
    }
    if (bol) {
        document.getElementById("menu" + argId).checked = true;
    } else {
        document.getElementById("menu" + argId).checked = false;
    }
}