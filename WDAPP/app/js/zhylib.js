(function(){
	//给window添加了一个空间,名称叫yc
	if(!window.zhy){
		window['zhy']={};
	}
/*===============================================================================================*/	
	//判断浏览器是否兼容这个库：浏览器能力检测
	function isCompatibale( other ){
		//===内容，类型都相同 	==值相同   other表示传入的参数，是否为假
		if ( other===false || !Array.prototype.push || !Object.hasOwnProperty || !document.createElement || !document.getElementsByTagName ) {
			return false;
		} 
		return true;
	};
	window['zhy']['isCompatibale']=isCompatibale;
	
	

/*===============================================================================================*/	
	//通过得到ID号，得到相应得值，如果传入一个值,返回一个对象，传入多个值，返回一个数组
	function $(){
		var elementarr=new Array();
		//查找作为参数提供的所有元素
		for(var i=0;i<arguments.length;i++){
			var element=arguments[i];
			if( typeof element=='string'){
				//如果这个元素是一个string，则表明这是一个id
				element=document.getElementById(element);
			}
			if(arguments.length==1){
				return element;
			}
			elementarr.push(element);
		}
		return elementarr;
	}
	window['zhy']['$']=$;
/*====================================页面加载事件================================================*/
	function addLoadEvent( func ){
		//将现有的window.event事件处理函数的值存入变量oldonload
		var oldonload=window.onload;
		//如果这个处理函数上还没有绑定任何函数，就像平时那样把新函数添加给它
		if ( typeof window.onload!='function' ){
			window.onload=func;//window加载完之后就激活该函数
		}else{
			//如果这个函数上已经绑定了一些函数，则将新函数追加到现有指令的尾部
			window.onload=function(){
				oldonload();//如个这个页面以前有函数，则调用以前的函数
				func();//再调用当前函数
			}
		}
		
	}
	window['zhy']['addLoadEvent']=addLoadEvent;

	function addEvent( node,type,listener ){
		if ( !isCompatibale() ){ return false; }
		if ( !(node=$( node )) ) { return false; }
		//w3c加事件的方法
		if ( node.addEventListener ) {
			////参数： 事件名        事件处理程序		是否在捕获阶段   true:捕获   false：冒泡
			/*btn3.addEventListener("click",showMesseage1,false);*/
			node.addEventListener( type,listener,false );
			return true;

			//MSIE的事件
		}else if ( node.attachEvent ) {
			node['e'+type+listener]=listener;

			node[type+listener]=function(){
				node['e'+type+listener]( window.event );
				//listener( window.event );
			}

			node.attachEvent( 'on'+type,node[type+listener] );
			return true;
		}
	};
	window['zhy']['addEvent']=addEvent;

	


})();
/*==========================================================================================================================*/	































