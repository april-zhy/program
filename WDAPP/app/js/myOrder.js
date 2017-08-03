
//显示商品信息
function showMyOrderGoods(orderGoodsData){
	mui("#orderMsgNum")[0].innerHTML=new Date().getTime();
	var orderImg=mui('#orderImg')[0];
	var goodImg;
	var priceArr=[];
	var div;
	if(orderGoodsData.length>0){
		priceArr.slice(0,priceArr.length);
		mui.each(orderGoodsData,function(index,item){
			priceArr.push(item.normalPrice);
			div=document.createElement("div");
			div.className='orderImg';
			goodImg='../administrator/'+item.goodsImg.split(',')[0];
			
			div.innerHTML+='<p class="orderImgBox"><img src="'+goodImg+'" />'+
			'<span class="orderImgTopic">'+item.goodsDetail+'</span><span class="orderImgNum">x1</span></p>'+
			'<p class="orderP">商品总价:<span id="orderImgPrice">'+item.normalPrice+'</span></p>'+
			'<hr class="hr" color="#f7f7f7"/><p class="orderP">下单时间:'+
			'<span id="orderImgDate">'+new Date().getDate()+'</span></p>';
			mui('#orderImg')[0].appendChild(div);
		});
		var totalPrice=0;
		for(var i=0;i<priceArr.length;i++){
			
			totalPrice+=parseInt(priceArr[i]);
			mui('#orderTotalPrice')[0].innerHTML=totalPrice;
		}
		
	}
}
//显示用户信息
function showMyOrderUser(orderUserData){
	console.log('ding'+JSON.stringify(orderUserData))
	
	var orderUser=mui('#orderUser')[0];
	
	if(orderUserData.length>0){
		
		mui.each(orderUserData,function(index,item){
			orderUser.innerHTML='<p class="orderP">'+
			'收件人：<span id="order-host-recieve">'+item.addName+'</span></p><hr class="hr" color="#f7f7f7"/>'+
			'<p class="orderP">电话：<span id="order-host-tel">'+item.addTel+'</span></p>'+
			'<hr class="hr" color="#f7f7f7"/><p class="orderP">'+
			'地址：<span id="order-host-addr">'+item.addAddress+item.addStreet+'</span></p>';
		});
		
		
	}
	
}


mui.plusReady(function(){
	var self=plus.webview.currentWebview();
	myOrderDatas=self.goodsData;
	
	//console.log('查看订单'+JSON.stringify(myOrderDatas));
	
	var goodsData=myOrderDatas.goodsData;
	var userId=myOrderDatas.userId;
	mui.ajax('http://192.168.43.145:6868/checkLoginByUserId',{
		data:{
			userId:userId
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(data){
			if(data.status){
				showMyOrderUser(data.datas);
				//console.log('查看订单'+JSON.stringify(data));
			}
		},
		error:function(xhr,type,errorThrown){
			
		}
	});
	showMyOrderGoods(goodsData);

});








