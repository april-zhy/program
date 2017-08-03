//显示商品
function showShopCart01(goodsData){
	//console.log('购物车'+JSON.stringify(goodsData))
	if(goodsData.length>0){
		mui.each(goodsData,function(index,item){
			div=document.createElement("div");
			div.className='shopCartItem';
			
			var realPrice=(item.realPrice==null?item.normalPrice:item.realPrice);
			var goodsImg=item.goodsImg.split(',')[0];
			
			div.innerHTML='<input class="iptSelect" type="checkbox" value="'+item.goodsId+'">'+
			'<img  src="../administrator/'+item.goodsImg.split(',')[0]+'" />'+
			'<div class="goodsInfo" style="display: block;"><p class="shopTitle"> '+item.goodsName+' </p>'+'<p class="shopPrice">&yen;'+realPrice+'</p></div>'+
			'<div class="goodsOpreation"><span class="goodsCount">商品数量:1</span>'+
			'<span class="shopDel">删除</span></div>';
		
		mui('#shopCart')[0].appendChild(div);

		});
	}else{
		div=document.createElement("div");
		div.innerHTML='<p class="shopCartNull">您的购物车是空的哟</p>'
		mui('#shopCart')[0].appendChild(div);
	}
		
	
}

//检测登录
/*var userObj={
	isLogin:false,
	userInfo:null
};
// 检测用户是否登录   ok
function checkLogin(){
	var self=plus.webview.currentWebview().opener();
	if(self.userInfo!="" && self.userInfo!=undefined && self.userInfo!=null){
		userObj.isLogin=true;
		userObj.userInfo=self.userInfo;
	}
	else{
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
	}
	return userObj;
}*/

/*window.addEventListener('pageflowerfresh',function(){
	location.reload(function(){
		console.log('shopcart');
	});
	
},false);
*/

mui.plusReady(function(){
	
	var checkedGoodsData=[];
	var userObj={
		isLogin:false,
		userInfo:null
	};
	var self=plus.webview.currentWebview().opener();
	if(self.userInfo!="" && self.userInfo!=undefined && self.userInfo!=null){
		userObj.isLogin=true;
		userObj.userInfo=self.userInfo;
		//console.log('购物车检测登录userObj.userInfo000'+JSON.stringify(userObj.userInfo));
	}
	
	//立即购买
	document.getElementById('buyNowBtn').addEventListener('tap',function () {
		mui.openWindow({
	    	//取到当前商品信息，跳转到下订单页面
			url:"confirmOrder.html",
			id:'confirmOrder.html',
			extras:{
				'userId':userObj.userInfo.userId,
				'goodsData':checkedGoodsData
			}
		});
	},false);
	//如果用户已经登录了
	if(userObj.isLogin){
		getGoodsFromShopCart();
		//切换编辑完成
		document.getElementById('showDel').addEventListener('tap',function () {
	   		if(this.innerHTML=='编辑'){
	   			this.innerHTML='完成';
	   		}else{
	   			this.innerHTML='编辑';
	   		}
	   		
	   		var goodsInfo=document.getElementsByClassName('goodsInfo');
	   		var goodsOpreation=document.getElementsByClassName('goodsOpreation');
	   		
	   		if(goodsInfo.length>0){
	   			var goodsInfoStyles=goodsInfo[0].getAttribute("style");
	   			var goodsInfoStatus=goodsInfoStyles.split(':')[1];
	   		}else{
	   			document.getElementById("shopCart").innerHTML='<p class="shopCartNull">您的购物车是空的哟</p>';
	   		}
	   		//显示隐藏删除按钮
	   		if(goodsInfoStatus!='none'){
	   			for(var i=0;i<goodsInfo.length;i++){
	   				goodsInfo[i].setAttribute('style','display:none');
	   				goodsOpreation[i].setAttribute('style','display:block');
	   			}
	   		}else{
	   			for(var j=0;j<goodsInfo.length;j++){
	   				goodsOpreation[j].setAttribute('style','display:none');
	   				goodsInfo[j].setAttribute('style','display:block');	
	   			}
	   		}
	   		
	   		//删除当前商品    ok
			mui('.goodsOpreation').on('tap','.shopDel',function(){
				var btnArr=['确定','再看看'];
				
				var thisNode=this.parentNode.parentNode;
				mui.confirm('确定删除该商品? ','提示',btnArr,function(e){
					if(e.index==0){
						thisNode.remove();
					}
				});
			});
				
		});
			
			
		//如果用户登录，则从购物车中获取数据
		function getGoodsFromShopCart(){
			mui.ajax('http://192.168.43.145:6868/getGoodsFromShopCart',{
				data:{
					userId:userObj.userInfo.userId
				},
				dataType:'json',//服务器返回json格式数据
				type:'post',//HTTP请求类型
				timeout:5000,//超时时间设置为10秒；
				success:function(data){
					if(data.status=='1'){
						goodsData=data.datas;
						showShopCart01(goodsData);
					}else{
						mui.toast("查询失败，请稍后再试");
					}
				},
				error:function(xhr,type,errorThrown){
					mui.toast("服务器连接超时，请稍后再试");	
				}
			});  
		}
		mui(document.body).on('change','.iptSelect',function(){
			//购物车中复选框
			var iptSelect=document.getElementsByClassName('iptSelect');
			var checked=false;
			
			var goodsIdArr=[];
			var goodId;
			
			var priceArr=[];
			var price=0;
			var priceStr='';
			
			
			//添加之前先清空数组，防止之前添加的还在
	   		goodsIdArr.splice(0,goodsIdArr.length);
	   		priceArr.splice(0,priceArr.length);
			checkedGoodsData.splice(0,checkedGoodsData.length);
			for (var j=0;j<iptSelect.length;j++) {
				if(iptSelect[j].checked){
		    		goodId=parseInt(iptSelect[j].getAttribute('value'));	
		    		priceStr=iptSelect[j].parentNode.children[2].children[1].innerHTML;
		    		
		    		var reg=/[0-9]+/g;
		    		price=parseInt(priceStr.match(reg));
		    		if( (goodId!=undefined)  &&((goodsIdArr.indexOf(goodId)=== -1))　){
		    			goodsIdArr.push(goodId);
		    			priceArr.push(price);	
		    		}
		    		
		    	}
		    }	
		    //选中的商品信息
		    for(var i=0;i<goodsIdArr.length;i++){
		    	for (var x=0;x<goodsData.length;x++) {
    				if(goodsIdArr[i]==goodsData[x].goodsId){
    					checkedGoodsData.push(goodsData[x]);
    					//console.log('选中的商品信息goodsData'+JSON.stringify(checkedGoodsData));
		    		}
    			}
		    }
		    
		    //总计
			var totalPrice=0;
			for(var z=0;z<priceArr.length;z++){
				totalPrice=totalPrice+priceArr[z];	
				
			}
		    document.getElementById("totalPrice").innerHTML='&yen;'+totalPrice;
			
			
			//获取当前有么有INPUT框勾选，如有则将buyNowBtn设为可用的
			for(var i=0;i<iptSelect.length;i++){
				if(iptSelect[i].checked){
					checked=true; 
					mui('#buyNowBtn')[0].disabled=false;
					return;
				}else{
					checked=false;
					mui('#buyNowBtn')[0].disabled=true;
				}
			}			    	
		});
	}
});





	
	








