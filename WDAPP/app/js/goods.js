//显示商品
function showSignalGood(singalGoodData){
	if(singalGoodData.length>0){
		var imgDatas=singalGoodData[0].goodsImg;
		var item1Str='';
		var imgArr=imgDatas.split(',')
		
		mui('.bigImg')[0].setAttribute('src','../administrator'+imgArr[0]);
		item1Str=document.createElement("li");
		for (var i=1;i<imgArr.length;i++) {
			item1Str.innerHTML+='<li class="smallGoodImgListItem"><img class="smallGoodImgListItemImg" src="../administrator/'+imgArr[i]+'" /></li>';
		}
		
		mui('.smallGoodImgList')[0].appendChild(item1Str);
		
		mui('.goodsName')[0].innerHTML=singalGoodData[0].goodsName;
		mui('#normalPrice')[0].innerHTML="&yen;"+singalGoodData[0].normalPrice;
		mui('#realPrice')[0].innerHTML="&yen;"+(singalGoodData[0].realPrice==null?singalGoodData[0].normalPrice:singalGoodData[0].realPrice);
		mui('.goodsDetails')[0].innerHTML=singalGoodData[0].goodsDetail;
	}
}

//显示商品评论
function showGoodComments(commentData){
	
	var li;
	if(commentData[0].commentId!=null){
		mui.each(commentData,function(index,item){
			li=document.createElement("li");
			li.innerHTML+='<span class="commentUsername">'+item.userName+'</span><span class="commentDate">'+item.commentTime+'</span><p class="commentContent">'+item.commentDesc+'</p></li>';
			li.className='commentLi';
			mui('.commentUL')[0].appendChild(li);
		});	
	}else{
		li=document.createElement("li");
		li.className='commentLi';
		li.innerHTML='<span style="text-align:center;">~~~暂无评论~~~</span>';
		mui('.commentUL')[0].appendChild(li);
	}
	
}

mui.plusReady(function(){
	
	//遮罩层
	var mask=mui.createMask();
	
	//获取商品数据
	var self=plus.webview.currentWebview();
	var signalGoodId;
	var sigalGoodsData;
	signalGoodId=self.goodsId;
	
	
	mui.ajax('http://192.168.43.145:6868/getGoodsCommnet',{
		data:{
			goodsId:signalGoodId
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(data){
			if(data.status=='1'){
				sigalGoodsData=data.datas;
				//console.log('sigalGoodsData'+JSON.stringify(sigalGoodsData[0]));
				//显示商品
				showSignalGood(data.datas);
				//显示商品评论
				showGoodComments(data.datas);
			}
		},
		error:function(xhr,type,errorThrown){
			mui.toast("服务器连接失败，请稍后再试");
		}
	});
	
	
	//切换商品大图的路径
	mui('.smallGoodImgList').on('tap','.smallGoodImgListItemImg',function(){
		var bigImg=mui('.bigImg')[0];
		bigImg.setAttribute('src',this.getAttribute('src'));	
	});
	//加入购物车
	document.getElementById('addToShopCart').addEventListener('tap',function () {
		var userObj={
			isLogin:false,
			userInfo:null
		};
		mui.ajax('http://192.168.43.145:6868/checkLogin',{
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			headers:{'Content-Type':'application/json'},	
			async:false,
			success:function(data){
				if(data.status=='1'){
					userObj.isLogin=true;
					userObj.userInfo=data.datas;	
				}else{
					userObj.isLogin=false;
					userObj.userInfo=null;
				}
			},
			error:function(xhr,type,errorThrown){//异常处理；
				mui.toast('服务器连接失败，情稍后再试.')
			}
		});	
		
		
		if(userObj.isLogin){
			//获取商品信息，存至数据库
			mui.ajax('http://192.168.43.145:6868/addToCart',{
				data:{
					userId:userObj.userInfo.userId,
					goodsId:signalGoodId,
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
						mui.toast('加入购物车成功');
					}else if(data.status=='4'){
						mui.toast("宝贝已经在购物车中等你了哟！");
					}
				},
				error:function(xhr,type,errorThrown){
					mui.toast("服务器连接超时，请稍后再试");
				}
			});
		}else{
			mui.toast('你还未登录!');
			mui.openWindow({
				url:'../index.html',
				id:'index.html',
				styles:{
					top:'0px',
					bottom:'0px',
					width:'100%',
					height:'100%'
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
		}
	});
	
	//立即购买	ok
	document.getElementById("buyNowBtn").addEventListener('tap',function(){
		var userObj={
			isLogin:false,
			userInfo:null
		};
		mui.ajax('http://192.168.43.145:6868/checkLogin',{
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			headers:{'Content-Type':'application/json'},	
			async:false,
			success:function(data){
				if(data.status=='1'){
					userObj.isLogin=true;
					userObj.userInfo=data.datas;	
				}else{
					userObj.isLogin=false;
					userObj.userInfo=null;
				}
			},
			error:function(xhr,type,errorThrown){//异常处理；
				mui.toast('服务器连接失败，情稍后再试.')
			}
		});	
		if(userObj.isLogin){
			var singalDataArr=[];
			singalDataArr.splice(0,singalDataArr.length);
			singalDataArr.push(sigalGoodsData[0]);
			//console.log('sigalGoodsData0000'+JSON.stringify(sigalGoodsData[0]));
			mui.openWindow({
		    	//取到当前商品信息，跳转到下订单页面
				url:"confirmOrder.html",
				id:'order',
				extras:{
					'userId':userObj.userInfo.userId,
					'goodsData':singalDataArr
				}
				
			});
		}else{
			mui.alert('你还未登录');
			mui.openWindow({
				url:'../index.html',
				id:'index.html',
				styles:{
					top:'0px',
					bottom:'0px',
					width:'100%',
					height:'100%'
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
		}
	},false);
	
	
});



	
	

