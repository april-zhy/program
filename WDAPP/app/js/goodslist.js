//展示商品
function showgoodsList(goodsDatas){
	var goodsContent=mui('.goodsContent')[0];
	var htmlStr='';
	//没有数据
	if(goodsDatas.length==0){
		mui.toast('没有查询到相关商品哦，重新查找试试~');
		htmlStr='<div class="goodsListNull">~~~没有相关产品~~~</div>';
		goodsContent.innerHTML=htmlStr;
	}else{
		//页面中的商品列表
		var goodsList=mui('.goodsList')[0];
		var goodsImg=mui('.goodsImg')[0];
		//遍历商品并显示
		var realPrice;
		mui.each(goodsDatas,function(index,item){
			realPrice=(item.realPrice==null?item.normalPrice:item.realPrice);
			htmlStr=htmlStr+'<div class="goodsList">'+
			'<img title="'+item.goodsId+'" class="goodsImg" src="../administrator'+item.goodsImg.split(',')[0]+'" />'+
			'<div class="listGoodsDetail">'+
			'<p class="listGoodsTitle">'+item.goodsName+'</p>'+
			'<p><span class="listGoodPrice">&yen;'+realPrice+'</span></p></div></div>';
		});
		goodsContent.innerHTML=htmlStr;
	}
}


mui.plusReady(function(){
	
	//遮罩层
	var mask=mui.createMask();
	
	//获取商品列表的数据
	var current=plus.webview.currentWebview();
	var goodsDatas=current.goodsInfo;
	
	//显示商品列表
	showgoodsList(goodsDatas);
	
	//搜索商品
	document.getElementById('seachBtn').addEventListener('tap',function () {
	   //搜索的关键字
	   var goodsKeyWord=document.getElementById("seachIpt").value;
	   //通过关键字筛选商品
	   mui.ajax('http://192.168.43.145:6868/getGoodsByKeyWord',{
	   		data:{
	   			keyWord:goodsKeyWord
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
					showgoodsList(data.datas);
				}else{
					mui.toast('查询失败，请稍后再试！');
				}
			},
			error:function(xhr,type,errorThrown){
				mui.toast("服务器连接超时，请稍后再试");
			}
		});
	});


	
	//跳转到商品详情页面
	mui('.goodsContent').on('tap','.goodsImg',function(e){
		var htmlGoodsId=this.title;
		mui.openWindow({
			url:'goods.html',
			id:'goods',
			styles:{
				top:'0px',
				bottom:'0px',
				width:'100%',
				height:'100%'
			},
			extras:{
				goodsId:htmlGoodsId
			},
			waiting: {
		        autoShow: true, //自动显示等待框，默认为true
		        title: '正在加载...请稍后', //对话框上显示的提示内容
		        options: {
		            width: '100%', //等待框背景区域宽度，默认根据内容自动计算合适宽度
		            height: '100%', //等待框背景区域高度，默认根据内容自动计算合适高度
		        }
		    }
		});
	});
	
});



















