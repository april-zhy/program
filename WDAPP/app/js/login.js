
mui.plusReady(function(){
	var mask=mui.createMask();
	//生成验证码     OK
	var code;//在全局定义验证码
    var pinCode = document.getElementById("pinCode"); 
    function createCode(){
    	code = "";     
        var codeLength = 4;//验证码的长度    
        var random = new Array(0,1,2,3,4,5,6,7,8,9,
        	'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O',
        	'P','Q','R','S','T','U','V','W','X','Y','Z');//随机数
         for(var i = 0; i < codeLength; i++) {//循环操作    
            var index = Math.floor(Math.random()*36);//取得随机数的索引（0~35）    
            code += random[index];//根据索引取得随机数加到code上    
        }    
        pinCode.value = code;//把code值赋给验证码    
    }
    
    pinCode.addEventListener("tap",createCode,false);
	
	//校验验证码      OK
    var vertify=document.getElementById("vertify");
    var attspan=document.getElementById("att-span");
    function validate(){
        var inputCode = vertify.value.toUpperCase(); //取得输入的验证码并转化为大写          
        if(inputCode.length <= 0) { //若输入的验证码长度为0
            var str="请输入验证码";
			mui.alert(str);
			return false;
        }else if(inputCode != code ) { //若输入的验证码与产生的验证码不一致时
			mui.alert("您输入的验证码有误");
            createCode();//刷新验证码    
            vertify.value = "";//清空文本框
			return false;
        }else{
			return true;
        }
    }
   vertify.addEventListener("blur",validate,false);
	
	
	//随便逛逛跳转到首页    OK
	document.getElementById('gotoIndex').addEventListener('tap',function () {
        mui.openWindow({
        	url:'./index01.html',
        	id:'index01.html'
        });
	});
	
	//显示登录与注册框     ok
	var toggleForm=document.getElementById("toggleForm");
	function toggleLoginOrReg(){
		var loginForm=document.getElementById("loginForm");
		var classList=loginForm.classList;
		var regForm=document.getElementById("regForm");
		var styles=loginForm.getAttribute("style");
		arr=styles.split(":");
		if(arr[1]!="block"){
			loginForm.setAttribute('style','display:block');
			regForm.setAttribute('style','display:none');
			this.innerHTML="注册";
			
		}else{
			loginForm.setAttribute('style','display:none');
			regForm.setAttribute('style','display:block');
			this.innerHTML="登录";
		}
	}
	
	toggleForm.addEventListener("tap",toggleLoginOrReg);
	
	
	//验证注册时用户名
	var regInp=document.getElementById("regName");
	function checkName(){
		var userNameReg=/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;//用户名验证正则式
		var str;
	    var regName=document.getElementById("regName").value;
	    if(userNameReg.test( regName )){
	        return true;
	    }else{
        	mui.alert('您输入的用户名不正确');
			return false;
	    }
	}
	regInp.addEventListener("blur",checkName,false);
	
	
	
	//验证密码
	var regPwd=document.getElementById("regPwd");
	function checkPwd(){
	    var pwdReg=/[0-9a-zA-Z]{6,16}/;//密码验证正则式
	    var str;
	    if(pwdReg.test(regPwd.value)){
	        return true;
	    }else{
        	mui.alert('您输入的密码不合规范！')
	        return false;
	    }
	}
	regPwd.addEventListener("blur",checkPwd,false);
	
	
	//注册
	mui(document.body).on('tap', '#regBtn', function(e) {
		var regName=mui("#regName")[0].value;
		var regPwd=mui("#regPwd")[0].value;
		if(checkName() &&  validate() && checkPwd()){ 
			if(regName==""){
				mui.alert("您的用户名为空，请重新输入!");
			}else if(regPwd==""){
				mui.alert("您的密码为空，请重新输入!");
			}else{
				mui.ajax('http://192.168.43.145:6868/register',{
					data:{
						'regName':regName,
						'regPwd':regPwd
					},
					dataType:'json',//服务器返回json格式数据
					type:'post',//HTTP请求类型
					timeout:10000,//超时时间设置为10秒；
					beforeSend:function(){
						plus.nativeUI.showWaiting('注册中，请稍后...');
						mask.show();
					},
					complete:function(){
						plus.nativeUI.closeWaiting();
						mask.close();
					},
					success:function(data){
						if(data.status=="3"){
							mui.alert("您输入的用户名已经被注册，请重新输入!");
							createCode();
						}else if(data.status=='1'){
							mui.toast("注册成功,请登录！");
							document.getElementById("regName").value="";
							document.getElementById("regPwd").value="";
							toggleLoginOrReg();
						}else{
							mui.alert("注册失败！");
							createCode();
						}
					},
					error:function(xhr,type,errorThrown){
						mui.toast("服务器连接失败，请稍后再试！");
					}
				});
			}
			
		}
	});
				
	
   //登录
	mui(document.body).on('tap', '#loginBtn', function(e) {
		var loginName=mui("#loginName")[0].value;
		var loginPwd=mui("#loginPwd")[0].value;
		if(loginName=="" || loginName==undefined ){
			mui.alert("用户名不能为空");
		}else if(loginPwd=="" || loginPwd==undefined){
			mui.alert("密码不能为空");
		}else{
			mui.ajax('http://192.168.43.145:6868/login',{
				data:{
					'loginName':loginName,
					'loginPwd':loginPwd
				},
				dataType:'json',//服务器返回json格式数据
				type:'post',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				beforeSend:function(){
					plus.nativeUI.showWaiting('登录中，请稍后...');
					mask.show();
				},
				complete:function(){
					plus.nativeUI.closeWaiting();
					mask.close();
				},
				success:function(data){
					if(data.status=="1"){
						mui.toast("登录成功");
						document.getElementById("loginName").value="";
						document.getElementById("loginPwd").value="";
						
						mui.openWindow({
							url:'./index01.html',
							id:'index01.html',
							styles:{
								top:'0px',
								bottom:'0px',
								width:'100%',
								height:'100%'
							},
							extras:{
								userInfo:data.datas
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
					}else if(data.status=='3'){
						mui.alert('用户名或密码错误！');
					}
				},
				error:function(xhr,type,errorThrown){
					mui.toast('服务器连接失败，请稍后再试！');
				}
			});
		}
	});
	
	zhy.addEvent(createCode());//生成验证码

});