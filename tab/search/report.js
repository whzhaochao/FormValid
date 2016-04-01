//报表相关的函数

/**
 * 报表功能函数。
 */
Report=function Report(){};

/**
 * 自动刷新报表.
 * @param interval 时间间隔，单位s。
 */
Report.autoRefresh=function(interval)
{
  setTimeout("Report.queryRep()",interval*1000);
}

//原背景色。
Report.preBgColor="";

/**
 * 鼠标移到对象时改变背景色.
 * @param obj 对象,如tr,td.
 */
Report.listMouseOver=function(obj)
{
  if(obj.sectionRowIndex==0)//see listMouseOut for reason
	  return;
  var origBgColor=obj.origBgColor;
  if(!origBgColor || origBgColor=="")//初始化
  {
    if(obj.style.backgroundColor!="")
      obj.origBgColor=obj.style.backgroundColor;
    else
      obj.origBgColor="none";//原来没有设背景色。
  }
  
  Report.preBgColor=obj.style.backgroundColor;
  obj.style.backgroundColor="#FFCC66";
}

/**
 * 鼠标移出对象时恢复颜色.
 * @param obj 对象，如tr,td.
 */
Report.listMouseOut=function(obj)
{
  if(obj.sectionRowIndex==0)//see below
	  return;
  obj.style.backgroundColor=Report.preBgColor;//在排序后，在第一行处有的浏览器会运行出错，关闭浏览器,但效率远高于下面。	
  //if(obj.className=="repList11")//这样的处理方式效率不高
	  //obj.className="repList1";
  //else
	  //obj.className="repList2";
}

/**
 * 处理链接.
 * @param linkURL 链接URL.
 * @param target 打开链接的target.
 * @param queryInfo 询问信息.
 */
Report.handleLink=function(linkURL,target,queryInfo)
{
  if(!target || target=="")
    target="_self";
  if(target.toLowerCase()=="_self" && AppUtil.isFormModified(document.repForm))
  {
    if(!confirm("数据已更改，继续则更改信息丢失，是否继续？"))
      return;
  }
  var origCallerPageURL="";
  if(target.toLowerCase()!="_self")
  {
    origCallerPageURL=document.linkForm.callerPageURL.value;
    document.linkForm.callerPageURL.value="";	
  }
  if(queryInfo!=null && queryInfo!="")
  {
    if(!confirm(queryInfo))
      return;
  }
  if(StrUtil.trim(linkURL.toLowerCase()).indexOf("javascript")==0)
    eval(linkURL);//must use eval(),for maybe containing "\'" or "\"" in linkURL
  else   
    AppUtil.doPostSubmit(document.linkForm,linkURL,target);
  if(target.toLowerCase()!="_self")
  {
	  document.linkForm.callerPageURL.value=origCallerPageURL;
  }
}

/**
 * 返回调用页.
 */
Report.handleBack=function()
{
  if(AppUtil.isFormModified(document.repForm))
  {
    if(!confirm("数据已更改，继续则更改信息丢失，是否继续？"))
      return;
  }
  AppUtil.doPostSubmit(document.backForm,document.repForm.backActURL.value);
}

/**
 * 显示/隐藏条件
 */
Report.showHideCnd=function()
{
  var obj=document.getElementById("showHideCnd");
  if(obj.innerHTML=="显示条件")
  {
    obj.innerHTML="隐藏条件";
    PubUtil.showHideElement("cndContainer",true);
  }
  else
  {
    obj.innerHTML="显示条件";
    PubUtil.showHideElement("cndContainer",false);
  }
}

/**
 * 显示/隐藏工具栏
 */
Report.showHideToolBand=function()
{
  var obj=document.getElementById("showHideToolBand");
  if(obj.innerHTML=="显示工具栏")
  {
    obj.innerHTML="隐藏工具栏";
    PubUtil.showHideElement("topToolBand",true);
  }
  else
  {
    obj.innerHTML="显示工具栏";
    PubUtil.showHideElement("topToolBand",false);
  }
}


/**
 * 跳转到指定报表结果页面.
 */
Report.toPage=function(pageNo)
{
  document.repForm.toPageNo.value=pageNo;
  Report.submitRepForm();
}

