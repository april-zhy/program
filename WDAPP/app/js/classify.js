//创建节点显示商品类型
function showGoodsType(goodsTypeDatas){
	var goodsTypeList=mui('#goodsTypeList')[0];
	var li;
	if(goodsTypeDatas.length>0){
		mui.each(goodsTypeDatas,function(index,item){
			li=document.createElement('li');
			li.className='mui-table-view-cell mui-collapse';
			li.innerHTML+='<a class="mui-navigate-right goodsType" '+
			' " title="'+item.typeId+'"  href="#" >'+item.typeName+'</a>'
			goodsTypeList.appendChild(li);
		});
		
	}else{
		li=document.createElement('li');
		li.className='mui-table-view-cell mui-collapse';
		li.innerHTML='<a href="#" >'+'~~~暂无商品类型~~~'+'</a>'
		goodsTypeList.appendChild(li);
	}
}

//创建节点显示所有未过期的活动
function showGoodsAction(actionData){
	var goodsActionList=document.getElementById("goodsActionList");
	var li;
			
	if(actionData.length>0){
		mui.each(actionData,function(index,item){
			li=document.createElement('li');
			li.className='mui-table-view-cell';
			li.innerHTML+='<a class="mui-navigate-right action"  title="'+item.actionId+'"  href="#" >'+item.actionName+'</a>'
		goodsActionList.appendChild(li);
		});
		
	}else{
		li=document.createElement('li');
		li.className='mui-table-view-cell';
		li.innerHTML='<a href="#" >'+'~~~暂无商品活动~~~'+'</a>'
		goodsActionList.appendChild(li);
	}
}

//从服务器获取商品活动
function getGoodsAction(){
	mui.ajax('http://192.168.43.145:6868/getAllAction',{
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:5000,//超时时间设置为10秒；
		success:function(data){
			if(data.status=='1'){
				showGoodsAction(data.datas);
			}else{
				mui.toast("查询失败，请稍后再试");
			}
		},
		error:function(xhr,type,errorThrown){
			mui.toast("服务器连接超时，请稍后再试");
		}
	});
}
//从服务器获取商品类型并显示
function getGoodsType(){
	mui.ajax('http://192.168.43.145:6868/getAllGoodsType',{
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:5000,//超时时间设置为10秒；
		success:function(data){
			if(data.status=='1'){
				showGoodsType(data.datas);
			}else{
				mui.toast("查询失败，请稍后再试");
			}
		},
		error:function(xhr,type,errorThrown){
			mui.toast("服务器连接超时，请稍后再试");
		}
	});
}


