function setImagePreviews(imagesObj,divid) {
    var dd = document.getElementById(divid);
    dd.style.display="block";
    dd.innerHTML = "";
    var fileList = imagesObj.files;
    for (var i = 0; i < fileList.length; i++) {            
        dd.innerHTML += "<div style='float:left' > <img id='images" + i + "'  /> </div>";
        var imgObjPreview = document.getElementById("images"+i);
        if (imagesObj.files && imagesObj.files[i]) {
            //火狐下，直接设img属性
            imgObjPreview.style.display = 'block';
            imgObjPreview.style.width = '120px';
            imgObjPreview.style.height = '150px';
            imgObjPreview.src = window.URL.createObjectURL(imagesObj.files[i]);
        }else {
            //IE下，使用滤镜
            imagesObj.select();
            var imgSrc = document.selection.createRange().text; //运用IE滤镜获取数据;
            //alert(imgSrc);
            var localImagId = document.getElementById("images" + i);
            //必须设置初始大小
            localImagId.style.width = "120px";
            localImagId.style.height = "150px";
            //图片异常的捕捉
            try {
                localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader( true,sizingMethod=scale,src = imgSrc)";  //scale：缩放图片以适应对象的尺寸边界。
            }
            catch (e) {
                alert("您上传的图片格式不正确，请重新选择!");
                return false;
            }
            imgObjPreview.style.display = 'none';
            document.selection.empty(); //在当前网页下不能选择对象,也就是鼠标不能选中 
        }
    }  
    return true;
}

//居中显示对象
$.fn.mywin=function(position,hidefunc){
    if(position && position instanceof Object){//position不为空且是一个对象
        var positionleft=position.left;
        var positiontop=position.top;
        var currentwin=this;

        var reg=/(px)/ig;

        positionleft=positionleft.replace(reg,"");
        positiontop=positiontop.replace(reg,"");

        if(!isNaN(positionleft)){
            positionleft=parseInt(positionleft);
        }

        if(!isNaN(positiontop)){
            positiontop=parseInt(positiontop);
        }

        var	mywidth=currentwin.outerWidth(true);
        var	myheight=currentwin.outerHeight(true);
        //var mywidth=obj.width();  //显示的窗口的宽度
        //var myheight=obj.height(); //显示的窗口的高度

        var left;
        var top;

        var width; //浏览器可视区域的宽度
        var height; //浏览器可视区域的高度
        var scrollleft;//滚动条距左边的距离
        var scrolltop;//滚动条距顶部的距离

        //获取浏览器和滚动条的距离
        function getWinInfo(){
            /*width=$(window).width(); //浏览器可视区域的宽度
             height=$(window).height(); //浏览器可视区域的高度
             scrollleft=$(window).scrollLeft();//滚动条距左边的距离
             scrolltop=$(window).scrollTop();//滚动条距顶部的距离*/
            var obj=currentwin.parent();
            width=obj.width(); //浏览器可视区域的宽度
            height=obj.height(); //浏览器可视区域的高度
            scrollleft=obj.scrollLeft();//滚动条距左边的距离
            scrolltop=obj.scrollTop();//滚动条距顶部的距离
        }

        function calleft(positionleft,scrollleft,width,mywidth){//显示位置 滚动条左边距  浏览器可见区宽度  显示的层的宽度
            if(positionleft!="" && typeof(positionleft)=="string"){
                if(positionleft=="center"){
                    left=scrollleft+(width-mywidth)/2;
                }else if(positionleft=="left"){
                    left=scrollleft;
                }else if(positionleft=="right"){
                    left=scrollleft+width-mywidth;
                }else{
                    left=scrollleft+(width-mywidth)/2;
                }
            }else if(positionleft!="" && typeof(positionleft)=="number"){
                left=positionleft;
            }else{
                left=0;
            }
            //currentwin.data("positionleft",positionleft);//将位置存起来，便于浏览器窗口大小改变或滚动条滚动时重新定位使用
        }

        function caltop(positiontop,scrolltop,height,myheight){
            if(positiontop!="" && typeof(positiontop)=="string"){
                if(positiontop=="center"){
                    top=scrolltop+(height-myheight)/2;
                }else if(positiontop=="top"){
                    top=scrolltop;
                }else if(positiontop=="bottom"){
                    top=scrolltop+height-myheight;
                }else{
                    top=scrolltop+(height-myheight)/2;
                }
            }else if(positiontop!="" && typeof(positiontop)=="number"){
                top=positiontop;
            }else{
                top=0;
            }
            //currentwin.data("positiontop",positiontop);//将位置存起来，便于浏览器窗口大小改变或滚动条滚动时重新定位使用
        }

        getWinInfo();
        calleft(positionleft,scrollleft,width,mywidth);  //初始化是调用一次
        caltop(positiontop,scrolltop,height,myheight);

        //浏览器滚动条滚动时
        var scrollTimeout; //延迟处理
        $(window).scroll(function(){
            //clearTimeOut(scrollTimeout);
            //scrollTimeout=setTimeout(function(){
            getWinInfo();
            calleft(positionleft,scrollleft,width,mywidth);
            caltop(positiontop,scrolltop,height,myheight);
            //currentwin.css("left",left).css("top",top);//当窗口大小改变时蹦一下就过去了，不好看
            currentwin.animate({left:left,top:top},300);  //延迟300毫秒后改变left和top，这样就会以动画的形式移动窗口
            //},300);
        });

        //浏览器窗口改变大小时
        $(window).resize(function(){
            getWinInfo();
            calleft(positionleft,scrollleft,width,mywidth);
            caltop(positiontop,scrolltop,height,myheight);
            //currentwin.css("left",left).css("top",top);//当窗口大小改变时蹦一下就过去了，不好看
            currentwin.animate({left:left,top:top},300);  //延迟300毫秒后改变left和top的值
        });

        //currentwin.css({left:left,top:top}).show("slow");
        currentwin.css({left:left,top:top}).css("display","block");

        //点击关闭按钮图片时关闭层
        currentwin.children(".navy_title").children("img").click(function(){
            if(!hidefunc){//默认为慢慢隐藏
                currentwin.slideUp();
                $(".bg").fadeOut("3000","linear");
            }else{
                hidefunc();
            }
        });
    }

    //$(".title images").bind("click",function(){
    //它的父类(title)的父类(window)
    //$(this).parent().parent().css("display","none").hide("slow");
    //});

    return this; //一定要把当前对象返回回去，不然调用此方法后，后面的代码不会再执行
}