/**
 * 跳转到选定的报表结果页面.
 */
Report.toSelPage=function(isTopBar)
{
  var selObj=null;
  var inputObj=null;
  if(isTopBar)
  {
    selObj=document.repForm.selToPageNo;
    inputObj=document.repForm.inputToPageNo;
  }
  else
  {
    selObj=document.repForm.selToPageNo2;
    inputObj=document.repForm.inputToPageNo2;
  }
  var pageNo="1";
  if(selObj.style.display.toLowerCase()!="none")
	  pageNo=selObj.value;
  else
	  pageNo=inputObj.value;
  if(pageNo=='' || isNaN(pageNo))
  {
    alert("输入的页号非数字!");
    return;
  }
  document.repForm.toPageNo.value=pageNo;
  Report.submitRepForm();
}


/**
 * 批量删除处理。
 * @param linkURL 链接URL.
 * @param target 打开链接的target.
 * @param queryInfo 询问信息.
 */
Report.batchDelete=function(linkURL,target,queryInfo)
{  
  var checkName="col_delrow_no";
  var itemArr=document.repForm.elements;
  var rowNum=1;
  var checkedNum=0;
  for(var i=0;i<itemArr.length;i++)
  {
    if(itemArr[i].name==checkName && itemArr[i].type.toLowerCase()=="checkbox")
    {
      itemArr[i].value=rowNum++;
      if(itemArr[i].checked)
        checkedNum++;
    }
  }
  if(checkedNum==0)
  {
    alert("没有设定要删除的记录！");
    return;
  }
  Report.submitRepForm(linkURL,target,queryInfo);
}

/**
 * 设置行号，base 1,主要用于取所选行，因排序后，行序与原先不同，所以在作处理某动作(要根据行号取信息)前要先置行号。
 * @param rowNoElemName 行号元素名称。
 */
Report.setRowNo=function(rowNoElemName)
{
  var itemArr=document.repForm.elements;
  var rowNum=1;
  for(var i=0;i<itemArr.length;i++)
  {
    if(itemArr[i].name==rowNoElemName && itemArr[i].type.toLowerCase()=="checkbox")
    {
      itemArr[i].value=rowNum;
      rowNum++;
    }
  }
}

/**
 * 查询报表，供页面上"查询"按钮用.
 * @param onQueryEvent 查询事件。
 */
Report.queryRep=function(onQueryEvent)
{  
  if(onQueryEvent!=null && onQueryEvent.length>0)
  {
    if(eval(onQueryEvent)==false)
      return;
  }  
  if(document.repForm.isAgrNoCnd.value=="0")    
  {
    var checkName="selCndID";
    var itemArr=document.repForm.elements;
    var isValid=false;
    for(var i=0;i<itemArr.length;i++)
    {      
      if(itemArr[i].name==checkName)       
      {
      	if(itemArr[i].type.toLowerCase()!="checkbox")//必选条件情况
      	{
      	  isValid=true;
      	  break;
      	}      
        else if(itemArr[i].type.toLowerCase()=="checkbox" && itemArr[i].checked==true)
        {
      	  isValid=true;
      	  break;
      	}
      }
    }
    if(!isValid)
    {
      alert("该报表不允许忽略所有条件，请选择条件!");
      return;
    }
  }
  //验证
  var cndIDObjs=document.getElementsByName("selCndID");
  for(var i=0;i<cndIDObjs.length;i++)
  {
    if(!cndIDObjs[i].checked)
       continue;
    var cnds=document.getElementsByName("cnd_"+cndIDObjs[i].value);
    if(cnds.length>0 && cnds[0].value=="")
    {
      var nullable=cnds[0].getAttribute("cndnullable");
      if(nullable!=null && nullable=="0")
      {
        var cndDesc=cnds[0].getAttribute("itemdesc");
        if(cndDesc==null || cndDesc=="")
          cndDesc=cndID;
        alert("条件:"+cndDesc+"值不允许为空!");
        cnds[0].focus();
        return;
      }
    }
  }
  document.repForm.initQuery.value="1";
  Report.submitRepForm();  
}

