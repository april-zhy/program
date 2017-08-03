//给相机添加点击事件，弹出拍照的div
$(".toCamera").click(function(){
    $("#takePic").show();
    init(navy_video);
});

//保存拍照上传的图片
function convertCanvasToImage(){
    var pic1=$("canvas")[0].toDataURL("image/png");/*toDataURL这个是DOM对象的函数，所以需要转为DOM*/
    /*截取图片数据*/
    pic=pic1.replace(/^data:image\/(png|jpg);base64,/,"");
    /*将图片数据以post方式传到服务器 server.js*/
    var imgid=0;
    var img=document.createElement("img");
    img.src=pic1;
    img.id="_"+imgid;
    imgid++;
    var comment_pic=$("#comment_pic");
    comment_pic.append(img);
    $("#navy_video").stop();

}

//发表（获取图片与评论内容），显示在页面同时也要存到数据库中去
$("#comment_btn").click(function(){
    var commentDesc=$("#comment_Desc").val();
    var allcomment_pic=$("#comment_pic img");
    var commentPic=[];
    $.ajaxFileUpload({
        url:'/deliverComment',
        secureurl:false,  //SSL用于HTTPS协议
        fileElementId:"fileup",  //要上传的文本框的id
        data:{commentDesc:commentDesc},
        dataType:"json",
        success:function(data,status){
            data= $.trim(data);
            if(data=="2"){
                alert("连接数据库错误");
            }else if(data=="3"){
                alert("取数据错误");
            }else{
                alert("发表成功");
                var commentId=data;
                $("#comment_Desc").val("");
                $("#comment_pic img").remove();
                for(var i=0;i<allcomment_pic.length;i++){
                   commentPic.push( allcomment_pic[i].src );
                }
                var commentTime=new Date().toLocaleString();
                /*动态创建发表后的位置*/
                var div=document.createElement("div");
                div.id="info_"+commentId;             /*评论的ID号*/
                div.className="info";
                var div1=document.createElement("div");
                var div2=document.createElement("div");
                var span_time=document.createElement("span");
                span_time.innerHTML=commentTime;  /*插入时间*/
                span_time.className="info_time";  /*时间样式 */
                div1.className="yonghu";
                div2.className="act_state";
                var a1=document.createElement("a");
                var a2=document.createElement("a");
                a1.href="javascript:void(0)";
                a2.href="javascript:void(0)";
                a2.className="yonghu_name";
                a2.innerHTML="鲁周娟";             /*用户名称*/
                var a1_img=document.createElement("img");
                a1_img.src="img/touxiang.jpg";  /*用户头像*/
                a1_img.className="touxiang";
                var span=document.createElement("span");
                span.innerHTML=commentDesc;        /*插入内容*/
                var br1=document.createElement("br");
                div.appendChild(div1);
                div.appendChild(div2);
                div.appendChild(span_time);
                div1.appendChild(a1);
                div1.appendChild(a2);
                div2.appendChild(span);
                div2.appendChild(br1);

                for(var j=0;j<commentPic.length;j++){
                    var act_state_img=document.createElement("img");
                    act_state_img.id=j;
                    act_state_img.src=commentPic[j];  /*插入图片*/
                    div2.appendChild(act_state_img);
                }

                a1.appendChild(a1_img);
            }
           $(div).appendTo( $("#selfdongtai") );
        },
        error:function(data,status,e){
            alert(e);
        }
    });

});

