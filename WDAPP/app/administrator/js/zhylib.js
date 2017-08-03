(function(){
	//给window添加了一个空间,名称叫yc
	if(!window.yc){
		//window.yc={};
		window['yc']={};
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
	window['yc']['isCompatibale']=isCompatibale;
	
	

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
	window['yc']['$']=$;
	
/*===============================================================================================*/	


/*========================================事件监听============================================================*/
	//增加事件：	node:节点      type:事件类型（'click'）	listener:监听函数，即触发时，调用的函数
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
			/*btn.attachEvent("onclick",listener);*/
			node.attachEvent( 'on'+type,node[type+listener] );
			return true;
		}
	};
	window['yc']['addEvent']=addEvent;
	

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
	window['yc']['addLoadEvent']=addLoadEvent;

/*============================================================================================================*/


	//移除事件
	function removeEvent( node,type,listener ){
		if ( !(node=$(node)) ) { return false;	}
		if ( node.removeEventListener ) {
			node.removeEventListener( type,listener,false );
			return true;
		}else if( node.detachEvent ){//IE
			node.detachEvent( 'on'+type,node[type+listener] );
			node[type+listener]=null;
			return true;
		}
		return false;
	};
	window['yc']['removeEvent']=removeEvent;
	
/*===============================================================================================*/
	//扩展document.getElementsByClassName()
	//				classname:要找的类名   tag：要找的标签  parent:父节点
	function getElementsByClassName( className,tag,parent ){
		parent=parent||document;
		//判断id号为parent的，是否存在
		if ( !(parent=$(parent)) ) { return false; }
		//查看所有匹配的标签
		var allTags=( tag=="*" && parent.all )? parent.all:parent.getElementsByTagName(tag);
		var matchingElements=new Array();
		//创建一个正则表达式，来判断classname是否正确       \s：空格
		var regex=new RegExp( "(^|\\s)"+className+"(\\s|$)" );
		var element;
		//检查每个元素
		for ( var i=0;i<allTags.length;i++ ) {
			element=allTags[i];
			if ( regex.test( element.className ) ){
				matchingElements.push( element );
			}
		}
		return matchingElements;
	}
	window['yc']['getElementsByClassName']=getElementsByClassName;
/*===========================================显示/隐藏=========================================================*/	
	//开关作用
	function toggleDisplay( node,value ){
		if ( !(node=$(node)) ) {	return false;	}
		if ( node.style.display!='none' ) { 
			node.style.display='none';
		}else{
			node.style.display=value||'';
		}
		return true;
	};
	window['yc']['toggleDisplay']=toggleDisplay;


/*=========================================DOM节点的操作======================================================*/	
	//增加DOM节点的操作:在referenceNode后面，添加一个节点node
	function insertAfter( node,referenceNode ){
		if ( !(node=$(node)) ) {	return false;	}
		if ( !(referenceNode=$(referenceNode)) ) { return false; }
		var parent=referenceNode.parentNode;
		if ( parent.lastChild==referenceNode ) {//当前节点referenceNode是最后一个节点
			parent.appendChild( node );
		}else{//当前节点referenceNode后还有兄弟节点
			parent.insertBefore( node,referenceNode.nextSibling );
		}
	};
	window['yc']['insertAfter']=insertAfter;
	
	//在一个父节点的第一个子节点前面添加一个新节点
	function prependChild( parent,newChild ){
		if ( !( parent=$(parent) ) ) {  return false;  }
		if ( !( newChild=$(newChild) ) ) {  return false;  }
		if ( parent.firstChild ){//查看父节点下面是否有子节点
			//如果有一个子节点，就在这个子节点前面加
			parent.insertBefore( newChild,parent.firstChild );
		}else{
			//如果没有直接添加
			parent.appendChild( newChild );
		}
		return parent;
	};
	
	window['yc']['prependChild']=prependChild;
	
	
	
	//移除DOM节点所有子节点的操作   移除parent下所有的子节点
	function removeChildren( parent ){
		if ( !(parent=$(parent)) ) {	return false;	}
		while( parent.firstChild ){
			parent.removeChild( parent.firstChild );
			//parent.firstChild.parentNode.removeChild( parent.firstChild );
		}
		//返回父元素，以实现方法连缀
		return parent;
	};
	window['yc']['removeChildren']=removeChildren;
	
	

/*===============================================================================================*/	
	//升级版的eval
	/*str:要转换的字符串
	filter：用于过滤和转换结果的可选参数
	案例：
	如果键名中有date,则将值转为DATE对象
		myDate=parseJSON( str,function( key,value ){
			return key.indexOf('date')>=0? new Date(value):value;
		} );
	*/
	
	function parseJSON( str,filter ){
		var j;
		//递归函数
		function walk(k,v){
			var i;
			if(v && typeof v==='object'){
				for ( i in v ) {
					if ( v.hasOwnProperty(i) ) {
						v[i]=walk( i,v[i] );
					}
				}
			}
			return filter(k,v);//回调过滤函数，完成过滤功能
			//转换分为三个阶段，
			/*第一阶段：通过正则表达式检测JSON文本，查找非json字符，其中特别是()，new，因为它们会引起语句的调用，还有=，它会导致复制，为了安全，我们这里拒绝所有不希望出现的字符*/
			/*首先这个串分为两个部分，看中间的或符号（|）   
			 *  /^("(\\.|[^"\\\n\r])*?"  和    [,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/
			 * 先分解  "(\\.|[^"\\\n\r])*?"   ：它匹配一个双引号的字符串，两边引号的括号里面呢一个“|” 又分成两段，
			 * "\\."  匹配一个转义字符，  \n,\r等等，
			 * [^"\\\n\r]   匹配一个非\，回车换行的字符，其实它就是JS字符串的规则---不包含回车换行，前面 的\用于转义
			 * 其次看  [,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]  它匹配一个单个字符，这个字符可以是  ,，:，{，}，[，]，数字  除"\n"之外的任何的那个字符
			 * 结合起来，将JSON拆分为若干段，字符串单独成一段，其他的都是单个字符组成
	*/
	}
			if(/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(str)){
				//第二阶段，将JSON字符串转为JS结构
				try{
					j=eval( '('+str+')' );
				}catch(e){
					throw new SyntaxError("Eval parsejson");
				}
			}else{
				throw new SyntaxError("parseJSON");
			}
			//第三阶段，递归遍历了新生成的结构，将每个名/值对传递给一个过滤函数
			if(typeof( filter )=="function"){
				j=walk('',j);
			}
			return j
	}
	window['yc']['parseJSON']=parseJSON;
	
	/*function parseJSON( str,filter ){
		var result=eval( "("+str+")" );
		if( filter!=null&& typeof( filter )=='function' ){
			for ( var i in result) {
				result[i]=filter( i,result[i] );
			}
		}
		return result;
	}
	window['yc']['parseJSON']=parseJSON;*/
	
/*===============================================================================================*/	
	//把一个对象转为json字符串
	/*扩展全局的     window.Object,prototype=xxx
	 * 需求：给Object类的prototype添加一个功能	toJSAONString()将属性的值以JSON格式输出
	 *return ;返回json字符串*/
	function toJSONStringStu(obj){
		var result='"{';
		for(var key in obj){
			if(typeof obj[key]!='function'){
				result+='"'+key+'":"'+obj[key]+'",';
			}
		}
		return result.substring(0,result.length-1)+'}"';
		//substring 截取字符串中介于两个指定下标之间的字符。
	}
	window['yc']['toJSONStringStu']=toJSONStringStu;
	
/*=======================================================================================================================*/
/*=======================================================================================================================*/
/*========================================样式操作第一弹：设置样式规则=====================================================*/
/*=======================================================================================================================*/
/*=======================================================================================================================*/
	
	//驼峰式命名   例如：将font-size 转为fontSize
	function camelize(s){
		return s.replace( /-(\w)/g,function( strMatch,p1 ){//-s   ->S
			//  \w 小写   匹配到-小写字母，则将小写字母转为大写字母
			return p1.toUpperCase();
		} );
	}
	window['yc']['camelize']=camelize;
	
	
	//将fontSize 转为font-size
	function unCamelize( s,sep ){
		sep=sep||'-';
		return s.replace( /([a-z])([A-Z])/g,function( match,p1,p2 ){
			//匹配到（小写字母）（大小字母），将大写字母转为-小写字母
			//alert("p1+p2"+p1+sep+p2.toLowerCase() );
			return p1+sep+p2.toLowerCase();
		} );
	}
	window['yc']['unCamelize']=unCamelize;
/*====================================================================================================================*/

	//通过单个ID修改单个元素的样式	styles{ "backgroundColor":"color" }
	function setStyleById( element,styles ){
		//取得对对象的引用
		if ( !( element=$( element ) ) ) { return false; }
		//遍历style对象的属性，并应用每个属性
		for ( property in styles ) {
			if ( !styles.hasOwnProperty( property ) ) {
				continue;
			}
			if ( element.style.setProperty ) {
				//DOM2样式规范：setProperty( propertyName,value,priority )
				element.style.setProperty( unCamelize( property,'-' ),styles[property],null );
			}else{
				//备用方法  element.style['backgroundColor']="red"
				element.style[ camelize( property ) ]=styles[property];
			}
		}
		return true;
	}

	window['yc']['setStyleById']=setStyleById;
	window['yc']['setStyle']=setStyleById;

/*====================================================================================================================*/

	//通过标签名修改多个样式
	/*tagname:标签名
	 styles：样式对象
	 parent:父标签的ID*/
	function setStylesByTagName( tagname,styles,parent ){
		parent=$(parent)||document;
		var elements=parent.getElementsByTagName( tagname );
		for ( var e=0;e<elements.length;e++ ) {
			setStyleById( elements[e],styles );
		}
	}
	window['yc']['setStylesByTagName']=setStylesByTagName;
	
/*====================================================================================================================*/	
	
	//通过类名修改多个元素的样式
	/*parent:父元素的id
	 tag:标签名
	 className：标签上的类名
	 style:样式对象*/
	function setStylesByClassName( parent,tag,className,styles ){
		if ( !(parent=$(parent)) ) {
			return false;
		}
		var elements=getElementsByClassName( className,tag,parent );
		for ( var e=0;e<elements.length;e++ ) {
			setStyleById( elements[e],styles );
		}
		return true;
	}
	window['yc']['setStylesByClassName']=setStylesByClassName;
	
	
	
/*========================================================================================================================*/
/*========================================================================================================================*/
/*====================================样式操作第二 弹：基于className切换样式================================================*/
/*========================================================================================================================*/
/*========================================================================================================================*/

	
	//取得元素中类名的数组
	function getClassNames( element ){
		if ( !(element=$(element)) ) {  return false;  }
						//用一个空格替换多个空格     \s+：一个或多个空格,再基于空格用于分割
		return element.className.replace( /\s+/,' ' ).split(' ');
	}
	window['yc']['getClassNames']=getClassNames;
	
/*====================================================================================================================*/	
	
	//检查元素是否存在某个类名、
	function hasClassName( element,className ){
		if ( !(element=$(element)) ) {  return false;  }
		var classes=getClassNames( element );//得到所有的类名
		for ( var i=0;i<classes.length;i++ ) {
			if ( classes[i]===className ) {
				return true;
			}
		}
		return false;
	}
	window['yc']['hasClassName']=hasClassName;
	
/*====================================================================================================================*/

	//为元素添加类
	function addClassName( element,className ){
		if ( !(element=$(element)) ) {  return false;  }
		//将类名添加到当前className的末尾，如果没有空格则不添加空格
		var space=element.className?' ':'';
		//     如果 有a 则  a b   如果没有则直接b
		element.className+=space+className;
		return true;
	}
	window['yc']['addClassName']=addClassName;
	
/*====================================================================================================================*/
	
	//从元素中删除类
	function removeClass( element,className ){
		if ( !(element=$(element)) ) {  return false;  }
		//先获取所有的类
		var classes=getClassNames(element);
		//循环遍历数组，删除匹配的项
		//因为从数组中删除项,会使数组的新航渡发生改变，所以反向删除
		var length=classes.length;
		var a=0;
		for ( var i=length-1;i>=0;i-- ) {
			if ( classes[i]===className ) {//用splice试试
				delete( classes[i] );//这种方式数组长度不变,此时arr[i]变为undefined了,即长度不变
				a++;
			}
		}
		element.className=classes.join(' ');
		//判断删除是否成功
		return (a>0?true:false);
	}
	window['yc']['removeClass']=removeClass;


/*=======================================================================================================================*/
/*=======================================================================================================================*/
/*====================================样式操作第三弹：更大范围的改变，切换样式规则============================================*/
/*=======================================================================================================================*/
/*=======================================================================================================================*/


	//通过URL取得所有样式表的数组
	function getStyleSheets(url,media){
		var sheets=[];
		for ( var i=0;i<document.styleSheets.length;i++) {
			if ( url&&document.styleSheets[i].href.indexOf(url)==-1 ) {
				continue;
			}
			if ( media ) {
				//规范化meida字符串
				media=media.replace(/,\s*/,',');//把空格去掉
				var sheetMedia;
				if ( document.styleSheets[i].media.mediaText ) {
					//dom
					sheetMedia=document.styleSheets[i].media.mediaText.replace(/,\s*/,',');
					//safari会增加额外的逗号和空格
					sheetMedia=sheetMedia.replace(/,\s*$/,'');
				}else{
					//ie
					sheetMedia=document.styleSheets[i].media.replace(/,\s*/,',');
				}
				//如果media不匹配，则跳过
				if( media!=sheetMedia ){
					continue;
				}
			}
			sheets.push( document.styleSheets[i] );
		}
		return sheets;
	}
	window['yc']['getStyleSheets']=getStyleSheets;
	
/*===========================================================================================================================*/

	//增加样式表
	function addStyleSheets( urls,medias ){
		medias=medias||'screen';
		var links=document.createElement("link");
		links.href=urls;
		links.media=medias;
		links.rel="stylesheet";
		links.type="text/css" ;
		
		//在ie中  setAttribute("class","a")  ff中 setAttribute("className","a") 
		//但是  links.className通用
		
		document.getElementsByTagName("head")[0].appendChild(links);
	}

	window['yc']['addStyleSheets']=addStyleSheets;
	
/*===========================================================================================================================*/

	//移除样式表
	function removeStyleSheet( url,media ){
		var styles=getStyleSheets( url,media );
		for ( var i=0;i<styles.length;i++ ) {
			//styles[i]  表示样式表    .ownerNode表示这个样式表所属的节点<link》
			var node=styles[i].ownerNode||styles[i].owningElement;
			//禁用样式
			styles[i].disabled=true;
			//移除节点
			node.parentNode.removeChild(node);
		}
	}
	window['yc']['removeStyleSheet']=removeStyleSheet;
	
/*==========================================================================================================================*/

	//添加样式规则
	function addCssRules( selector,styles,index,url,media ){
		var declaration="";
		//根据style参数（样式对象）构造声明字符串
		for ( property in styles ) {
			if ( !styles.hasOwnProperty( property ) ) {
				continue;
			}
			declaration+=property+":"+styles[property]+";";
		}
		//根据url和media获取样式表
		var styleSheets=getStyleSheets( url,media );
		var newIndex;
		//循环所有满足条件的样式表，添加样式规则
		for( var i=0;i<styleSheets.length;i++ ){
			//添加规则
			if ( styleSheets[i].insertRule ){
				newIndex=( index>=0?index:styleSheets[i].cssRules.length );
				styleSheets[i].insertRule( selector+'{'+declaration+'}',newIndex );
			}else if ( styleSheets[i].addRule ) {
				//计算规则添加的索引位置
				newIndex=( index>=0? index:-1 );//ie中，数组最后一项的索引为-1，所以IE不支持indexOf方法
				styleSheets[i].addRule( selector,declaration,newIndex );
			}
		}
	}

	window['yc']['addCssRules']=addCssRules;
/*==========================================================================================================================*/	
	//编辑样式规则
	function eidtCSSRule( selector,styles,url,media ){
		//取出所有的样式表
		var styleSheets=getStyleSheets( url,media )
		//循环每个样式中的每条规则
		for	( var i=0;i<styleSheets.length;i++ ){
			//取得规则列表  DOM2样式规范是styleSheet[i].cssRules  ie是styleSheet[i].Rules 
			var rules=styleSheets[i].cssRules || styleSheet[i].Rules;
			if ( !rules ) {
				continue;
			}
			//IE默认选择器名使用大写，故转换为小写形式，如果使用的是区分大小写的ID，则有可能会导致冲突
			selector=selector.toUpperCase();
			for ( var j=0;j<rules.length;j++ ) {
				//检查规则中的选择器名是否匹配
				if ( rules[j].selectorText.toUpperCase()==selector ) {//找到要修改的选择器
					for ( property in styles ) {
						if ( !styles.hasOwnProperty( property ) ) {
							continue;
						}
						//将这条规则设置为新样式
						rules[j].style[ camelize(property) ]=styles[property];
						//rules[j].style[ 'fontSize' ]='red';
						
					}
				}
			}
		}
	}
	window['yc']['eidtCSSRule']=eidtCSSRule;
	
/*==========================================================================================================================*/	


	//计算样式值
	function getStyle( element,property ){
		if ( !(element=$( element )) ) { return false;	}
		//检测style属性中的值,即样式规则的值
		var value=element.style[camelize( property ) ];
		if (!value ) {
			//取得计算值
			if ( document.defaultView && document.defaultView.getComputedStyle ) {
				//DOM方法
				var css=document.defaultView.getComputedStyle( element,null );
				
				value=css? css.getPropertyValue( property ):null;
			}else if ( element.currentStyle ) {
				//ie
				value=element.currentStyle[ camelize( property ) ];
			}
		}
		//返回空字符串，而不是AUTO，这样就不必检查auto 值了
		return value=='auto'?'':value;
	}

	window['yc']['getStyle']=getStyle;
	window['yc']['getStyleById']=getStyle;
	
	
	
	
	
/*========================================================================================================================*/
/*======================================================================================================*/
/*=================================移动事件==============================================*/
/*========================================================================================================================*/
/*========================================================================================================================*/
	//动画:  定时元素
	//元素  id  X最终位置，Y最终位置，  间隔时间
	function moveElement( elementId,finalX,finalY,interval ){
		//浏览器检测
		if ( !isCompatibale() ){ return false; }
		if ( !$( elementId )  ) {	return false; }
		
		//取出元素
		var elem=$(elementId);
		//alert(elem);
		
		if ( elem.movement ) {
			//alert("a");
			clearTimeout( elem.movement );
		}
		
		//取出当前元素的位置   x-left  y-top
		var xpos=parseInt( elem.style.left );//把px去掉
		var ypos=parseInt( elem.style.top );
		
		//计算移动后的位置是否越界，并设置新位置
		if ( xpos==finalX && ypos==finalY ) {
			return true;
		}
		
		var dist=0;
		if( xpos<finalX ){
			dist=( finalX-xpos )/10;
			xpos=xpos+dist;
		}
		if( xpos>finalX ){
			dist=( xpos-finalX)/10;
			xpos=xpos-dist;
		}
		if( ypos<finalY ){
			dist=( finalY-ypos )/10;
			ypos=ypos+dist;
		}
		if( ypos>finalY ){
			dist=( ypos-finalY)/10;
			ypos=ypos-dist;
		}
		
		elem.style.left=xpos+"px";
		elem.style.top=ypos+"px";
		
		//定时器重复当前的移动操作  setTimeOut（函数声明，间隔时间）
		//function moveElement( elementId,finalX,finalY,interval ){
		//	setTimeout( "moveElement("elementId",finalX,finalY,interval)",interval );
		var repeat="yc.moveElement('"+elementId+"',"+finalX+","+finalY+","+interval+")";
		elem.movement=setTimeout( repeat,interval );
		//clearTimeOut( timeoutID )
		
	}
	window['yc']['moveElement']=moveElement;


/*====================================================================================================*/
/*====================================================================================================*/
/*=======================================xml操作=======================================================*/
/*====================================================================================================*/
/*====================================================================================================*/
//从xml文档对象中按xpath规则提出要求的节点  /student/student
	function selectXMLNodes( xmlDoc,xpath ){
		if ( '\v'=='v' ) {
			//ie
			xmlDoc.setProperty("SlectionLanguage","Xpath");
			//将当前xml文档的查找方式改为xpath
			return xmlDoc.documentElement.selecttNodes(xpath);
		}else{
			//w3c
			var evaluator=new XPathEvaluator();
			//							表达式：字符串，	内容节点，								
			//evaluator.evaluate(expression: String, contextNode: Node, resolver: XPathNSResolver, type: Number, result: Object): Object)
			var resultSet=evaluator.evaluate( xpath,xmlDoc,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null );
			//通过xpath解析的结果是一个集合
			var finalArray=[];
			if ( resultSet ) {
				var el=resultSet.iterateNext();//循环得到的结果
				while(el){
					finalArray.push(el);
					el=resultSet.iterateNext();
				}
				return finalArray;
			}
		}
	}

	window['yc']['selectXMLNodes']=selectXMLNodes;
	
	
	//在xml中，dom中不能使用getElementById的方法，所以这里定义实现一个有相似功能的函数
	function getElementByIdXML( rootNode,id ){
		//先获取所有的元素
		var nodeTags=rootNode.getElementsByTagName('*');
		for ( var i=0;i<nodeTags.length;i++ ) {
			if ( nodeTags[i].hasAttribute('id') ) {
				//取出属性名为id
				if( nodeTags[i].getAttribute('id')==id ){
					return nodeTags[i];
				}
			}
		}
	}
	window['yc']['getElementByIdXML']=getElementByIdXML;
	
	
	//将xml的字符串反序列化转成xml dom节点对象 以便于利用 getElementByTagName()等函数来操作
	//parse 剖析
	function parseTextToXmlDomObject(str){
		if ( '\v'=='v' ) {
			//ie
			var xmlNames=["Msxml2.DOMDocument.6.0","Msxml2.DOMDocument.4.0","Msxml2.DOMDocument.3.0","Msxml2.DOMDocument","Microsoft.XMLDOM","Microsoft.XmlDom"];
			for ( var i=0;i<xmlNames.length;i++ ) {
				try{
					/*var xml=new ActiveXObject("Microsoft.XMLHTTP");创建XMLHttpRequest 对象（这是在IE7以前的版本中）；在较新的IE版本中可以利用 var xml=new ActiveXObject("Msxml2.XMLHTTP")的形式创建XMLHttpRequest对象;而在IE7及非IE浏览器中可以利用var xml=new XMLHttpRequest()创建XMLHttpRequest对象。 */
					var xmlDoc=new ActiveXObject(xmlNames[i]);
					break;
				}catch(e){
					//TODO handle the exception
				}
				xmlDoc.async=false;
				xmlDoc.loadXML(str);
			}
		}else{
			try{
				//ff,chrome.opera,webkit
				var parser=new DOMParser();
				var xmlDoc=parser.parseFromString(str,"text/xml");
			}catch(x){
				alert(x.message);
				return;
			}
		}
		return xmlDoc;
	
	}
	window['yc']['parseTextToXmlDomObject']=parseTextToXmlDomObject;
	
	//将xml Dom对象序列化转为xml字符串
	function parseXmlDomObjectToText(xmlDom){
		if(xmlDom.xml){//xml文件内容
			return xmlDom.xml;
		}else{
			var serializer=new XMLSerializer();
			return serializer.serializeToString(xmlDom,"text/xml");
		}
	}
	window['yc']['parseXmlDomObjectToText']=parseXmlDomObjectToText;
	


/*========================================================================================================================*/	
/*========================================================================================================================*/
/*====================================ajax封装================================================*/
/*========================================================================================================================*/
/*========================================================================================================================*/
//对参数字符串的编码，针对GET请求  person.action?name=%xxx%xxx&age=20  
	function addUrlParam( url,name,value ){
		url+=( url.indexOf("?")==-1? "?":"&" );
		url+=encodeURLComponent( name )+"="+encodeURLComponent(value);
		return url;
	}
	
	window['yc']['addUrlParam']=addUrlParam;
	
	//序列化表单   name=zhy&password=a
	function serialize( form ){
		var parts=new Array();
		var field=null;
		//form.elements 表单中所有的元素
		for ( var i=0,len=form.lenght;i<len;i++ ) {
			field=form.elements[i];
			switch ( field.type ){
				case "select-one":
				case "select-multiple":
					for ( var j=0,optlen=field.options.lenght;j<optlen;j++ ) {
						var option=field.options[i];
						if ( option.selected ) {
							var optVlue="";
							if ( option.hasAttribute ) {
								optVlue=( option.hasAttribute("value")? option.value:option.text );
							}else{
								optVlue=( option.attributes["value"].specified ? option.value:option.text );
								
							}
							parts.push( encodeURIComponent( field.name )+"="+encodeURIComponent( optVlue ) );
						}
					}
					break;
				case undefined:  //fieldset
				case "file":	 //file input
				case "submit":	 //submit button
				case "reset":	 //reset button
				case "button":	 //custom button
					break;
				case "radion":	 //radion button
				case "checkbox": //checkbox
					if ( !field.checked ) {
						break;
					}
					//falls through
				default:
					parts.push( encodeURIComponent( field.name )+"="+encodeURIComponent(field.value) );
			}
		}
		return parts.join("&");
	}
	window['yc']['serialize']=serialize;
	
	/*通用的获取xmlHttpRequest对象的函数*
	 */
	function getRequestObject(url,options){
		//初始化请求对象
		var req=false;
		if ( window.XMLHttpRequest ) {
			req=new window.XMLHttpRequest();//ie7+,ff,chrome
		}else if ( window.ActiveXObject ) {
			var req=new window.ActiveXObject( "Microsoft.XMLHTTP" );//ie7以下浏览器
		}
		if(!req){
			return false;//如果无法创建request对象，则返回
		}
		//定义默认选项
		options=options|| {};
		options.method=options.method || 'POST';
		options.send=options.send || null;
		
		//定义请求的不同状态时回调的函数
		req.onreadystatechange=function(){
			switch (req.readyState){
				case 1:
				//请求初始化
					if ( options.loadListener ) {
						options.loadListener.apply( req,arguments );// apply/call  this作用域
					}
					break;
				case 2:
				//加载完成
					if ( options.loadListener ) {
						options.loadListener.apply( req,arguments );// apply/call  this作用域
					}
					break;
				case 3:
				//交互
					if ( options.loadListener ) {
						options.loadListener.apply( req,arguments );// apply/call  this作用域
					}
					break;
				case 4:
				//完成交互时的回调操作
					try{
						if ( req.status && req.status==200 ) {
							//注意：Content-Type:text/html ; charset=ISO-8859-4
							//这个数据存在响应头中，表示响应的数据类型，那么用 responseText/responseXML来获取
							//获取响应头的文件类型
							var contentType=req.getResponseHeader("Content-Type");
							//截取出   分号;前面的部分，这一些表示的是内容类型
							var reg=/\s*([^;]+)\s*(;|$)/i;
						var mimeType=contentType.match(reg)[1];						
						//alert(mimeType);
							switch (mimeType){
							
								case 'text/javascript':
								case 'appliction/javascript':
									//表示会送的数据是一个js代码
									if(options.jsResponseListener){
										options.jsResponseListener.call(req,req.responseText);
									}
									break;
								case 'text/plain':
								case 'appliction/json':
									//表示会送的数据是一个json数据，先parseJSON,转换成json格式，再调用 处理函数处理
									
									if(options.jsonResponseListener){
										try{
											var jsons=parseJSON( req.responseText );
										}catch(e){
											var jsons=false;
										}
										options.jsonResponseListener.call(req,jsons);
									}
									break;
								case 'text/xml':
								case 'application/xml':
								case 'application/xhtml+xml':
									//响应的结果是一个xml字符串
									if ( options.xmlResponseListener ) {
										options.xmlResponseListener.call(req,req.responseXML);
									}
									break;
								case 'text/xml':
								//响应的是html
									if( options.htmlResponseListener ){
										options.htmlResponseListener.call(req,req.responseText);
									}
							}
							//完成后的监听器
							
							if ( options.completeListener ) {
								options.completeListener.call( req,req.responseText );
							}
						}else{
							//响应码不为200
							if( options.errorListener){
								options.errorListener.apply( req,arguments );
							}
						}
						
					}catch(e){
						//内部处理有错误时
						alert(e);
					}
					break;
			}
		};
		//打开请求
		req.open( options.method,url,true );
		//在这里 可以加入自己的请求头信息（可以随便加）
		//例如：req.setRequstHeader('X-yc-Ajax-Request','AjaxRequest');
		return req;
		
	}
	window['yc']['getRequestObject']=getRequestObject;
	
			
			/**
		 * 跨站对象计数器
		 */
		var XssHttpRequestCount=0;
		
		/**
		 *request对象的一个跨站点<script>标签生成器
		 */
		var XssHttpRequest = function(){			//自增
		    this.requestID = 'XSS_HTTP_REQUEST_' + (++XssHttpRequestCount);   //请求的编号，保证唯一. 
		}
		//扩展   httpRequest对象。添加了一些属性
		XssHttpRequest.prototype = {
		    url:null,
		    scriptObject:null,
		    responseJSON:null,    //  包含响应的结果，这个结果已经是json对象，所以不要 eval了. 
		    status:0,        //1表示成功，   2表示错误
		    readyState:0,      
		    timeout:30000,
		    onreadystatechange:function() { },
		    
		    setReadyState: function(newReadyState) {
		        // 如果比当前状态更新，，则更新就绪状态
		        if(this.readyState < newReadyState || newReadyState==0) {
		            this.readyState = newReadyState;
		            this.onreadystatechange();
		        }
		    },
		    
		    open: function(url,timeout){
		        this.timeout = timeout || 30000;
		        // 将一个名字为  XSS_HTTP_REQUEST_CALLBACK的键加到   请求的url地址后面， 值为要回调的函数的名字.这个函数名叫   XSS_HTTP_REQUEST_数字_CALLBACK
		        this.url = url + ((url.indexOf('?')!=-1) ? '&' : '?' ) + 'XSS_HTTP_REQUEST_CALLBACK=' + this.requestID + '_CALLBACK';    
		        this.setReadyState(0);        
		    },
		    
		    send: function(){
		        var requestObject = this;
		        //创建一个用于载入外部数据的  script 标签对象
		        this.scriptObject = document.createElement('script');
		        this.scriptObject.setAttribute('id',this.requestID);
		        this.scriptObject.setAttribute('type','text/javascript');
		        // 先不设置src属性，也先不将其添加到文档.
		
		        // 异常情况： 创建一个在给定的时间 timeout 毫秒后触发的  setTimeout(), 如果在给定的时间内脚本没有载入完成，则取消载入.
		        var timeoutWatcher = setTimeout(function() {
		            // 如果脚本晚于我们指定的时间载入， 则将window中的rquestObject对象中的方法设置为空方法
		            window[requestObject.requestID + '_CALLBACK'] = function() { };
		            // 移除脚本以防止这个脚本的进一步载入。 
		            requestObject.scriptObject.parentNode.removeChild(requestObject.scriptObject);
		            // 因为以上加载的脚本的操作已经超时，并且 脚本标签已经移除，所以将当前  request对象的状态设置为  2,表示错误, 并设置错误文本 
		            requestObject.status = 2;
		            requestObject.statusText = 'Timeout after ' + requestObject.timeout + ' milliseconds.'            
		            
		            // 重新更新  request请求的就绪状态，但请注意，这时，  status 是2 ,而不是200,表示失败了.
		            requestObject.setReadyState(2);
		            requestObject.setReadyState(3);
		            requestObject.setReadyState(4);
		                    
		        },this.timeout);
		        
		        
		        // 在window对象中创建一个与请求中的回调方法名相同的方法，在回调时负责处理请求的其它部分. 
		        window[this.requestID + '_CALLBACK'] = function(JSON) {
		            // 当脚本载入时将执行这个方法同时传入预期的JSON对象. 
		        
		            // 当请求载入成功后，清除timeoutWatcher定时器. 
		            clearTimeout(timeoutWatcher);
		
		            //更新状态
		            requestObject.setReadyState(2);
		            requestObject.setReadyState(3);
		            
		            // 将状态设置为成功. 
		            requestObject.responseJSON = JSON; 
		            requestObject.status=1;
		            requestObject.statusText = 'Loaded.' 
		        
		            // 最后更新状态为  4. 
		            requestObject.setReadyState(4);
		        }
		
		        // 设置初始就绪状态
		        this.setReadyState(1);
		        
		        // 现在再设置src属性并将其添加到文档头部，这样就会访问服务器下载脚本. 
		        this.scriptObject.setAttribute('src',this.url);                    
		        var head = document.getElementsByTagName('head')[0];
		        head.appendChild(this.scriptObject);
		        
		    }
		}
		window['yc']['XssHttpRequest'] = XssHttpRequest;
		
		/**
		 * 设置Xssrequest对象的各个参数.
		 */
		function getXssRequestObject(url,options) {
		    var req = new  XssHttpRequest();
		    options = options || {};
		    //默认超时时间
		    options.timeout = options.timeout || 30000;
		    req.onreadystatechange = function() {
		        switch (req.readyState) {
		            case 1:
		                if(options.loadListener) {
		                    options.loadListener.apply(req,arguments);
		                }
		                break;
		            case 2:
		                if(options.loadedListener) {
		                    options.loadedListener.apply(req,arguments);
		                }
		                break;
		            case 3:
		                if(options.ineractiveListener) {
		                    options.ineractiveListener.apply(req,arguments);
		                }
		                break;
		            case 4:
		                if (req.status == 1) {
		                    // The request was successful
		                    if(options.completeListener) {
		                        options.completeListener.apply(req,arguments);
		                    }
		                } else {
		                    if(options.errorListener) {
		                        options.errorListener.apply(req,arguments);
		                    }
		                }
		                break;
		        }
		    };
		    req.open(url,options.timeout);
		    return req;
		}
		window['yc']['getXssRequestObject'] = getXssRequestObject;
		
		/**
		 * 发送跨站请求:   JSONP的跨站请求只支持  get方式.
		 */
		 /*
			options对象结构：{
				timeout: 超时时间
				'loadListener':readyState=1时的回调函数
				'loadedLIstener':readyState=2时的回调函数
				'ineractiveListener':readyState=3时的回调函数
		
				以下是readyState=4 时的处理回调函数
				'completeListener':处理完成后的回调
				'errorListener':响应码不为200时的回调函数
			}
			*/
		function xssRequest(url,options) {
		    var req = getXssRequestObject(url,options);
		    return req.send(null);
		}
		window['yc']['xssRequest'] = xssRequest;


	
	
	
	/*发送ajax请求XMLHttpRequest
	 options对象的结构，：{
	 				'method':'GET/POST',
	 				'send':发送的参数，
	 				'loadListener':初始化回调			readyState=1
	 				'loadedListener':加载完成后完成回调	readyState=2
	 				'interactiveListener':交互时回调	readyState=3
	 				
	 				//以下是readyState=4的处理
	 				'jsResponseListener':	结果是一个JS代码时的回调处理函数
	 				'jsonResponseListener':	结果是一json时的回调处理函数
	 				'xmlResponseListener':	结果是一个xml时的回调处理函数
	 				'htmlResponseListener':	结果是一个html时的回调处理函数
	 				'completeListener':		处理完成后的回调
	 				
	 				statu==500
	 				'errorListener':响应码不为200时
	 }*/
	function ajaxRequest( url,options ){
		var req=getRequestObject( url,options );
		req.setRequestHeader( "Content-Type","application/x-www-form-urlencoded" );
		return req.send( options.send );
	}
	window['yc']['ajaxRequest']=ajaxRequest;
	
})();
/*==========================================================================================================================*/	
//基于全局对象原型的继承
Object.prototype.toJSONStringTea=function(){
	var jsonstr=[];
	for (var i in this) {
		if ( this.hasOwnProperty(i) ) {
			jsonstr.push('\"'+i+'\":\"'+this[i]+'\"');
		}
		
	}
	var r=jsonstr.join(',\n');
	r="{"+r+"}";
	return r;
}

Array.prototype.toJSONStringTea=function(){
	var arr=[];
	for ( var i=0;i<this.length;i++) {
		arr[i]=( this[i]!=null )? this[i].toJSONStringTea():"null";
	}
	return '['+arr.join(",")+']';
}
Boolean.prototype.toJSONStringTea=function(){return this}
Function.prototype.toJSONStringTea=function(){return this}
Number.prototype.toJSONStringTea=function(){return this}
RegExp.prototype.toJSONStringTea=function(){return this}



