/**
 * 提交报表表单，可设参数。
 * @param action repForm的action值。
 * @param target 打开链接target。
 * @param queryInfo 询问信息。
 * @param isWithCurPageURL 是否设置curPageURL参数。
 * @param onSubmitEvent 表单提交事件。
 * @param isChkModified 是否检查表单是否更改。
 */
Report.submitRepForm=function(action,target,queryInfo,isWithCurPageURL,onSubmitEvent,isChkModified)
{
  if(onSubmitEvent!=null && onSubmitEvent.length>0)
  {
    if(eval(onSubmitEvent)==false)
      return;
  }
  if(target==null || target=="")
    target="_self";
  if(isChkModified && AppUtil.isFormModified(document.repForm))
  {
    if(!confirm("数据已更改，继续则更改信息丢失，是否继续？"))
      return;
  }
  if(queryInfo!=null && queryInfo!="")
  {
    if(!confirm(queryInfo))
      return;
  }
  if(action==null || action=="")
    action=Constants.contextRoot+"/sysmng.report.do";
  else if(action.substring(0,1)!="/")
    action=Constants.contextRoot+"/"+action;
  document.repForm.action=action;
  document.repForm.target=target;
  if(isWithCurPageURL!=null&&isWithCurPageURL==true)
    document.repForm.curPageURL.value=document.linkForm.callerPageURL.value;
  document.repForm.submit();
}

/**
 * 提交批量更新操作。
 * @param action 处理批量更新的action,可以为空，取默认值。
 * @param onUpdateEvent 批量更新提交事件。
 */
Report.updRepForm=function(action,onUpdateEvent)
{
  if(!Validate.checkInputFull(document.repForm))
    return;
  if(!AppUtil.isFormModified(document.repForm,true))
  {
    alert("数据没有更改,不必保存!");
    return;
  }
  if(onUpdateEvent!=null && onUpdateEvent.length>0)
  {
    if(eval(onUpdteEvent)==false)
      return;
  }
  if(action==null || action.length==0)
    action=Constants.contextRoot+"/sysmng.batchUpd.do";
  else if(action.substring(0,1)!="/")
    action=Constants.contextRoot+"/"+action;
  document.repForm.target="_self";
  document.repForm.action=action;
  document.repForm.submit();
  return;
}

/**
 * 改变报表输出类型。
 * @param obj 值改变的select对象。
 */
Report.chgExportType=function(obj)
{
  var value=obj.value;
  var obj2=null;
  if(obj.name=="exportType")
    obj2=document.repForm.exportType2;
  else
    obj2=document.repForm.exportType;
  obj2.value=value;
}

/**
 * 处理报表导出。
 * @param exportType 导出类型。
 * @param exportTplID 如果导出类型是0，即模板导出，给定的模板标识。
 */
Report.exportRep=function(exportType,exportTplID)
{
  var isGetAll="0";
  var totalPage=document.repForm.totalPage.value;
  if(totalPage=="1")
    isGetAll="1";
  else if(!document.repForm.cbx_repExport || document.repForm.cbx_repExport.checked)
    isGetAll="1";
  document.repForm.isExportAll.value=isGetAll;
  if(exportType==null)
    exportType="1";//document.repForm.exportType.value;
  document.repForm.exportType.value=exportType;
  if(exportTplID!=null)
    document.repForm.exportTplID.value=exportTplID;
  document.repForm.action=Constants.contextRoot+"/sysmng.repExport.do";
  if(exportType=="3")//html
    document.repForm.target="_blank";
  else
    document.repForm.target="repExportor";//解决ie6低版本6.0.29下，拒绝访问的bug,否则用"_self"
  document.repForm.submit();
  return;
}


/**
 * 初始化汇总报表编辑。
 */
Report.initSrEdit=function()
{
  document.repForm.target="_self";
  document.repForm.action=Constants.contextRoot+"/sysmng.report.do";
  document.repForm.isSrEdit.value="1";
  document.repForm.submit();
}

/**
 * 汇总报表编辑。
 */
Report.srRstSave=function()
{
  document.repForm.target="_self";
  document.repForm.action=Constants.contextRoot+"/sysmng.srRstSave.do";
  document.repForm.submit();
}


/**
 * 处理报表结果校验。
 * @param checkID 校验ID。
 */
