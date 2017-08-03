//显示用户信息
function showUserInfo(userData){
	
	if(userData.userName!=null ){
		mui('#userNameInfo')[0].innerHTML=userData.userName;
	}else{
		mui('#userNameInfo')[0].innerHTML='暂未登录';
	}
	if(userData.userMoney!=null ){
		mui('#userMoneyInfo')[0].innerHTML=userData.userMoney;
	}else{
		mui('#userMoneyInfo')[0].innerHTML=0;
	}
	
	if(userData.userBirth!=null ){
		mui('#userNameInfo')[0].innerHTML=userData.userData.userBirth;
	}
	
	if(userData.userImg!=null ){
		mui('#userImgInfo')[0].setAttribute('src','../img/basicImg/2.1.jpg');
	}else{
		mui('#userImgInfo')[0].setAttribute('src','../img/basicImg/touxiang.jpg');
	}
}
mui.plusReady(function(){
	
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
	
	showUserInfo(userObj.userInfo);
	
	
	
	//更改头像
	document.getElementById('userImg').addEventListener('tap',function(){
		if(mui.os.plus){
			var a=[{
				title:'拍照'
			},{
				title:'从手机相册选择'
			}];
			plus.nativeUI.actionSheet({
				title:'修改头像',
				cancel:'取消',
				buttons:a
			},function(b){
				switch(b.index){
					case 0:
						break;
					case 1:
						//拍照
						getImages();
						break;
					case 2:
						//打开相册
						galleryImages();
						break;
					default:
						break;
				}
			},false);
			
		}
	});

	//拍照
	function getImages(){
		console.log("你选择了拍照");
		var mobileCamera=plus.camera.getCamera();
		mobileCamera.captureImage(function(e){
			plus.io.resolveLocalFileSystemURL(e,function(entry){
				var path=entry.toLocalURL()+'?version='+new Date().getTime();
				uploadHeadImg(path);
			},function(err){
				console.log("读取拍照文件错误");
			});
		},function(e){
			console.log("er",err);
		},function(){
			filename:'_doc/head.png';
		});
	}

	//从本地相册选择
	function galleryImages(){
		console.log("你选择了从相册选择");
		plus.gallery.pick(function(a){
			plus.io.resolveLocalFileSystemURL(a,function(entry){
				plus.io.resolveLocalFileSystemURL('_doc/',function(root){
					root.getFile('head.png',{},function(file){
						//文件已经存在
						file.remove(function(){
							console.log("文件移除成功");
							entry.copyTo(root,'head.png',function(e){
								var path=e.fullPath+'?version='+new Date().getTime();
								uploadHeadImg(path);
							},function(err){
								console.log("copy image fail: ",err);
							});
						},function(err){
							console.log("删除图片失败：（"+JSON.stringify(err)+")");
						});
					},function(err){
						//打开文件失败
						entry.copyTo(root,'head.png',function(e){
							var path=e.fullPath+'?version='+new Date().getTime();
							uploadHeadImg(path);
						},function(err){
							console.log("上传图片失败：（"+JSON.stringify(err)+")");
						});
					});
				},function(e){
					console.log("读取文件夹失败：（"+JSON.stringify(err)+")");
				});
			});
		},function(err){
			console.log("读取拍照文件失败: ",err);
		},{
			filter:'image'
		});
	};

	//上传图片
	function uploadHeadImg(imgPath){
		console.log("上传拍照的图片path: ("+JSON.stringify(imgPath)+")");
		var imgpAHT=JSON.stringify(imgPath);
		var mainImg=document.getElementById('userImgInfo');
		mainImg.src=imgPath;
		
		
		var images=new Image();
		images.src=imgPath;
		var imgData=getBase64Image(images);
		
		//console.log("上传拍照的图片        imgData: ("+JSON.stringify(imgData)+")");
		//console.log("上传拍照的图片       type  imgData: ("+typeof imgData+")");
		
		mui.ajax('http://192.168.191.3:6868/uploadHeadImg',{
			data:{
				pic:imgpAHT
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				if(data.status=='1'){
					mui.toast('头像上传成功');
				}else{
					mui.toast('头像上传失败，请稍后再试');
				}
			},
			error:function(xhr,type,errorThrown){
				if(type=='timeout'){
					mui.toast('服务器连接超时，请稍后再试');
				}	
			}
		});
	}
	
	
	//压缩图片转成base64
	function getBase64Image(img){
		var canvas=document.createElement("canvas");
		var width=img.width;
		var height=img.height;
		if(width>height){
			if(width>100){
				height=Math.round(height*=100/width);
				width=100;
			}
		}else{
			if(height>100){
				width=Math.round(width*=100/height);
			}
			height=100;
		}
		
		canvas.width=width;
		canvas.height=height;
		var ctx=canvas.getContext('2d');
		ctx.drawImage(img,0,0,width,height);
		
		var dataUrl=canvas.toDataURL('image/png',0.8);
		return dataUrl;
	}
	
	
	
	//修改用户名     ok
	document.getElementById('userName').addEventListener('tap',function () {
		var btnArr=['否','是'];
	   	mui.prompt('请输入您要修改的名字',function(e){
	   		if(e.index==1){//点击确定
	   			document.getElementById('userNameInfo').innerHTML=e.value;
	   		}
	   	});
	});
	
	//充值     	ok
	document.getElementById('userMoney').addEventListener('tap',function () {
		var btnArr=['否','是'];
	   	mui.prompt('请输入您要充值的数目',function(e){
	   		if(e.index==1){//点击确定
	   			var reg=/[0-9]/g;
	   			//过滤掉出数字以外的
	   			var money1=parseInt(e.value);
	   			var money2=parseInt(document.getElementById("userMoneyInfo").innerHTML);
	   			//原始的加充值的
	   			var userMoney=money2+money1;
	   			document.getElementById("userMoneyInfo").innerHTML=userMoney;
	   		}
	   	});
	});
	
	//修改日期	OK
	document.getElementById('userBirth').addEventListener('tap',function () {
		var picker=new mui.DtPicker({
	   		type:'date',
	   		beginDate:new Date(1999,01,01),
	   		endDate:new Date(),
	    });
	   
	   
	    picker.show(function(selectItems){
	   		document.getElementById('userBirthInfo').innerHTML=selectItems;
	    });
	   
	});
	
	//查看地址	
	document.getElementById('usrAddress').addEventListener('tap',function () {
		//取到当前用户的地址表，并将数据发送给AddressList页面
		mui.ajax('http://192.168.43.145:6868/checkLoginByUserId',{
			data:{
				userId:userObj.userInfo.userId
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				console.log('0000'+JSON.stringify(data.datas));
				if(data.status=='1'){
					console.log(''+JSON.stringify(data.datas));
					mui.openWindow({
						url:'addressList.html',
						id:'addressList.html',
						styles:{
							top:'0px',
							bottom:'0px',
							width:'100%',
							height:'100%'
						},
						extras:{
							'userAddress':data.datas,
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
			},
			error:function(xhr,type,errorThrown){
				console.log('0000')
			}
		});	
	});	

	//退出登录     OK
	document.getElementById('logout').addEventListener('tap',function () {
	    mui.get('http://192.168.43.145:6868/logout',function(data){
	  		if(data.status=='1'){
	  			mui.toast('退出成功');
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
	  	},'json');    
	});

});