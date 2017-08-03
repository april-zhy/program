//用来判断是否登录
var isLogin;
//用来判断是否显示遮罩层
var isCover;
$(function(){
    isLogin=false;
    //获得所有商品类型  OK
    $.get("getAllGoodsType",function(data){
        if(data.err){
            if(data.err=="0"){
                att("数据库链接失败");   
            }else {
                att("获取数据失败..");
            }
        }else {
            $.each(data,function(index,item){
                $("#typeName").append( $("<option value='"+item.typeId+"'>"+item.typeName+"</option>") )
            });
        }
    });

    //显示商品活动
    $.get("/getAllAction",function(data){
       // console.log(data)
        var str2;
        if(data=="0" || data=="2"){
            att("查询失败");
        }else if(data.length=="0"){
            str2='<option value="undefined" selected="selected"> 暂无活动</option>'
            $("#actionType").append(str2);
        }else{
            $.each(data,function(index,item){
                if(index=="0"){
                    str2+='<option value="'+item.actionId+'" selected="selected">'+item.actionName+'</option>'
                }else {
                    str2+='<option value="'+item.actionId+'">'+item.actionName+'</option>'
                }
            });
            $("#actionType").append(str2);
        }
    });
    //检测登录   OK   
    $.get("/checkAdminLogin",function(data){
       if(data!="0"){
           isLogin=true;
           var uname=data.adminName;
           var str='亲爱的 ['+uname+'] 管理员欢迎您<a href="javascript:adLogout()" class="LogReg" id="adLogout">退出</a>'
           $("#logReg").html(str);
       } else {
       
           var str='<a href="javascript:showReg()" class="LogReg">注册</a><span>/</span><a href="javascript:showLogin()" class="LogReg">登录</a>'
           $("#logReg").html(str);
       }
    });
});
//发送添加商品类型请求 OK    
function addGoodsType(){
    var goodsTypeName=$("#goodsTypeName").val();
    if(isLogin){
        $.post("/addGoodsType",{goodsTypeName:goodsTypeName},function(data){
            if(data=="1"){
                att("添加商品类型成功");
                $("#goodsTypeName").val("");
            }else {
                att("添加失败");
            }
        });
    }else {
        att("你还未登录",0.5);
        isCover=true;
        setTimeout(function () {
            showLogin();
            showCover();
        },500);

    }
}

//提示框
function att(str,times) {
    (times==undefined ||"")? times=3:times=times;
    $('#attDiv').show(0.5).find("p").html(str);
    $('#attDiv').click(function (){
        $('#attDiv').hide(0.5);
    });
    setTimeout(function () {
        $('#attDiv').hide(0.5);
    },times*1000);
}
function showCover(){
	if(isCover){
		$('#coverDiv').show(0.5);
	}else{
		$('#coverDiv').hide(0.5);
	}
	
}



//显示商品类型   OK
function showGoodsType() {
    var status=$("#goodsTypeTab").css("display");
    if(status=="none"){
        $("#goodsTypeTab").show(0.5);
        $('#showGoodsType').html('关闭商品类型');
    }else {
        $("#goodsTypeTab").hide(0.5);
        $('#showGoodsType').html('显示商品类型');
    }

    $.get("/getAllGoodsType",function(data){
        if(data.err){
            if(data.err=="0"){
                att("数据库链接失败");
            }else {
                att("获取数据失败..");
            }
        }else {//data是从服务器获取的数据
            if(data.length==0){//没有数据，则长度为0
                $("#goodsTypeTbody").html('<tr><td colspan="2">暂无商品类型</td></tr>');
            }else {
            	//显示之前，将之前显示的清空
                $("#goodsTypeTbody").html("");
                //遍历数据				index为索引   item为单个数据
                $.each(data,function(index,item){
                    var str="<tr><td>"+item.typeName+"</td><td><a href='javascript:void (0)' onclick='delGoodsType(this)'  lang='"+item.typeId+"' >删除</a></td></tr>";
                    
                    //将添加的追加到表格中
                    $("#goodsTypeTbody").append( str );

                });
            }
        }
    });
}
//删除商品类型   OK
function delGoodsType(obj) {
    var length=$("#goodsTypeTbody").find("tr").length;
    var typeId=$(obj).attr("lang");
    if(isLogin){
        if(length>1){
            $(obj).parent().parent().remove();
            $.post("/delGoodsType",{typeId:typeId},function (data) {
                if(data=="1"){
                    att("操作成功");
                }else {
                    att("操作失败");
                }
            });
        }else if(length==1){
            $(obj).parent().parent().remove();
            $("#goodsTypeTab").hide(0.5);
            $.post("/delGoodsType",{typeId:typeId},function (data) {
                if(data=="1"){
                    att("操作成功");
                }else {
                    att("操作失败");
                }
            });
        }
    }else {
        att("你还未登录",0.5);
        isCover=true;
        setTimeout(function () {
            showLogin();
            showCover();
        },500);
    }
}