Report.checkRst=function(checkID)
{
  if(checkID==null || checkID=="")
    alert("报表校验时必须提供校验标识！");
  document.repForm.checkID.value=checkID;
  document.repForm.action=Constants.contextRoot+"/sysmng.repRstCheck.do";
  document.repForm.target="repExportor";//解决ie6低版本6.0.29下，拒绝访问的bug,否则用"_self"
  document.repForm.submit();
}



/**
 * 重置报表条件。
 */
Report.resetCnd=function()
{
  var checkName="selCndID";
  var itemArr=document.repForm.elements;  
  for(var i=0;i<itemArr.length;i++)
  {    
    if(itemArr[i].name==checkName && itemArr[i].type.toLowerCase()=="checkbox")
      itemArr[i].checked=itemArr[i].defaultChecked;
    else if(itemArr[i].name.indexOf("cnd_")>-1)
    {
      var type=itemArr[i].type.toLowerCase();
      switch(type)
      {
       	case "text":
        case "textarea":
        case "password":
        case "hidden":
        case "file":
      	  itemArr[i].value=itemArr[i].defaultValue;
      	  break;
      	case "select-one":
      	case "select-multiple":
      	  var optionArr=itemArr[i].options;
      	  var isSelected=false;
          for(var j=0;j<optionArr.length;j++)
          {
            optionArr[j].selected=optionArr[j].defaultSelected;
            if(optionArr[j].defaultSelected)
              isSelected=true;
          }
          if(!isSelected && optionArr.length>0 && type=="select-one")
            optionArr[0].selected=true;
	        break;
	      case "checkbox":
        case "radio":
          itemArr[i].checked=elemArr[i].defaultChecked;
      }      	
    }
  }
  
}

/**
 * 焦点移出对象时,用于弹出菜单判断。
 */
Report.myout=function(statID,layerID)
{
  PubUtil.findObj(statID).value="0";
  window.setTimeout("Report.mycheck('"+statID+"','"+layerID+"')",5);
}

/**
 * 焦点移入对象时,用于弹出菜单判断。
 */
Report.myin=function(statID)
{
  PubUtil.findObj(statID).value="1";
}


/**
 * 用于处理是否隐藏层。
 */
Report.mycheck=function(statID,layerID)
{
  if (PubUtil.findObj(statID).value=="0")
    PubUtil.showHideLayers(layerID,"","hide");
}


/**
 * 打印报表.
 * @param subSys 子系统标识.
 * @param repID 报表标识。
 */
Report.printRep=function(subSys,repID)
{  
  var container=document.getElementById("printContainer");
  if(container.getAttribute("src")=="")
  {    
    var src=Constants.contextRoot+"/charisma/syspub/report/printRep.jsp?subSys="+subSys+"&repID="+repID+"&opType=print";
    container.setAttribute("src",src);
  }
  else
  {
    //不能用container，并且不加document.否则在firefox及ns中会出错。
    printContainer.focus();
    //firefox中container.content.document.doPrint("print");
    //ie中document.printContainer.doPrint("print");
    printContainer.doPrint("print");
  }
}

/**
 * 打印预览。
 * @param subSys 子系统标识。
 * @param repID 报表标识。
 */
Report.previewRep=function(subSys,repID)
{  
  var location=Constants.contextRoot+"/charisma/syspub/report/printRep.jsp?subSys="+subSys+"&repID="+repID+"&opType=preview";
  var win=AppUtil.popWindow(location,'previewRep',630,540,"scrollbars=1");
}

/**
 * 报表设置。
 * @param subSys 子系统标识。
 * @param repID 报表标识。
 */
Report.reportSet=function(subSys,repID)
{
  var repListFmt=PubUtil.myEscape(document.repForm.repListFmt.value);
  var perRows=document.repForm.userPerRows.value;
  var prtZoom=document.repForm.prtZoom.value;
  var dispType=document.repForm.dispType.value;
  var location=Constants.contextRoot+"/charisma/syspub/report/reportSet.jsp?subSys="+subSys+"&repID="+repID+"&repListFmt="+repListFmt
	  +"&userPerRows="+perRows+"&prtZoom="+prtZoom+"&dispType="+dispType;
  var win=AppUtil.popWindow(location,'reportSet',450,400,"scrollbars=1");
}

