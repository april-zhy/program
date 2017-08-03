
mui.init();
//显示确认订单页面
//显示用户信息
function showConfirmOrderUser(userInfoData){
	if(userInfoData.length>0){
		var div=document.createElement("div");
		div.className='userInfo';
		mui.each(userInfoData,function(index,item){
			div.innerHTML='<p>收货人：<span>'+item.addName+'</span></p>'+
		'<p>电话：<span>'+item.addTel+'</span></p>'+
		'<p>收货地址：<span>'+item.addAddress+item.addStreet+'</span></p>';
		});
		
		mui('#userInfo')[0].appendChild(div);
	}else{
		var div=document.createElement("div");
		div.className='userInfo';
		div.innerHTML='<a class="goToAddAddress" id="goToAddAddress">您还没有添加地址信息哦! 去添加</a>';
		mui('#userInfo')[0].appendChild(div);
		
		document.getElementById('goToAddAddress').addEventListener('tap',function () {
		   mui.openWindow({
				url:'editAddress.html',
				id:'editAddress.html',
				styles:{
					top:'0px',
					bottom:'0px',
					width:'100%',
					height:'100%'
				},
				extras:{
					userId:userInfoData
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
		});	
	}
	
}
//显示商品信息
function showConfirmOrdergoods(goodsDatas){
	if(goodsDatas.length>0){
		mui.each(goodsDatas,function(index,item){
			var div=document.createElement("div");
			div.className='orderGoodsListItem';
			
			var realPrice=(item.realPrice==null?item.normalPrice:item.realPrice);
			
			var orderInnerHtml='';
			var goodsImg=item.goodsImg.split(',')[0];
			
			orderInnerHtml='<img class="orderGoodsListImg" src="../administrator/'+goodsImg+'" />'+
			'<p class="orderGoodsName">'+item.goodsDetail+'</p><div class="orderGoodsInfo">'+
			'<p class="orderGoodsPrice">&yen;'+realPrice+'</p>'+
			'<p class="orderGoodsCount">x1</p></div><p class="orderUserMsg">卖家留言：'+
			'<input type="text" class="mui-input-clear orderUserMsgIpt" placeholder="选填"  /></p>'+
			'<p class="orderGoodsSmallCount">共<span class="smallCountGoodNum">1</span>件商品   '+
			' 小计：&yen;<span class="smallCountGoodPrice">'+realPrice+'</span></div>';
			
			div.innerHTML=orderInnerHtml;
			
			mui('.orderGoodsList')[0].appendChild(div);
		});
	}else{
		
	}
	
	mui('.orderAllCountNum')[0].innerHTML=goodsDatas.length;
	//总计
	var smallCountGoodPriceNum=0;
	var smallCountGoodPrice=document.getElementsByClassName('smallCountGoodPrice');
	for(var i=0;i<smallCountGoodPrice.length;i++){
		smallCountGoodPriceNum+=parseInt(smallCountGoodPrice[i].innerHTML);
	}
	mui('#totalPrice')[0].innerHTML=smallCountGoodPriceNum;
}


mui.plusReady(function(){
	var self=plus.webview.currentWebview();
	var userId=self.userId;
	var goodsData=self.goodsData;
	
	showConfirmOrdergoods(goodsData);
	//console.log('确认订单userId'+JSON.stringify(userId));
	//console.log('确认订单goodsData'+JSON.stringify(goodsData));
	//console.log('确认订单goodsId'+JSON.stringify(goodsId));
	
	//获取用户信息
	mui.ajax('http://192.168.43.145:6868/checkLoginByUserId',{
		data:{
			userId:userId
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(data){
			if(data.status=='1'){
				if(data.datas.length==0){
					showConfirmOrderUser(userId);
				}else{
					showConfirmOrderUser(data.datas);
				}	
			}
			console.log('确认订单'+JSON.stringify(data));
		},
		error:function(xhr,type,errorThrown){
			mui.toast('服务器连接失败，请稍后再试');
		}
	});
	//获取商品信息
	
	
	//确认订单
	//关闭splash页面
	plus.navigator.closeSplashscreen();
	var payfor;//支付页面
	var self=null;//当前页面
	//支付页面           点击提交订单则创建支付页面
	document.getElementById("submitOrderBtn").addEventListener('tap',function(){
		self=plus.webview.currentWebview();
		if(payfor){//如果已经存在该窗口，则返回，避免快速点击创建多个窗口
			return
		}
		//不存在则创建支付窗口
		//支付页面距离顶端距离			自定义，需要多高则设置多高
		var top=plus.display.resolutionHeight-235;
		var href='payfor.html'
		
		payfor=plus.webview.create(href,'payfor.html',{
			width:'100%',
			height:'235px',
			top:top,
			scrollIndicator:'none',
			scalable:false,
			popGesture:'none'
		},{
			payforInfo:{
				'url':'confirmOrder.html',
				'userId':userId,
				'goodsData':goodsData,
				'totalPrice':mui('#totalPrice')[0].innerHTML,
				'pageSourceId':self.id
			}
		});
		
		//显示支付窗口   并且显示遮罩层
		payfor.addEventListener('loaded',function(){
			payfor.show('slide-in-bottom',300);
		},false);
		self.setStyle({
			mask:'rgba(0,0,0,0.5)'
		});
		
		//点击遮罩层
		self.addEventListener('maskClick',function(){
			//关闭遮罩层
			self.setStyle({
				mask:'none'
			});
			//避免出现特殊情况，确保支付页面子在初始化时关闭
			if(!payfor){
				payfor=plus.webview.getWebviewById('payfor.html');
			}
			//关闭支付页面
			if(payfor){
				payfor.close();
				payfor=null;
			}
		},false);	
	},false);	
});