//添加商品活动   OK
function addAction(){
    var actionName=$("#actionName").val();
    var actionPre=$("#actionPre").val();
    var actionAgion=$("#actionAgion").val();
    var year1=$("#dateFormStart select[name=year] option:selected").val();
    var month1=$("#dateFormStart select[name=month] option:selected").val();
    var day1=$("#dateFormStart select[name=day] option:selected").val();
    var startTime=year1+"-"+month1+"-"+day1;//开始时间
    var year2=$("#dateFormEnd select[name=year] option:selected").val();
    var month2=$("#dateFormEnd select[name=month] option:selected").val();
    var day2=$("#dateFormEnd select[name=day] option:selected").val();
    var endTime=year2+"-"+month2+"-"+day2;//结束时间
    var obj={
        actionName:actionName,
        actionPre:actionPre,//活动优先级
        actionAgion:actionAgion,//折扣
        startTime:startTime,
        endTime:endTime
    };
    if(isLogin){
    	$.post("/addAction",obj,function(data){
	        if(data=="1"){
	            att("添加商品活动成功");
	            actionName=$("#actionName").val("");
	            actionPre=$("#actionPre").val("");
	            actionAgion=$("#actionAgion").val("");
	        }else {
	            att("添加失败");
	        }
	    });
    }else{
    	att("你还未登录",0.5);
        isCover=true;
        setTimeout(function () {
            showLogin();
            showCover();
        },500);
    }
}

//显示商品活动  OK
function showAction(){
    var display=$("#showActionType").css("display");
    if(display=="block"){
        $("#showActionType").hide();
        $("#showAction").html('显示商品类型');
    }else {
        $("#showActionType").show();
        $("#showAction").html('关闭商品类型');
        $.get("/getAllAction",function(data){
            console.log(data)
            if(data=="0" || data=="2"){
                att("查询失败");
            }else if(data.length=="0"){
                $("#actionTbody").html("");
                str="<tr><td colspan='5'>暂无活动</td></tr>"
                $("#actionTbody").append(str);
            }else {
                var str='';
                $("#actionTbody").html("");
                $.each(data,function(index,item){
                    str+='<tr><td>'+item.startTime+'</td><td>'+item.endTime+'</td><td>'+item.actionName+'</td><td>'+item.actionAgion+'</td><td>'+item.actionPre+'</td> </tr>'
                });
                $("#actionTbody").append(str);
            }
        });
    }


}