/**
 * 弹出窗口设置报表条件字典量，采用用户指定的URL处理。
 * @param popDicURL 弹出字典URL。
 * @param imgObj 打开弹出窗口的图片元素。
 */
Report.cndPopSetDic=function(popDicURL,imgObj)
{
  AppUtil.popSetDic2(popDicURL,imgObj,"getRepCndElemValue");
}

/**
 * 处理报表条件中的字典条件元素值，规则是如果相应条件未选中，则相应值取空串。
 * @param index 字典对应的输入框在当前表单中对应的索引。
 * @param elemName 字典条件元素标签名称。
 * @return 元素值。
 */
Report.getCndElemValue=function(index,elemName)
{
  var elemValue=getDicCndElemValue(index,elemName);
  var index=elemName.indexOf("cnd_");
  if(index==-1)
	  return elemValue;
  var cndID=elemName.substr(4);
  var cbxElem=PubUtil.findObj("selCndID_"+cndID,document);
  if(!cbxElem || cbxElem.type.toLowerCase()!="checkbox")
	  return elemValue;
  if(!cbxElem.checked)
	  return ""
  else
    return elemValue;
}

/**
 * 触发选择字典量。
 */
Report.fireSetPopDic=function()
{
  if(top && top.footer)
  {
	  top.footer.setOnePopDic();
  }	
}

/**
 * 切换导出时是否全导出。
 * @param cbx checkbox控件。
 */
Report.switchExportAll=function(cbx)
{
  if(cbx.checked)
  {
    document.repForm.cbx_repExport.checked=true;
    document.repForm.cbx_repExport.checked=true;
  }
  else
  {
    document.repForm.cbx_repExport.checked=false;
    document.repForm.cbx_repExport2.checked=false;
  }
}

/**
 * 转换图表显示。
 * @param chartNo 图表序号。
 */
Report.switchChart=function(chartNo)
{
  if(AppUtil.isFormModified(document.repForm))
  {
    if(!confirm("数据已更改，继续则更改信息丢失，是否继续？"))
      return;
  }
  if(typeof document.repForm.chartNo == "undefined")
    return;
  document.repForm.chartNo.value=chartNo;
  document.repForm.submit();
}



/**
 * 点击标签页。
 * @param pageTagID 标签页对应的Tag标识。
 */
Report.clickTabPage=function(pageTagID)
{
  if(!TabUtil.clickTabPage(pageTagID))
    return;
  var pos=pageTagID.lastIndexOf("_");
  var prefix=pageTagID.substring(0,pos);
  var pageIndex=new Number(pageTagID.substring(pos+1));
  var pageObj=document.getElementById(prefix+"c_"+pageIndex);
  if(pageObj==null)
    return;
  if(pageObj.getAttribute("isShowRst")=="0")//pageObj.src在firefox中无效
  {
    pageObj.innerHTML="<p class=\"redNormal\">正在查询，请稍侯...</p>";
    var repURL=pageObj.getAttribute("subRepURL");
    var xHttp=new XHttp("sysmng.repRst.do");
    xHttp.method="POST";
    xHttp.reqData="isReLogon=0&repURL="+PubUtil.myEscape(repURL);
    xHttp.callback=function(xmlHttp)
    {
      var repRst=xmlHttp.responseText;
      var isSuccess=false;
      if(repRst.substring(0,8)=="<repRst>")
      {
        repRst=repRst.substring(8,repRst.length-9);
        pageObj.setAttribute("isShowRst","1");
        isSuccess=true;
      }
      else if(repRst.substring(0,7)=="<error>")
        repRst="<p class=\"redNormal\">"+repRst.substring(7,repRst.length-8)+"</p>";
      else
      {
        repRst="<p class=\"redNormal\">"+AppUtil.getErrInfo(repRst)+"</p>";
        if(repRst=="")
          repRst="<p class=\"redNormal\">查询时出错，请查看日志!</p>";
      }
      pageObj.innerHTML=repRst;
      if(isSuccess)
        SortableTable_init();//可能有列表，初始化排序
    }
    xHttp.send();    
  }
};