mui.plusReady(function(){
	//遮罩层
	var mask=mui.createMask();
	//从服务器获取商品分类   并显示
	getGoodsType();
	//从服务器获取商品活动   并显示
	getGoodsAction();
	
	//商品类型点击事件，显示月份      OK
	mui('#goodsTypeList').on('tap','.goodsType',function(){
		var goodsTypeId=this.getAttribute('title');
		var thisParentNode=this.parentNode;
			
		//显示月份
		var currentMonth=new Date().getMonth();
		var monthesArr=[currentMonth-1,currentMonth,currentMonth+1];
		
		var ul;
		ul=document.createElement('ul');
			
		for(i=0;i<monthesArr.length;i++){
			ul.innerHTML+='<li class="mui-table-view-cell"><a class="date" title="'+monthesArr[i]+'"  href="#">'+monthesArr[i]+'月新品</a></li>';
		
		}
		ul.className='mui-table-view mui-table-view-chevron';
		
		
		if(thisParentNode.childNodes.length==1){
			thisParentNode.appendChild(ul);
		}		
	});	

	
	//跳转到商品详情页面
	
	//全部商品		OK	获取所有商品信息
	document.getElementById('getAllGoodsInfo').addEventListener('tap',function () {
	    mui.ajax('http://192.168.43.145:6868/getAllGoodsInfo',{
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:5000,//超时时间设置为10秒；
			beforeSend:function(){
				plus.nativeUI.showWaiting('加载中，请稍后...');
				mask.show();
			},
			complete:function(){
				plus.nativeUI.closeWaiting();
				mask.close();
			},
			success:function(data){
				
				if(data.status=='1'){
					mui.openWindow({
						url:'goodslist.html',
						id:'goodslist',
						styles:{
							top:'0px',
							bottom:'0px',
							width:'100%',
							height:'100%'
						},
						extras:{
							goodsInfo:data.datas
						},
						waiting: {
					        autoShow: true, //自动显示等待框，默认为true
					        title: '正在加载...请稍后', //对话框上显示的提示内容
					        options: {
					            width: '100%', //，默认根据内容自动计算合适宽度
					            height: '100%', //默认根据内容自动计算合适高度
					        }
					    }
					});
					
				}else{
					mui.toast("查询失败，请稍后再试");
				}
			},
			error:function(xhr,type,errorThrown){
				mui.toast("服务器连接超时，请稍后再试");	
			}
		});     
	});


	//分类查询
	//通过月份分类查询商品

	mui(".mui-content").on("tap",'.date',function(e){
		
		var monthes=this.getAttribute('title');
		var typeId=this.parentNode.parentNode.parentNode.firstChild.getAttribute('title');
		
		
		//当前月份
		var startTimeStr=new Date().getFullYear()+"-"+(monthes)+'-01';
		var endTimeStr=new Date().getFullYear()+"-"+(parseInt(monthes)+1)+'-01';
		
		
	
		mui.ajax('http://192.168.43.145:6868/getGoodsByTime',{
			data:{
				typeId:typeId,
				startTimeStr:startTimeStr,
				endTimeStr:endTimeStr	
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:5000,//超时时间设置为10秒；
			beforeSend:function(){
				plus.nativeUI.showWaiting('加载中，请稍后...');
				mask.show();
			},
			complete:function(){
				plus.nativeUI.closeWaiting();
				mask.close();
			},
			
			success:function(data){
				if(data.status=="1"){
					mui.openWindow({
						url:'goodslist.html',
						id:'goodslist',
						styles:{
							top:'0px',
							bottom:'0px',
							width:'100%',
							height:'100%'
						},
						extras:{
							goodsInfo:data.datas
						},
						waiting: {
					        autoShow: true, //自动显示等待框，默认为true
					        title: '正在加载...请稍后', //对话框上显示的提示内容
					        options: {
					            width: '100%', //，默认根据内容自动计算合适宽度
					            height: '100%', //默认根据内容自动计算合适高度
					        }
					    }
					});
				}else{
					mui.toast("查询失败，请稍后再试");
				}
			},
			error:function(xhr,type,errorThrown){
				mui.toast("服务器连接超时，请稍后再试");
			}
		});	
	});


	
	//参与活动的商品,   并且只显示参与该活动的商品
	mui('#goodsActionList').on('tap','.action',function(){
		var actionId=this.getAttribute('title');
		mui.ajax('http://192.168.43.145:6868/getGoodsByActionId',{
			data:{
				actionId:actionId
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:5000,//超时时间设置为10秒；
			beforeSend:function(){
				plus.nativeUI.showWaiting('加载中，请稍后...');
				mask.show();
			},
			complete:function(){
				plus.nativeUI.closeWaiting();
				mask.close();
			},
			
			success:function(data){
				if(data.status=='1'){
					mui.openWindow({
						url:'goodslist.html',
						id:'goodslist',
						styles:{
							top:'0px',
							bottom:'0px',
							width:'100%',
							height:'100%'
						},
						extras:{
							goodsInfo:data.datas
						},
						waiting: {
					        autoShow: true, //自动显示等待框，默认为true
					        title: '正在加载...请稍后', //对话框上显示的提示内容
					        options: {
					            width: '100%', //，默认根据内容自动计算合适宽度
					            height: '100%', //默认根据内容自动计算合适高度
					        }
					    }
					});
					
				}else{
					mui.toast("查询失败，请稍后再试");
				}
			},
			error:function(xhr,type,errorThrown){
				mui.toast("服务器连接超时，请稍后再试");	
			}
		});	
	});

});