//发送添加商品请求  OK
function addGoods(){
    var goodsName= $("#goodsName").val();
    var normalPrice=$("#normalPrice").val();
    var typeId= $.trim($("#typeName").val() );
    if(isLogin){
    	//发异步请求到服务器
	    $.ajaxFileUpload({
	        url: "/addGoods",
	        secureurl: false,//ssl用于http协议
	        fileElementId: "goodsPic",//取得文件的ID号
	        data: {typeId:typeId,goodsName: goodsName, normalPrice: normalPrice},
	        dataType: "json",
	        success: function (data, status) {
	            if (data == "1") {//添加成功之后，将数据清空
	                att("商品信息添加成功...");
	                goodsName= $("#goodsName").val("");
	                normalPrice=$("#normalPrice").val("");
                    $("#showpic").html('');
	            } else {
	                att("商品信息添加失败...");
	            }
	            console.log("data: ",data)
	        },
	        error: function (data, status, e) {
	            att("添加商品失败，原因 ： ",e);
	            console.log("添加商品失败，原因 ：",e);
	        }
	    });
    }else{
    	att("你还未登录",0.5);
        setTimeout(function () {
            showLogin();
        },500)
    }
}

//显示商品信息  OK
function showGoodsInfo(){
    var display=$("#showAllGoodsInfo").css("display");
    if(display=="block"){
        $("#showAllGoodsInfo").hide();
        $('#showGoodsBtn').html('显示商品信息');
    }else {
        $("#showAllGoodsInfo").show();
        $('#showGoodsBtn').html('关闭商品信息');
        $("#showGoodsTbody").html("");
        $.post("/getAllGoodsInfo",function(data){
        	console.log("查询所有商品数据： ",data);
            if(data=="0"){
                att("查询失败");
            }else if(data=="2"){
                att("数据库连接失败，请稍后再试");
            }else if(data.length=='0'){
            	//att("暂无商品信息，请稍后再试");
            	str='<tr><td style="font: bolder;" colspan="10">暂无商品信息</td></tr>';
            	$("#showGoodsTbody").append(str);
            }else{
                var str=""; var typeName="";var sale="";
                $.each(data,function(index,item){
                	switch (item.typeId){
                		case 1:
                			typeName='格调中式';
                			break;
                		case 2:
                			typeName='奢华欧式';
                			break;
                		default:
                			typeName='唯美韩式';
                			break;
                	}
                    sale=item.goodsFlag=="1"?"上架":"下架";
                    realPrice=item.realPrice==null?"暂未参加活动":"&yen;"+item.realPrice;
                    var imgStr=Object.toString(item.goodsImg);
                    imgArr=item.goodsImg.split(",");
                    str="<tr><td><input type='checkbox' lang='"+item.goodsId+"' checked='checked'></td><td>"+item.goodsId+"</td><td>"+item.goodsName+"</td><td>"+
                        item.goodsDetail+ "</td><td> &yen;"+item.normalPrice+"</td><td>"+
                        realPrice+"</td><td>"+typeName + "</td><td><img src='"+
                        imgArr[0] +"' /></td><td><a href='javascript:void (0)' onclick='onSale(this)' >["+sale+"]</a></td><td><a href='javascript:void (0)' onclick='onDelete (this)' class='delete' >删除</a></td></tr></tr>";
                    $("#showGoodsTbody").append(str);
                });
            }
        });
    }
}


//上下架操作   OK
function onSale(obj){
    var goodsId= $.trim( $(obj).parent().parent().find("td").eq(1).text() );
    var value= $.trim( $(obj).parent().parent().find("td").eq(-2).text() );
    if(isLogin){
    	$.post("/onSale",{goodsId:goodsId,value:value},function(data){
	      if(data=="1"){
	          if(value=="[上架]"){
	              $(obj).parent().parent().find("td").eq(-2).text("").replaceWith('<td><a href="javascript:void (0)" ' +
	                  'onclick="onSale(this)" >[下架]</a></td>');
	          }else {
	              $(obj).parent().parent().find("td").eq(-2).text("").replaceWith('<td><a href="javascript:void (0)" ' +
	                  'onclick="onSale(this)" >[上架]</a></td>');
	          }
	       } else {
	           att("操作失败..");
	       }
	    });
    }else{
    	att("你还未登录",0.5);
        setTimeout(function () {
            showLogin();
        },500);
    }
}

//删除商品
function onDelete(obj) {
    var goodsId= $.trim( $(obj).parent().parent().find("td").eq(1).text() );
    if(isLogin){
    	$(obj).parent().parent().find("td").remove();
	    $.post("/onDelete",{goodsId:goodsId},function(data){
	        if(data=="1"){
	            $(obj).parent().parent().find("td").remove();
	        } else {
	            att("操作失败..");
	        }
	    });
    }else{
    	att("你还未登录",0.5);
        isCover=true;
        setTimeout(function () {
            showLogin();
            showCover();
        },500);
    }
}


//添加参与活动的商品  OK
function addActionInfo(){
    var actionID=$("#actionType option:selected").val();
    //商品ID
    var goodsId=[];var goodId;
    var input=$("#showGoodsTbody").find("input");

    for(var i=0;i<input.length;i++) {
        if (input[i].checked) {
            goodId= $(input[i]).attr("lang");
        }
        if (goodId != undefined && goodsId.indexOf(goodId)==-1 ) {
            goodsId.push(goodId);
        }
    }
    var obj={
        actionID:actionID,
        goodsId:JSON.stringify(goodsId)
    }

    if(isLogin){
    	$.post("/addActionInfo",obj,function(data){
	        if(data=="1"){
	            att("添加成功");
	        }else if(data=="3"){
	            att("你所选择商品都参与活动啦..");
	        }else{
	            att("添加失败");
	        }
	    });

    }else{
    	att("你还未登录",0.5);
        isCover=true;
        setTimeout(function () {
            showLogin();
            showCover();
        },500);
    }
}









//关闭注册层 OK
function closeReg(){
    $("#regDiv").hide(0.5);
    isCover=false;
    showCover();
}
//显示注册层  OK
function showReg(times){
    $("#regDiv").show(times);
    $("#loginDiv").hide(0.5);
    isCover=true;
    showCover();
}
//关闭登录层  OK
function closeLogin(){
    $("#loginDiv").hide(0.5);
    $('#coverDiv').hide(0.5);
}
//显示登录层 OK
function showLogin(){
    $("#loginDiv").show();
    $("#regDiv").hide(0.5);
    isCover=true;
    showCover();
}

//管理员注册   OK
$("#adRegister").click(function(){
    var adRegName=$("#adRegName").val();
    var adRegPwd=$("#adRegPwd").val();
    //console.log(":开始注册");
    $.post("/adminReg",{adRegName:adRegName,adRegPwd:adRegPwd},function(data){
        if(data=="1"){
            att("注册成功,请登录");
            closeReg();
            showLogin();
        }else {
            att("注册失败");
        }
    });
});
//登录   OK
$("#adminLogin").click(function(){
    var adLoginName=$("#adLoginName").val();
    var adLoginPwd=$("#adLoginPwd").val();
    $.post("/adminLogin",{adLoginName:adLoginName,adLoginPwd:adLoginPwd},function(data){
        //console.log(data)
        if(data=="1"){
            att("登录成功",0.5);
            isLogin=true;
            $('#coverDiv').hide(0.5);
            closeLogin();
            var str='亲爱的 ['+adLoginName+'] 管理员欢迎您<a href="javascript:adLogout()" id="adLogout">退出</a>'
            $("#logReg").html(str);
            
        }else {
            //console.log(data)
            att("登录失败",0.5);

        }
    });
});
//退出   OK
function adLogout(){
    $.post("/adLogout",function(data){
        if(data=="1"){
            att("退出成功..");
            isLogin=false;
            var str='<a href="javascript:showReg()">注册</a><span>/</span><a href="javascript:showLogin()">登录</a>'
            $("#logReg").html(str);
        }else {
            var str='亲爱的 ['+uname+'] 管理员欢迎您<a href="javascript:adLogout()">退出</a>'
            $("#logReg").html(str);
        }
    });
}
//显示登录
$("#showLogin").on('click',function(){
	isCover=true;
	showCover();
	showLogin();
});
//显示注册
$("#showReg").on('click',function(){
	isCover=true;
	showCover();
	showReg();
});

YMD(dateFormStart);
YMD(dateFormEnd);






